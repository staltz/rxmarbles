import Rx from 'rx';

var Observable = Rx.Observable,
  observableProto = Observable.prototype;

export default function(){
  observableProto.collection = function(config) {
    let root = this.share(), merge = [], latest = [];
    
    if(config.merge) {
      merge = Object.keys(config.merge).map(field => {
        let mapping = config.merge[field]
        if(typeof mapping == 'function') {
          return [field, root
            .flatMap(item => mapping(item))]
        } else if(typeof mapping == 'string') {
          return [field, root.flatMap(item => item[mapping])]
        } else {
          console.warn("unknown collection operation for merge-field", field)
        }
      })
    }

    if(config.latest) {
      latest = Object.keys(config.latest).map(field => {
        let mapping = config.latest[field]
        let combined = root
          .map((item, index) => {
            if(typeof mapping == 'function') {
              return [index, mapping(item)]
            } else if(typeof mapping == 'string') {
              return [index, item[mapping]]
            } else {
              console.warn("unknown collection operation for latest-field", field)
            }
          })
          .flatMap(([index, obs]) => obs.publish(o => o
              .filter(_ => false)
              .concat(Observable.of([index, undefined]))
              .startWith([index, o]))
          )
          .scan((memory, [index, observable]) => {
            // TODO remove undesired shareReplay: 
            // the publish above causes the original source not to replay,
            // since the subscription is kept open.
            memory[index] = observable && observable.shareReplay(1);
            return memory;
          }, [])
          .map(list => list.filter(v => typeof v !== 'undefined'))
          .flatMapLatest((list, c) =>
            Observable.combineLatest(list, (...args) => args)
          )
        return [field, combined]
      })
    }

    return merge.concat(latest)
      .reduce((obj, [field, obs]) => {
        obj[field] = obs;
        return obj;
      }, {});
  }
};
