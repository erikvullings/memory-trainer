import m from 'mithril';
import { LayoutForm } from 'mithril-ui-form';
import { Dashboards } from '../models';
import { MeiosisComponent } from '../services';

export const PrepareDataPage: MeiosisComponent = () => ({
  oninit: ({
    attrs: {
      actions: { setPage },
    },
  }) => setPage(Dashboards.PREPARATION),
  view: ({
    attrs: {
      state: {
        app: { dsModel },
      },
      actions: { saveModel },
    },
  }) => {
    return [
      m(
        '.row',
        m(
          '.col.s12',
          m(LayoutForm, {
            form: [
              {
                id: 'items',
                label: 'Definitions',
                repeat: true,
                repeatItemClass: 'from-to-definition',
                onNewItem: () => ({ reversible: true }),
                type: [
                  {
                    id: 'a',
                    label: 'From',
                    type: 'text',
                    className: 'col s6 m5',
                  },
                  {
                    id: 'b',
                    label: 'To',
                    type: 'text',
                    className: 'col s6 m5',
                  },
                  {
                    id: 'reversible',
                    label: 'Reversible',
                    type: 'switch',
                    className: 'col s12 m2',
                  },
                ],
              },
            ],
            obj: dsModel,
            onchange: () => {
              saveModel(dsModel);
            },
          })
        )
      ),
    ];
  },
});
