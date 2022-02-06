import m from 'mithril';
import { FlatButton, ModalPanel } from 'mithril-materialized';
import { LayoutForm, UIForm, render } from 'mithril-ui-form';
import { Dashboards } from '../models';
import { MeiosisComponent } from '../services';
import { TextInputWithClear } from './ui';

// const createTextFilter = (txt: string) => {
//   if (!txt) return () => true;
//   const checker = new RegExp(txt, 'i');
//   return ({ label = '', id = '' }: { label: string; id?: string }) =>
//     checker.test(id) || checker.test(label);
// };

const md = `#### Taxonomy

Definitions and abbreviations of commonly used words.`;

const TaxonomyForm = [
  {
    id: 'lexicon',
    label: 'Definitions',
    repeat: true,
    pageSize: 1,
    propertyFilter: 'label',
    sortProperty: 'id',
    type: [
      { id: 'id', label: 'Term', type: 'text', className: 'col s4 m3' },
      { id: 'label', type: 'text', label: 'Description', className: 'col s8 m9' },
      { id: 'ref', type: 'text', label: 'Reference', className: 'col s4 m3' },
      { id: 'url', type: 'url', label: 'Reference URL', className: 'col s8 m9' },
    ],
  },
] as UIForm;

let textFilter = '';

export const TaxonomyPage: MeiosisComponent = () => ({
  oninit: ({
    attrs: {
      actions: { setPage },
    },
  }) => setPage(Dashboards.TAXONOMY),
  view: ({
    attrs: {
      state: {
        app: { dsModel },
      },
      actions: { saveModel },
    },
  }) => {
    const { items = [] } = dsModel;
    const lexicon = items;

    const filteredLexicon = lexicon;
    // lexicon &&
    // lexicon instanceof Array &&
    // lexicon
    //   .filter(createTextFilter(textFilter))
    //   .filter((l) => typeof l.id !== 'undefined' && typeof l.label !== 'undefined')
    //   .sort((a, b) => (a.id.toLowerCase() > b.id.toLowerCase() ? 1 : -1));

    return [
      m('.row', { style: 'height: 100vh' }, [
        m(FlatButton, {
          label: 'Add new term',
          iconName: 'add',
          className: 'col s6 l3',
          modalId: 'add-term',
        }),
        m(TextInputWithClear, {
          label: 'Text filter of events',
          id: 'filter',
          initialValue: textFilter,
          placeholder: 'Part of term or description...',
          iconName: 'filter_list',
          onchange: (v?: string) => (textFilter = v ? v : ''),
          style: 'margin-bottom: -4rem',
          className: 'col s6 offset-l6 l3',
        }),
        m('.intro.col.s12', m.trust(render(md, false))),
        filteredLexicon &&
          m('table.highlight', { style: 'margin-bottom: 3rem' }, [
            m(
              'thead',
              m('tr', [
                m('th', 'Term'),
                m('th', 'Description'),
                m('th.hide-on-med-and-down', 'Reference'),
              ])
            ),
            m(
              'tbody',
              filteredLexicon.map((l) =>
                m('tr', [
                  m('td', m('strong', l.a)),
                  m('td', m.trust(render(l.b))),
                  l.ref &&
                    m(
                      'td.hide-on-med-and-down',
                      l.url
                        ? m(
                            'a',
                            {
                              target: '_',
                              alt: l.ref,
                              href: l.url,
                            },
                            l.ref
                          )
                        : l.ref
                    ),
                ])
              )
            ),
          ]),
        m(ModalPanel, {
          id: 'add-term',
          title: 'Add a new term',
          description: m(LayoutForm, {
            form: TaxonomyForm,
            obj: {},
            // obj: data,
            onchange: () => {
              console.log(JSON.stringify(dsModel, null, 2));
              saveModel(dsModel);
            },
          }),
          bottomSheet: true,
        }),
      ]),
    ];
  },
});
