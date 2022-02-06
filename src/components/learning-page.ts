import m from 'mithril';
import { Dashboards } from '../models';
import { MeiosisComponent } from '../services';
// import { TextInputWithClear } from './ui';

export const LearningPage: MeiosisComponent = () => {
  // const colors = [
  //   '#e41a1c',
  //   '#377eb8',
  //   '#4daf4a',
  //   '#984ea3',
  //   '#ff7f00',
  //   '#ffff33',
  //   '#a65628',
  //   '#f781bf',
  //   '#999999',
  // ];

  return {
    oninit: ({
      attrs: {
        actions: { setPage },
      },
    }) => setPage(Dashboards.TRAIN),
    view: ({
      attrs: {
        state: {
          app: {},
        },
        // actions: { createRoute, update },
      },
    }) => {
      return m('.overview', []);
    },
  };
};
