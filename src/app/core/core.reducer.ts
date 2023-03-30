import {ActionReducer, ActionReducerMap, INIT, MetaReducer} from '@ngrx/store';
import { State } from './core.state';
import * as UserReducer from './user/user.reducer'
import * as BoardReducer from './board/board.reducer'

export const reducers: ActionReducerMap<State> = {
  users: UserReducer.reducer,
  board: BoardReducer.reducer,
}

export const metaReducers: MetaReducer<State>[] = [];

export const hydrationMetaReducer = (
  reducer: ActionReducer<State>
): ActionReducer<State> => {
  return (state, action) => {
    if (action.type === INIT) {
      const storageValue = localStorage.getItem("state");
      if (storageValue) {
        try {
          return JSON.parse(storageValue);
        } catch {
          localStorage.removeItem("state");
        }
      }
    }
    const nextState = reducer(state, action);
    localStorage.setItem("state", JSON.stringify(nextState));
    return nextState;
  };
};
