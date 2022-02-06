import Stream from 'mithril/stream';
import { dashboardSvc, ModelUpdateFunction } from '..';
import { Dashboards } from '../../models';
import { DataSet, emptyDataSet } from '../../models/data-set';
import { IAppModel, UpdateStream } from '../meiosis';
/** Application state */

const dsModelKey = 'wordModel';

export interface IAppStateModel {
  app: {
    apiService: string;
    page?: Dashboards;
    dsModel: DataSet;
    correctIdxs: Set<number>;
    wrongIdxs: Set<number>;
  };
}

export interface IAppStateActions {
  setPage: (page: Dashboards) => void;
  update: (model: Partial<ModelUpdateFunction>) => void;
  changePage: (
    page: Dashboards,
    params?: { [key: string]: string | number | undefined },
    query?: { [key: string]: string | number | undefined }
  ) => void;
  createRoute: (
    page: Dashboards,
    params?: { [key: string]: string | number | undefined },
    query?: { [key: string]: string | number | undefined }
  ) => void;
  saveModel: (ds: DataSet) => void;
  updateScore: (idx: number, isCorrect: boolean) => void;
  resetScore: () => void;
}

export interface IAppState {
  initial: IAppStateModel;
  actions: (us: UpdateStream, states: Stream<IAppModel>) => IAppStateActions;
}

// console.log(`API server: ${process.env.SERVER}`);

const ds = localStorage.getItem(dsModelKey);
const dsModel = ds ? JSON.parse(ds) : emptyDataSet();
// TODO: DURING DEV
// catModel.form = defaultCapabilityModel.form;
// catModel.settings = defaultCapabilityModel.settings;
// catModel.data = defaultCapabilityModel.data;

export const appStateMgmt = {
  initial: {
    app: {
      /** During development, use this URL to access the server. */
      apiService: process.env.SERVER || window.location.origin,
      dsModel,
      correctIdxs: new Set(),
      wrongIdxs: new Set(),
    },
  },
  actions: (update, states) => {
    return {
      setPage: (page: Dashboards) => update({ app: { page } }),
      update: (model: Partial<ModelUpdateFunction>) => update(model),
      changePage: (page, params, query) => {
        dashboardSvc && dashboardSvc.switchTo(page, params, query);
        update({ app: { page } });
      },
      createRoute: (page, params) => dashboardSvc && dashboardSvc.route(page, params),
      saveModel: (dsModel) => {
        localStorage.setItem(dsModelKey, JSON.stringify(dsModel));
        update({ app: { dsModel: () => dsModel } });
      },
      updateScore: (idx: number, isCorrect: boolean) => {
        const state = states();
        if (isCorrect) {
          const { correctIdxs } = state.app;
          correctIdxs.add(idx);
          update({ app: { correctIdxs } });
        } else {
          const { wrongIdxs } = state.app;
          wrongIdxs.add(idx);
          update({ app: { wrongIdxs } });
        }
      },
      resetScore: () => {
        update({ app: { correctIdxs: () => new Set(), wrongIdxs: () => new Set() } });
      },
    };
  },
} as IAppState;
