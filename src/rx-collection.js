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
          .scan([], (memory, [index, observable]) => {
            let inserted = observable.doOnCompleted(() => {
              let index = memory.indexOf(inserted)
              if(index >= 0) memory.splice(memory.indexOf(inserted))
            });
            memory[index] = inserted;
            return memory;
          })
          .flatMapLatest(list => {
            return Observable.combineLatest(list.filter(v => true), (...args) => args)
          })
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
