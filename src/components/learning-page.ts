import m from 'mithril';
import { FlatButton, Icon } from 'mithril-materialized';
import { render } from 'mithril-ui-form';
import { Dashboards } from '../models';
import { MeiosisComponent } from '../services';
import { shuffle, subSup } from '../utils';
// import { TextInputWithClear } from './ui';

export const LearningPage: MeiosisComponent = () => {
  const SMALL_CARD_HEIGHT = 300; // specified in CSS

  let cardIdxs: number[] | undefined;
  let curIdx: number | undefined = 0;

  const replayAll = (items: unknown[], resetScore: () => void) => {
    cardIdxs = shuffle(items.map((_, i) => i));
    curIdx = cardIdxs.shift();
    resetScore();
  };

  return {
    oninit: ({
      attrs: {
        state: {
          app: { dsModel },
        },
        actions: { setPage, resetScore },
      },
    }) => {
      const { items } = dsModel;
      replayAll(items, resetScore);
      setPage(Dashboards.TRAIN);
    },
    view: ({
      attrs: {
        state: {
          app: { dsModel, correctIdxs, wrongIdxs },
        },
        actions: { changePage, updateScore, resetScore },
      },
    }) => {
      const { items } = dsModel;
      if (!items) {
        return changePage(Dashboards.PREPARATION);
      }
      const nextCard = (isOK: boolean) => {
        const idx = curIdx as number;
        curIdx = cardIdxs?.shift();
        updateScore(idx, isOK);
      };

      // if (curIdx >= items.length) curIdx = 0;
      const { a = '', b = '' } = typeof curIdx !== 'undefined' ? items[curIdx] : {};
      const [from, to] = [a, b];

      const remaining = cardIdxs ? cardIdxs.length : 0;
      const total = remaining + correctIdxs.size + wrongIdxs.size;
      const score = total > 0 ? Math.round((100 * correctIdxs.size) / total) : 0;
      const progress = total ? Math.round((100 * (total - remaining)) / total) : 0;
      const top = (progress * SMALL_CARD_HEIGHT) / 100;
      console.log({ remaining, total, score, progress, top });

      return m('.learn', [
        m('.row', [
          m(
            '.col.s12.m2',
            m(
              '#progress-result.card.small',
              m(
                '.card-content.no-select',
                m('.remaining-cards', { style: `top: ${top}px` }, [
                  m('p.center-align.progress-view', m.trust(`Progress<br>${progress}%`)),
                ])
              )
            )
          ),
          m('.col.s12.m8', [
            typeof curIdx !== 'undefined'
              ? m('.card.small.no-select', { key: curIdx }, [
                  m('.card-content', [
                    m('span.card-title.activator', [
                      m.trust(render(subSup(from), true)),
                      m(Icon, { iconName: 'more_vert', className: 'right' }),
                    ]),
                    m('p.activator', { style: 'height: 200px; cursor: pointer' }),
                  ]),
                  m('.card-reveal', [
                    m('span.card-title', [
                      m.trust(render(subSup(from), true)),
                      m(Icon, { iconName: 'close', className: 'right' }),
                    ]),
                    m('p', m.trust(render(subSup(to), true))),
                    m('.card-action', [
                      m(FlatButton, {
                        label: 'OK',
                        iconName: 'check',
                        className: 'green-text darken-3',
                        onclick: () => nextCard(true),
                      }),
                      m(FlatButton, {
                        label: 'WRONG',
                        iconName: 'clear',
                        className: 'red-text darken-4',
                        onclick: () => nextCard(false),
                      }),
                    ]),
                  ]),
                ])
              : m('.card.small', { key: -1 }, [
                  m('.card-content', [
                    m('span.card-title', 'Results'),
                    m('.row', [
                      m('.col.s6', `CORRECT ${correctIdxs.size}`),
                      m('.col.s6', `WRONG ${wrongIdxs.size}`),
                      m('.col.s12', m('p.center-align.flow-text', `${score}%`)),
                    ]),
                  ]),
                  m('.card-action', [
                    m(FlatButton, {
                      label: 'Replay all',
                      iconName: 'replay',
                      onclick: () => {
                        replayAll(items, resetScore);
                      },
                    }),
                    m(FlatButton, {
                      label: 'wrong',
                      iconName: 'playlist_remove',
                      disabled: wrongIdxs.size === 0,
                      onclick: () => {
                        replayAll(Array.from(wrongIdxs.values()), resetScore);
                      },
                    }),
                    m(FlatButton, {
                      label: 'correct',
                      iconName: 'playlist_add_check',
                      disabled: correctIdxs.size === 0,
                      onclick: () => {
                        replayAll(Array.from(correctIdxs.values()), resetScore);
                      },
                    }),
                  ]),
                ]),
          ]),
          m(
            '.col.s12.m2',
            m(
              '#score-results.card.small.no-select',
              m('.card-content', [
                m('.progress-circle.blue.white-text', `${score} %`),
                m('.progress-circle.green.white-text', `${correctIdxs.size} ✔`),
                m('.progress-circle.red.white-text', `${wrongIdxs.size} X`),
              ])
            )
          ),
        ]),
      ]);
    },
  };
};
