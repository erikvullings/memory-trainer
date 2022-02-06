import m, { FactoryComponent } from 'mithril';
import Stream from 'mithril/stream';
import { merge } from '../utils/mergerino';
import { appStateMgmt, IAppStateActions, IAppStateModel } from './states';

export interface IAppModel extends IAppStateModel {}

export interface IActions extends IAppStateActions {}

export type ModelUpdateFunction =
  | Partial<IAppModel>
  | ((model: Partial<IAppModel>) => Partial<IAppModel>);

export type UpdateStream = Stream<Partial<ModelUpdateFunction>>;

export type MeiosisComponent<T extends { [key: string]: any } = {}> = FactoryComponent<{
  state: IAppModel;
  actions: IActions;
  options?: T;
}>;

const runServices = (startingState: IAppModel) =>
  app.services.reduce(
    (state: IAppModel, service: (s: IAppModel) => Partial<IAppModel> | void) =>
      merge(state, service(state)),
    startingState
  );

const app = {
  initial: Object.assign({}, appStateMgmt.initial) as IAppModel,
  actions: (update: UpdateStream, states: Stream<IAppModel>) =>
    Object.assign({}, appStateMgmt.actions(update, states)) as IActions,
  /** Services update the state */
  services: [
    // (s) => console.log(s.app.page),
  ] as Array<(s: IAppModel) => Partial<IAppModel> | void>,
  // effects: (_update: UpdateStream, actions: IActions) => [
  //   LoginEffect(actions),
  //   LoadDataEffect(actions),
  // ],
};

const update = Stream<ModelUpdateFunction>();
export const states = Stream.scan(
  (state, patch) => runServices(merge(state, patch)),
  app.initial,
  update
);
export const actions = app.actions(update, states);
// const effects = app.effects(update, actions);

states.map(() => {
  // effects.forEach((effect) => effect(state));
  m.redraw();
});
