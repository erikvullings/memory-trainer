import m from 'mithril';
import { render } from 'mithril-ui-form';
import { Dashboards } from '../models';
import { DataItem } from '../models/data-set';
import { MeiosisComponent } from '../services';
import { subSup } from '../utils';
import { TextInputWithClear } from './ui';

const createTextFilter = (txt: string) => {
  if (!txt) return () => true;
  const checker = new RegExp(txt, 'i');
  return ({ a = '', b = '' }: DataItem) => checker.test(a) || checker.test(b);
};

const md = `#### Overview of all defined words`;

let textFilter = '';

export const AllWordsPage: MeiosisComponent = () => ({
  oninit: ({
    attrs: {
      actions: { setPage },
    },
  }) => setPage(Dashboards.ALL_WORDS),
  view: ({
    attrs: {
      state: {
        app: { dsModel },
      },
    },
  }) => {
    const { items = [] } = dsModel;
    const lexicon = items;

    const filteredLexicon =
      lexicon &&
      lexicon instanceof Array &&
      lexicon
        .filter((l) => typeof l.a !== 'undefined' && typeof l.b !== 'undefined')
        .filter(createTextFilter(textFilter))
        .sort((a, b) => (a.a.toLowerCase() > b.a.toLowerCase() ? 1 : -1));

    return [
      m('.row', { style: 'height: 100vh' }, [
        m(TextInputWithClear, {
          label: 'Text filter of events',
          id: 'filter',
          initialValue: textFilter,
          placeholder: 'Part of term or description...',
          iconName: 'filter_list',
          onchange: (v?: string) => (textFilter = v ? v : ''),
          style: 'margin-bottom: -4rem',
          className: 'col s6 offset-m8 m4',
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
                  m('td', m.trust(render(subSup(l.a)))),
                  m('td', m.trust(render(subSup(l.b)))),
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
      ]),
    ];
  },
});
