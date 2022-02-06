export type DataItem = { a: string; b: string; ref?: string; url?: string; reversible?: boolean };

export type DataSet = {
  created: number;
  version: number;
  author: string;
  title: string;
  items: DataItem[];
};

/** Create an empty data set */
export const emptyDataSet = (): DataSet => ({
  created: new Date().valueOf(),
  version: 0,
  author: '',
  title: '',
  items: [],
});
