import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as BoardActions from './board.actions'
import {catchError, map, mergeMap, of, tap} from "rxjs";
import {BoardService, isRead} from "../../services/board.service";
import {select, Store} from "@ngrx/store";
import {selectComment, selectDetail, selectIsPermit} from "./board.selector";
import {ActivatedRoute, Router} from "@angular/router";

@Injectable()
export class BoardEffects {
  constructor(private actions$: Actions,
              private service: BoardService,
              private store: Store,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
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
      mergeMap(({no, isRead}) => {
        if (isRead === null || isRead === undefined) {
          isRead = true
        }
        return this.service.getArticleDetail(no, isRead).pipe(
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
      mergeMap((no) => {
        return this.service.getComments(no).pipe(
          map((list) => {
            const userInfo = localStorage.getItem('userInfo')
            const likeComment = userInfo && JSON.parse(userInfo).likeComment
            const modifiedList = list.map(comment => {
              if(comment && likeComment){
                comment.likeYn = likeComment.includes(Number(comment.no))
              }
              return comment
            })
            return BoardActions.getCommentsSuccess({commentList: modifiedList})
          }),
          catchError(err => of(BoardActions.getCommentsFailed({error: err.message})))
        )
      })
    )
  )

  setComment = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.setComment),
      map(action => action.comment),
      mergeMap((data) => {
        let comment = data
        this.store.pipe(select(selectComment)).subscribe(temp => {
            if (temp !== null) {
              comment = temp
            }
          }
        )
        return this.service.createComment(comment).pipe(
          map((comment) => {
            return BoardActions.createCommentSuccess({comment: comment})
          }),
          tap(() => { location.reload()}),
          // tap(() => this.router.navigate([this.router.url],{skipLocationChange: true})),
          catchError(err => of(BoardActions.createCommentFailed({error: err.message})))
        )
      })
    )
  )
  setArticle = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.setArticle),
      map(action => action.detail),
      mergeMap((data) => {
        let detail = data
        this.store.pipe(select(selectDetail)).subscribe(temp => {
          if (temp !== null) {
            detail = temp
          }
        })
        return this.service.createArticle(detail).pipe(
          map((detail) => {
            return BoardActions.createSuccess({detail: detail})
          }),
          tap(() => {

            this.router.navigate(['/board'], { skipLocationChange: true })
          }),
          catchError(err => of(BoardActions.createFailed({error: err.message})))
        )
      })
    )
  )
  getPermissionToEdit = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.getPermissionToEdit),
      map(({detail, me, pw}) => {
        let isMatch = false;
        if (detail.userEmail === 'anonymous' && detail.pw === pw) {
          isMatch = true
          // this.service.matchAnnyPassword(String(detail.no), pw).subscribe(res => {
          //   isMatch=Boolean(res)
          // })
        }
        if (detail.userEmail !== 'anonymous' && detail.userEmail === me) {
          isMatch = true
        }
        console.log('isMatch',isMatch)
        if (isMatch) {
          return BoardActions.matchSuccess()
        } else {
          return BoardActions.matchFailed()
        }
      })
    )
  )
  editArticle = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.editArticle),
      map(action => action.detail),
      mergeMap((data) => {
        let detail = data
        this.store.pipe(select(selectDetail)).subscribe(temp => {
          if (temp !== null) {
            detail = temp
          }
        })
        return this.service.updateArticle(detail).pipe(
          map((detail) => {
            return BoardActions.createSuccess({detail: detail})
          }),
          tap(() => {
            this.router.navigateByUrl(this.router.url.replace('/edit',''))
          }),
          catchError(err => of(BoardActions.createFailed({error: err.message})))
        )
      })
    )
  )
  deleteArticle = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.deleteArticle),
      map(action => action.articleNo),
      mergeMap((articleNo) => {
          return this.service.deleteArticle(articleNo).pipe(
            map(() => {
              return BoardActions.deleteSuccess()
            }),
            tap(() => this.router.navigate(['/board'])),
            catchError(err => of(BoardActions.deleteFailed({error: err.message})))
          )
        }),
    )
  )
}
