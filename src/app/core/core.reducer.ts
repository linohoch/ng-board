import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { State } from './core.state';
import * as UserReducer from './user/user.reducer'
import * as BoardReducer from './board/board.reducer'

export const reducers: ActionReducerMap<State> = {
  users: UserReducer.reducer,
  board: BoardReducer.reducer,
}

export const metaReducers: MetaReducer<State>[] = [];
