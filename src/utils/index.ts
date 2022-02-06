import { padLeft } from 'mithril-materialized';

/**
 * Create a GUID
 * @see https://stackoverflow.com/a/2117523/319711
 *
 * @returns RFC4122 version 4 compliant GUID
 */
export const uuid4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // tslint:disable-next-line:no-bitwise
    const r = (Math.random() * 16) | 0;
    // tslint:disable-next-line:no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Create a unique ID
 * @see https://stackoverflow.com/a/2117523/319711
 *
 * @returns RFC4122 version 4 compliant GUID
 */
export const uniqueId = () => {
  return 'idxxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // tslint:disable-next-line:no-bitwise
    const r = (Math.random() * 16) | 0;
    // tslint:disable-next-line:no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const capitalize = (s?: string) => s && s.charAt(0).toUpperCase() + s.slice(1);

export const toLetters = (num: number): string => {
  const mod = num % 26;
  // tslint:disable-next-line:no-bitwise
  let pow = (num / 26) | 0;
  const out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
  return pow ? toLetters(pow) + out : out;
};

/**
 * Generate a sequence of numbers between from and to with step size: [from, to].
 *
 * @static
 * @param {number} from
 * @param {number} to : inclusive
 * @param {number} [count=to-from+1]
 * @param {number} [step=1]
 * @returns
 */
export const range = (
  from: number,
  to: number,
  count: number = to - from + 1,
  step: number = 1
) => {
  // See here: http://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
  // let a = Array.apply(null, {length: n}).map(Function.call, Math.random);
  const a: number[] = new Array(count);
  const min = from;
  const max = to - (count - 1) * step;
  const theRange = max - min;
  const x0 = Math.round(from + theRange * Math.random());
  for (let i = 0; i < count; i++) {
    a[i] = x0 + i * step;
  }
  return a;
};

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
export const shuffle = (a: Array<any>) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const unwantedChars = /[\-'_]/g;

export const cleanUpSpecialChars = (str: string) =>
  str
    .replace(/[ÀÁÂÃÄÅàáâãäå]/g, 'a')
    .replace(/[ÈÉÊËèéêë]/g, 'e')
    .replace(/[ÒÓÔÖòóôö]/g, 'o')
    .replace(/[ÌÍÎÏìíîï]/g, 'i')
    .replace(/[ÙÚÛÜùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ș]/g, 's')
    .replace(/[ț]/g, 't')
    .replace(/[\/\-]|&amp;|\s+/g, ' ')
    .replace(/[^a-z0-9 ]/gi, ''); // final clean up

/**
 * Join a list of items with a comma.
 * Removes empty items, and optionally adds brackets around the comma separated list.
 */
export const formatOptional = (
  options: { brackets?: boolean; prepend?: string; append?: string },
  ...items: Array<string | number | undefined>
) => {
  const { brackets, prepend = '', append = '' } = options;
  const f = items.filter((i) => typeof i !== 'undefined' && i !== '');
  if (!f || f.length === 0) {
    return '';
  }
  const txt = `${prepend}${f.join(', ')}${append}`;
  return f.length === 0 ? '' : brackets ? ` (${txt})` : txt;
};

export const debounce = (func: (...args: any) => void, timeout: number) => {
  let timer: number;
  return (...args: any) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      func(...args);
    }, timeout);
  };
};

export const formatDate = (date: number | Date = new Date()) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${padLeft(d.getMonth() + 1)}-${padLeft(d.getDate())}`;
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive), optionally filtered.
 * If a filter is supplied, only returns numbers that satisfy the filter.
 *
 * @param {number} min
 * @param {number} max
 * @param {Function} filter numbers that do not satisfy the condition
 */
export const random = (
  min: number,
  max: number,
  f?: (n: number, min?: number, max?: number) => boolean
): number => {
  const x = min >= max ? min : Math.floor(Math.random() * (max - min + 1)) + min;
  return f ? (f(x, min, max) ? x : random(min, max, f)) : x;
};

/**
 * Draw N random (unique) numbers between from and to.
 *
 * @static
 * @param {number} from
 * @param {number} to
 * @param {number} count
 * @param {number[]} [existing]
 * @param {(n: number) => boolean} [filter] Optional filter to filter out the results
 * @returns
 */
export const randomNumbers = (
  from: number,
  to: number,
  count: number,
  existing: number[] = [],
  filter?: (n: number, existing?: number[]) => boolean
) => {
  if (from === to) {
    return Array(count).fill(to);
  }
  if (from > to || count - 1 > to - from) {
    throw Error('Outside range error');
  }
  const result: number[] = [];
  do {
    const x = random(from, to);
    if (existing.indexOf(x) < 0 && result.indexOf(x) < 0) {
      if (!filter || filter(x, result)) {
        result.push(x);
        count--;
      } else {
        count += result.length;
        result.length = 0;
      }
    }
  } while (count > 0);
  return result;
};

/**
 * Returns n random items from an array
 */
export const randomItems = <T>(arr: T[], count = 5): T[] =>
  randomNumbers(0, arr.length - 1, count).map((i) => arr[i]);

/**
 * Get date of ISO week, i.e. starting on a Monday.
 * @param week week number
 * @param year year
 */
export const getDateOfISOWeek = (week: number, year?: number) => {
  const w = year ? week : week % 100;
  if (!year) {
    year = Math.round((week - w) / 100);
  }
  const simple = new Date(year, 0, 1 + (w - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }
  return ISOweekStart;
};

export const getWeekNumber = (date: Date) => {
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.valueOf() - yearStart.valueOf()) / 86400000 + 1) / 7);
};

export const list = (arr: string[] = [], prefix = '') =>
  arr.length === 0
    ? ''
    : prefix +
      (arr.length === 1
        ? arr[0]
        : `${arr.slice(0, arr.length - 1).join(', ')} en ${arr[arr.length - 1]}`);

export const getTextColorFromBackground = (backgroundColor?: string) => {
  if (!backgroundColor) return 'black-text';
  const c = backgroundColor.substring(1); // strip #
  const rgb = parseInt(c, 16); // convert rrggbb to decimal
  const r = (rgb >> 16) & 0xff; // extract red
  const g = (rgb >> 8) & 0xff; // extract green
  const b = (rgb >> 0) & 0xff; // extract blue

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

  return luma < 105 ? 'white-text' : 'black-text';
};
