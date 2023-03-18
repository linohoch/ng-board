import { createFeatureSelector, createSelector } from "@ngrx/store";
import {User, UserState} from "./user.state";

export const selectUser = createFeatureSelector<UserState>("users")

export const selectFeatureCount = createSelector(
  selectUser,
  (state) => state.user
);
// ->
export const selectUsers = createFeatureSelector<UserState>('users');

export const selectTemp = createSelector(
  selectUsers,
  (state: UserState) => state.tempUser
);
