import { merge, fromEvent, NEVER } from 'rxjs'
import {
  map,
  mapTo,
  switchMap,
  startWith,
  publishReplay,
  refCount,
  pluck,
  distinctUntilChanged,
  withLatestFrom,
  takeUntil
} from 'rxjs/operators'
import { path, max, min } from 'ramda'

const mouseMove$ = fromEvent( document, 'mousemove' )
const mouseUp$ = fromEvent( document, 'mouseup' )

function getPercentageFn ( element ) {
  const { width, left } = element.getBoundingClientRect()
  const ratio = (100 / width) || 0.15
  const elementLeft = left + window.scrollX
  return ( x ) => (x - elementLeft) * ratio
}

function getPausable$ ( pause$, obsv$ ) {
  return pause$.pipe( switchMap( pause => pause ? obsv$ : NEVER ) )
}

function intent ( elementClass, DOMSource, isDraggable$ ) {
  const element = DOMSource.select( '.' + elementClass )

  const startHighlight$ = element.events( 'mouseenter' ).pipe( mapTo( true ) )
  const stopHighlight$ = element.events( 'mouseleave' ).pipe( mapTo( false ) )
  const isHighlighted$ = getPausable$(
    isDraggable$, merge( startHighlight$, stopHighlight$ ) )
    .pipe(
      startWith( false ),
      publishReplay( 1 ),
      refCount()
    )

  const timeChange$ = element.events( 'mousedown' )
    .pipe(
      map( path( [ 'currentTarget', 'parentElement' ] ) ),
      map( getPercentageFn ),
      switchMap( getPercentage =>
        mouseMove$.pipe(
          takeUntil( mouseUp$ ),
          pluck( 'pageX' ),
          map( getPercentage ),
          distinctUntilChanged()
        )
      )
    )


  return { timeChange$, isHighlighted$ }
}

function model ( props$, timeSource$, timeChange$, isDraggable$ ) {
  const restrictedTimeChange$ = getPausable$( isDraggable$, timeChange$ )
    .pipe(
      map( max( 0 ) ),
      map( min( 100 ) )
    )

  const minChange$ = props$.pipe(
    pluck( 'minTime' ),
    distinctUntilChanged(),
    withLatestFrom( timeSource$, max )
  )

  const maxChange$ = props$.pipe(
    pluck( 'maxTime' ),
    distinctUntilChanged(),
    withLatestFrom( timeSource$, min )
  )

  return merge(
    // order matters
    timeSource$, restrictedTimeChange$, minChange$, maxChange$ )
    .pipe(
      distinctUntilChanged(),
      publishReplay( 1 ),
      refCount()
    )
}

export function timelineItem ( elementClass, view, sources ) {
  const { DOM, props, time: timeSource$, isDraggable } = sources
  const { timeChange$, isHighlighted$ }
    = intent( elementClass, DOM, isDraggable )
  const time$ = model( props, timeSource$, timeChange$, isDraggable )
  const vtree$ = view( sources, time$, isHighlighted$ )
  return { DOM: vtree$, time: time$ }
}
