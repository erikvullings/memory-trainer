export type DataItem = { a: string; b: string; ref?: string; url?: string; reversible?: boolean };

export type DataSet = {
  version: number;
  author: string;
  title: string;
  items: DataItem[];
};
