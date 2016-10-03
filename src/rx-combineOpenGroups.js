import Rx from 'rx';

var Observable = Rx.Observable,
  observableProto = Observable.prototype;

export default function(){
  observableProto.combineOpenGroups = function(selector, groupTransform){
    if(typeof selector == 'undefined' || selector == null) {
      selector = (v) => v;
    }
    if(typeof groupTransform == 'undefined' || groupTransform == null) {
      groupTransform = (v) => v;
    }

    return this
      .flatMap(group => {
        return groupTransform(group)
          .map(item => [group.key, selector(item)])
          .concat(Rx.Observable.just([group.key, false]))
      })
      .scan((memo, next) => {
        var copy = Object.keys(memo)
          .reduce((o, k) => { o[k] = memo[k]; return o }, {});
        if(next[1] === false) {
          delete copy[next[0]];
        } else {
          copy[next[0]] = next[1];
        }
        return copy;
      }, {})
      .map(obj => Object.keys(obj).map(k => obj[k]))
  }
};
