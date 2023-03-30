import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpService} from "../services/http.service";
import {select, Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {
  appLoaded, Article,
  Comment,
  rootComment,
  selectCommentList,
  selectDetail,
  selectError,
  selectIsLoading
} from "../core/board";
import * as BoardActions from './../core/board/board.actions'
import {Observable} from "rxjs";
import {BoardService, isRead} from "../services/board.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-board-detail',
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.scss'],
  // providers: [HttpService]
})
export class BoardDetailComponent implements OnInit {
  articleNo = this.activatedRoute.snapshot.paramMap.get('articleNo')
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  detail$: Observable<Article | null>;
  commentList$: Observable<Comment[] | null>;
  me: string | undefined;
  newComment: rootComment = new rootComment()
  now: any
  focusedThread: number = 0;
  userInfo: any | undefined;
  readTF: boolean = false;
  likeTF: undefined | boolean = false;
  likeCnt: number | null | undefined;
  likeArticle: number[] | undefined;
  // likeComment: number[] | undefined;

  //TODO store

  constructor(private service: HttpService,
              private store: Store,
              private location: Location,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private boardService: BoardService) {
    this.isLoading$ = this.store.pipe(select(selectIsLoading))
    this.error$ = this.store.pipe(select(selectError))
    this.detail$ = this.store.pipe(select(selectDetail))
    this.commentList$ = this.store.pipe(select(selectCommentList))
    this.detail$.subscribe(next => {
      this.likeCnt = next?.likeCnt
    })
    this.userInfo = localStorage.getItem('userInfo')
    this.likeArticle = this.userInfo && JSON.parse(this.userInfo).likeArticle
    // this.likeComment = this.userInfo && JSON.parse(this.userInfo).likeComment
    if (this.articleNo !== null) {
      this.readTF = isRead(Number(this.articleNo))
      this.likeTF = this.likeArticle && this.likeArticle.includes(Number(this.articleNo))
    }
  }

  ngOnInit(): void {
    this.store.dispatch(BoardActions.getDetail({no: this.articleNo, isRead: this.readTF}))
    this.store.dispatch(BoardActions.getComments({no: this.articleNo}))

    const logUser = localStorage.getItem('user')
    this.me = logUser && JSON.parse(logUser).username
    this.newComment.userEmail = this.me
    this.newComment.articleNo = Number(this.articleNo)
    this.now = new Date

  }

  initialiseInvites() {

  }

  calDate(date: any) {
    let time = this.now - Number(new Date(date))
    let result;
    if (time < 1000 * 60) {
      result = Math.trunc(time / (1000)) + '초전'
    } else if (time < 1000 * 60 * 60) {
      result = Math.trunc(time / (1000 * 60)) + '분전'
    } else if (time < 1000 * 60 * 60 * 24) {
      result = Math.trunc(time / (1000 * 60 * 60)) + '시간전'
    } else {
      result = Math.trunc(time / (1000 * 60 * 60 * 24)) + '일전'
    }
    return result
  }

  goToEdit() {
    this.router.navigate([`article`, this.articleNo, 'edit'])
  }

  delete() {
    this.store.dispatch(BoardActions.deleteArticle({articleNo: this.articleNo}))
  }

  commentBtn(textarea: any): void {
    if (textarea.value.trim() !== '') {
      this.newComment.contents = textarea.value
      this.newComment = {...this.newComment, ...textarea.dataset}
      this.store.dispatch(BoardActions.setComment({comment: this.newComment}))
    }
  }

  likeArticleBtn(): void {
    // this.store.dispatch(BoardActions.likeArticle({articleNo: this.articleNo}))
    if (!this.likeTF && this.articleNo) {
      this.boardService.addLikeArticle(Number(this.articleNo)).pipe(
        map((res) => {
          this.likeTF = true
          this.likeCnt = res.likeCnt
          this.service.getUserInfo().subscribe(next => {
            if (next) {
              localStorage.setItem('userInfo', JSON.stringify(next))
            }
          })
        })
      ).subscribe()
    } else if (this.likeTF && this.articleNo) {
      this.boardService.cancelLikeArticle(Number(this.articleNo)).pipe(
        map((res) => {
          this.likeTF = false
          this.likeCnt = res.likeCnt
          this.service.getUserInfo().subscribe(next => {
            if (next) {
              localStorage.setItem('userInfo', JSON.stringify(next))
            }
          })
        })
      ).subscribe()
    }
  }

  likeCommentBtn(commentNo: any, isLike: boolean): void {
    // const isLike = this.likeComment?.includes(Number(commentNo))
    if (isLike) {
      this.boardService.cancelLikeComment(Number(this.articleNo), Number(commentNo)).pipe(
        map(() => {
          this.service.getUserInfo().subscribe(next => {
            if (next) {
              localStorage.setItem('userInfo', JSON.stringify(next))
            }
          })

        })
      ).subscribe(next => {
        this.store.dispatch(BoardActions.getComments({no: this.articleNo}))
        this.commentList$ = this.store.pipe(select(selectCommentList))

      })
    } else {
      this.boardService.addLikeComment(Number(this.articleNo), Number(commentNo)).pipe(
        map(() => {
          this.service.getUserInfo().subscribe(next => {
            if (next) {
              localStorage.setItem('userInfo', JSON.stringify(next))
            }
          })
        })
      ).subscribe(next => {
        this.store.dispatch(BoardActions.getComments({no: this.articleNo}))
        this.commentList$ = this.store.pipe(select(selectCommentList))

      })
    }
  }

  delCommentBtn(commentNo: any): void {
    this.boardService.deleteComment(this.articleNo, commentNo).subscribe(
      () => {
        location.reload()
      }
    )
  }

  showTextareaBtn(textarea: any): void {
    let display = textarea.parentElement.style.display
    textarea.parentElement.style.display = display === 'flex' ? 'none' : 'flex'
  }

  focusThread(num: any): void {
    this.focusedThread = num
  }

  foldThread(no: any): void {
    let group: Comment[] | undefined = [];
    this.commentList$.subscribe({
      next(com) {
        group = com?.filter(c => {
          return c.thread?.includes(no)
        })
      }
    })
    if (group !== undefined) {
      group.forEach((comment, i) => {
        document.getElementById(`c-${comment.no}`)?.classList.add(i === 0 ? 'fold' : 'fold-tail')
      })
    }
  }

  unfoldThread(no: any): void {
    let group: Comment[] | undefined = [];
    this.commentList$.subscribe({
      next(com) {
        group = com?.filter(c => {
          return c.thread?.includes(no)
        })
      }
    })
    if (group !== undefined) {
      group.forEach((comment, i) => {
        document.getElementById(`c-${comment.no}`)?.classList.remove(i === 0 ? 'fold' : 'fold-tail')
      })

    }
  }

  back() {
    this.location.back()
  }
}
