import {createAction, props} from "@ngrx/store";
import {Google} from "./user.state";


export const appLoaded = createAction("[App] App Loaded");

export const test = createAction(
  "[page]event",
  props<any>()
)
export const fetchUserSuccess = createAction(
  "[UserAPI] Fetch User Success",
  props<any>()
)
export const fetchUserFailed = createAction(
  "[UserAPI] Fetch User Success",
  props<any>()
)
/**
 *  auth
 */
export const tempGoogleUser = createAction(
  "[Auth] set Temp UserInfo",
  props<{ userInfo: Google }>()
)
export const removeTempUser = createAction(
  "[Auth] remove Temp UserInfo",
)
