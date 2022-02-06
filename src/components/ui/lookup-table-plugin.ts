import m from 'mithril';
import { Select } from 'mithril-materialized';
import { IInputField, resolveExpression } from 'mithril-ui-form';
import { PluginType } from 'mithril-ui-form-plugin';
import { getTextColorFromBackground } from '../../utils';

type LookupTableFieldType = IInputField & {
  /** Path to the row ID */
  rowId: string;
  /** Path to the col ID */
  colId: string;
  /** Property name of an array of options (id, label) that you wish to use as result */
  options: string;
  /** Property name of an array of options (id, label) that you wish to use as result */
  table: string;
};

type LookupTable = Array<{
  rowId: string;
  colId: string;
  optionId: string;
}>;

type LookupTableCreatorFieldType = IInputField & {
  /** Property name of the table */
  table: LookupTable;
  /** Property name of an array of options (id, label) that you wish to use as result */
  options: string;
  /** Property name of an array of options (id, label) that you wish to use as row label */
  rows: string;
  /** Property name of an array of options (id, label) that you wish to use as column label */
  cols: string;
};

export const lookupTable: PluginType = () => {
  return {
    view: ({ attrs: { field, obj, context = [], onchange } }) => {
      const {
        id = '',
        table = '',
        rowId = '',
        colId = '',
        label = '',
        options = '',
      } = field as LookupTableFieldType;
      if (obj instanceof Array) return;
      const tbl = resolveExpression(table, [obj, context]) as LookupTable;
      const rId = resolveExpression(rowId, [obj, context]) as string;
      const cId = resolveExpression(colId, [obj, context]) as string;
      const optTmp =
        typeof options === 'string' &&
        (resolveExpression(options, [obj, context]) as Array<{
          id: string;
          label: string;
          color?: string;
        }>);
      // console.log({ tbl, rId, cId });
      const optionId =
        tbl &&
        tbl instanceof Array &&
        tbl.filter((t) => t.rowId === rId && t.colId === cId).shift();
      const opt = optTmp && optionId && optTmp.filter((o) => o.id === optionId.optionId).shift();
      const color = opt && opt.color ? opt.color : '#f0f8ff';

      if (onchange && opt && obj[id] !== opt.id) onchange(opt.id);
      return m('section', [
        m('.divider'),
        m(
          '.row',
          m(
            '.col.s12.right-align',
            m(
              `.assessment-score.${getTextColorFromBackground(color)}`,
              {
                style: `border: solid 2px black; border-radius: 8px; background: ${color}; float: right; padding: 5px; margin-top: 10px;`,
              },
              [m('strong', `${label}: `), m('span', opt ? opt.label : 'TBD')]
            )
          )
        ),
      ]);
    },
  };
};

/**
 * Creates an editable lookup table between row, column and options.
 */
export const lookupTableCreatorPlugin: PluginType = () => {
  return {
    view: ({ attrs: { field, obj, context = [], onchange } }) => {
      const {
        id = '',
        label = '',
        options = '',
        rows = '',
        cols = '',
      } = field as LookupTableCreatorFieldType;
      if (obj instanceof Array) return;
      if (!obj.hasOwnProperty(id)) obj[id] = [];
      const items = obj[id] as Array<{ rowId: string; colId: string; optionId: string }>;
      const optTmp =
        typeof options === 'string' &&
        (resolveExpression(options, [obj, context]) as Array<{ id: string; label: string }>);
      const opt = optTmp && optTmp.filter((o) => o.id && o.label);
      const rowOpt = resolveExpression(rows, [obj, context]) as Array<{
        id: string;
        label: string;
      }>;
      const colOpt = resolveExpression(cols, [obj, context]) as Array<{
        id: string;
        label: string;
      }>;
      const canCreateTable =
        rowOpt && rowOpt.length > 0 && colOpt && colOpt.length > 0 && opt && opt.length > 0;

      const lookup =
        canCreateTable &&
        rowOpt.reduce((acc, row) => {
          const { id } = row;
          if (!(id in acc)) acc[id] = {};
          colOpt.forEach((col) => (acc[id][col.id] = ''));
          return acc;
        }, {} as Record<string, Record<string, string>>);
      lookup &&
        items.forEach((item) => {
          const { rowId, colId, optionId } = item;
          if (rowId in lookup && colId) lookup[rowId][colId] = optionId;
        });

      // console.log({ opt, canCreateTable, lookup });

      return (
        opt &&
        rowOpt &&
        rowOpt &&
        m('.section', [
          m('.divider'),
          lookup &&
            m(
              '.row',
              m('.col.s12', [
                m('table.highlight.responsive-table', [
                  m(
                    'thead',
                    m('tr', [m('th', label), ...colOpt.map((c) => m('th.center-align', c.label))])
                  ),
                  m(
                    'tbody',
                    rowOpt.map((r) =>
                      m('tr', [
                        m('td.bold', r.label),
                        ...colOpt.map((c) =>
                          m(
                            'td',
                            m(Select, {
                              label: '',
                              placeholder: 'Pick one',
                              options: opt,
                              initialValue: lookup[r.id][c.id],
                              onchange: (v) => {
                                lookup[r.id][c.id] = v[0] as string;
                                obj[id] = rowOpt.reduce((acc, row) => {
                                  colOpt.forEach((col) =>
                                    acc.push({
                                      rowId: row.id,
                                      colId: col.id,
                                      optionId: lookup[row.id][col.id],
                                    })
                                  );
                                  return acc;
                                }, [] as LookupTable);
                                onchange && onchange(obj[id]);
                              },
                            })
                          )
                        ),
                      ])
                    )
                  ),
                ]),
              ])
            ),
        ])
      );
    },
  };
};
