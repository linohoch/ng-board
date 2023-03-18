import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as BoardActions from './board.actions'
import {catchError, map, mergeMap, of} from "rxjs";
import {BoardService} from "../../services/board.service";

@Injectable()
export class BoardEffects {
  constructor(private actions$: Actions,
              private service: BoardService) {
  }

  getArticles = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.getArticles),
      mergeMap(() => {
        return this.service.getArticleList().pipe(
          map((articles) => BoardActions.getArticlesSuccess({articles})),
          catchError(err => of(BoardActions.getArticlesFailed({error: err.message})))
        )
      })
    )
  )
  getDetail = createEffect(()=>
    this.actions$.pipe(
      ofType(BoardActions.getDetail),
      map(action => action.no),
      mergeMap((page) => {
        return this.service.getArticleDetail(page).pipe(
          map((detail) => BoardActions.getDetailSuccess({detail})),
          catchError(err => of(BoardActions.getDetailFailed({error: err.message})))
        )
      })
    )
  )
}
