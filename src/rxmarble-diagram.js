import { div, makeDOMDriver } from "@cycle/dom";
import { run } from "@cycle/rxjs-run";
import { Observable } from "rxjs";
import { of } from "rxjs/observable/of";
import { apply, flip, identity, length, map, merge, prop, zip } from "ramda";

import { Collection } from "./collection";
import { bgWhite } from "./styles";
import { merge as mergeStyles, elevation1 } from "./styles/utils";

import { Timeline } from "./components/timeline";

import { createOutputStream$ } from "./components/sandbox/sandbox-output";
import { inputsToTimelines } from "./components/sandbox/sandbox-input";
import { renderOperatorBox } from "./components/sandbox/operator-label";

const sandboxStyle = mergeStyles(bgWhite, elevation1, { borderRadius: "2px" });

const main = (operator, isInteractive) => (sources) =>
  render(sources, operator, isInteractive);

const dummyDriver = (initialValue) => (value) =>
  value.remember().startWith(initialValue);

/**
 * simpler render function
 */
const render = ({ DOM, store }, operator, isInteractive = true) => {
  // operator process
  const operatorObs = of(operator);
  const timelineInputs = operatorObs
    .switchMap((example) =>
      store
        .pluck("inputs")
        .filter(identity)
        // bug: For some reason inputDataList$ emits old value after
        // route change. Skip it.
        .skip(1)
        .startWith(inputsToTimelines(example.inputs))
    )
    .publishReplay(1)
    .refCount();

  const inputTimelines = Collection.gather(
    Timeline,
    { DOM },
    timelineInputs,
    "id"
  )
    .publishReplay(1)
    .refCount();

  const inputDOMs = Collection.pluck(inputTimelines, prop("DOM"));
  const inputDataList = Collection.pluck(inputTimelines, prop("data"))
    .filter(length)
    .debounceTime(0)
    .withLatestFrom(timelineInputs, zip)
    .map(map(apply(flip(merge))));

  const outputTimeline = createOutputStream$(operatorObs, inputDataList);

  // rendering process
  const outputTimelineSources = {
    DOM,
    marbles: outputTimeline.pluck("marbles"),
    end: outputTimeline.pluck("end"),
    interactive: Observable.of(isInteractive),
  };

  const outputTimeline2 = Timeline(outputTimelineSources);
  const renderedDOM = Observable.combineLatest(
    inputDOMs,
    outputTimeline2.DOM
  ).map(([inputsDOMs, outputDOM]) =>
    div({ style: sandboxStyle }, [
      ...inputsDOMs,
      renderOperatorBox(operator.label),
      outputDOM,
    ])
  );

  return {
    DOM: renderedDOM,
    data: inputDataList.map((inputs) => ({ inputs })),
  };
};

export const drawDiagram = (DomElement, operator, isInteractive = true) => {
  run(main(operator, isInteractive), {
    DOM: makeDOMDriver(DomElement),
    store: dummyDriver({}),
  });
  return DomElement;
};
