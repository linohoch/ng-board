import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import * as UserActions from './user.actions'
import {HttpService} from "../../services/http.service";

@Injectable()
export class UserEffects {
  constructor(private action: Actions<any>,
              private service: HttpService) {
  }

  fetchUser = createEffect(() => this.action.pipe(
    ofType(UserActions.appLoaded.type, UserActions.fetchUserSuccess),
    switchMap(() => this.service.getUserInfo().pipe(
      map((user) =>
        UserActions.fetchUserSuccess(user)
      ),
      catchError((err) =>
        of(UserActions.fetchUserFailed(err))
      )
    ))
  ))
}
