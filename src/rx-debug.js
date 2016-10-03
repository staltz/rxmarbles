import Rx from 'rx';

var Observable = Rx.Observable,
  inherits = Rx.internals.inherits,
  ObservableBase = Rx.ObservableBase,
  Disposable = Rx.Disposable,
  AbstractObserver = Rx.internals.AbstractObserver,
  observableProto = Observable.prototype;

var DebugObservable = (function (__super__) {
  inherits(DebugObservable, __super__);
  function DebugObservable(source, key) {
    this.source = source;
    this._key = key;
    __super__.call(this);
  }

  DebugObservable.prototype.subscribeCore = function (o) {
    var parent = this.source.subscribe(new DebugObserver(o, this._key));
    return Disposable.create(() => {
      console.log('rx.debug', 'dispose', this._key);
      parent.dispose();
    })
  };

  return DebugObservable;
}(ObservableBase));

var DebugObserver = (function (__super__) {
    inherits(DebugObserver, __super__);
    function DebugObserver(o, key) {
      console.log('rx.debug', 'subscription', key);
      this._o = o;
      this._key = key;
      __super__.call(this);
    }

    DebugObserver.prototype.next = function (x) {
      console.log('rx.debug', this._key, 'next', x);
      this._o.onNext(x);
    };

    DebugObserver.prototype.error = function (e) {
      console.log('rx.debug', this._key, 'error', e);
      this._o.onError(e);
    };

    DebugObserver.prototype.completed = function () {
      console.log('rx.debug', this._key, 'completed');
      this._o.onCompleted();
    };

    return DebugObserver;
  }(AbstractObserver));

export default function(){
  observableProto.debug = function(key){
    return new DebugObservable(this, key);
  }
};
