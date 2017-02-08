import { values, merge } from 'ramda';

import { categories } from './categories';

export const examples = values(categories).reduce(merge, {});

export { categories };
