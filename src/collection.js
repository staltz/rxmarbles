import { makeCollection } from '@cycle/collection';
import rxjsAdapter from '@cycle/rxjs-adapter';

export const Collection = makeCollection(rxjsAdapter);
