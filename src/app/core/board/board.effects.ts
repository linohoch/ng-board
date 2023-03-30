import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as BoardActions from './board.actions'
import {catchError, map, mergeMap, of, tap} from "rxjs";
import {BoardService} from "../../services/board.service";
import {select, Store} from "@ngrx/store";
import {selectComment, selectDetail} from "./board.selector";
import {Router} from "@angular/router";

@Injectable()
export class BoardEffects {
  constructor(private actions$: Actions,
              private service: BoardService,
              private store: Store,
              private router: Router) {
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
  getDetail = createEffect(() =>
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
  getComments = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.getComments),
      map(action => action.no),
      mergeMap((page) => {
        return this.service.getComments(page).pipe(
          map((comments) => BoardActions.getCommentsSuccess({commentList: comments})),
          catchError(err => of(BoardActions.getCommentsFailed({error: err.message})))
        )
      })
    )
  )

  // createComment = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(BoardActions.createComment),
  //     map(action => action.comment),
  //     mergeMap((data) => {
  //       // console.log('in effect')
  //       // console.log('data', data)
  //       let comment = data
  //       this.store.pipe(select(selectComment)).subscribe(temp=> {
  //           if (temp !== null) {
  //             comment = temp
  //           }
  //         }
  //       )
  //       return this.service.createComment(comment).pipe(
  //         map((comment) => BoardActions.createCommentSuccess({comment: comment})),
  //         catchError(err => of(BoardActions.createCommentFailed({error: err.message})))
  //       )
  //     })
  //   )
  // )
  setComment = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.setComment),
      map(action => action.comment),
      mergeMap((data) => {
        // console.log('in effect')
        // console.log('data', data)
        let comment = data
        this.store.pipe(select(selectComment)).subscribe(temp=> {
            if (temp !== null) {
              comment = temp
            }
          }
        )
        return this.service.createComment(comment).pipe(
          map((comment) => {
            return BoardActions.createCommentSuccess({comment: comment})
          }),
          tap(() => this.router.navigateByUrl(this.router.url)),
          catchError(err => of(BoardActions.createCommentFailed({error: err.message})))
        )
      })
    )
  )
  setArticle = createEffect(()=>
    this.actions$.pipe(
      ofType(BoardActions.setArticle),
      map(action => action.detail),
      mergeMap((data) => {
        let detail = data
        this.store.pipe(select(selectDetail)).subscribe(temp=> {
          if (temp !== null) {
            detail = temp
          }
        })
        return this.service.createArticle(detail).pipe(
          map((detail) => {
            return BoardActions.createSuccess({detail: detail})
          }),
          tap(() => this.router.navigate(['/board'])),
          catchError(err => of(BoardActions.createFailed({error: err.message})))
        )
      })
    )
  )
  deleteArticle = createEffect(()=>
    this.actions$.pipe(
      ofType(BoardActions.deleteArticle),
      map(action => action.articleNo),
      mergeMap((articleNo) => this.service.deleteArticle(articleNo).pipe(
        map(() => {
          return BoardActions.deleteSuccess()
        }),
        tap(() => this.router.navigate(['/board'])),
        catchError(err => of(BoardActions.deleteFailed({error: err.message})))
      )),
    )
  )
}
