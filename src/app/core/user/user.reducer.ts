import { Action, createReducer, on } from "@ngrx/store";

import * as UserAction from './user.actions'
import { initialState, UserState } from "./user.state";

export function reducer(state: UserState | undefined, action: Action) {
  return UserReducer(state, action)
}
const UserReducer = createReducer(
  initialState,
  on( UserAction.fetchUserSuccess, (state, user)=>({
    ...user
  })),
  on( UserAction.tempGoogleUser, (state, action)=>({
    ...state,
    tempUser: action.userInfo
  })),
  on(UserAction.removeTempUser, (state) => ({
    ...state,
    tempUser: null
  }))
);
