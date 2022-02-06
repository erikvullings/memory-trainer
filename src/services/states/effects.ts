// import { Dashboards } from '../../models';
// import { IActions, IAppModel } from '../meiosis';

// export const LoadDataEffect = (actions: IActions) => {
//   let dataLoaded = false;

//   return async (state: IAppModel) => {
//     const { users } = state;
//     const todo = [] as Promise<void>[];
//     // console.log('EFFECT');
//     if (!dataLoaded && (!users.list || users.list.length === 0)) {
//       dataLoaded = true;
//       // console.log(`Loading data`);
//       todo.push(actions.users.updateList());
//       await Promise.all(todo);
//     }
//   };
// };

// export const LoginEffect = (actions: IActions) => async (state: IAppModel) => {
//   const { page, loggedInUser } = state.app;
//   if (page === Dashboards.HOME) return;
//   if (!loggedInUser || !loggedInUser.id) {
//     await actions.login();
//     actions.changePage(Dashboards.HOME);
//   }
// };
