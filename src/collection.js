import { makeCollection } from '@cycle/collection';
import rxjsAdapter from '@cycle/rxjs-adapter';
// OR import rxAdapter from '@cycle/rx-adapter';
// OR import mostAdapter from '@cycle/most-adapter';

export const Collection = makeCollection(rxjsAdapter);
