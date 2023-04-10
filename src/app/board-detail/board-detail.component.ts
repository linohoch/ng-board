import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpService} from "../services/http.service";
import {select, Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {
  appLoaded, Article, ArticleVO,
  Comment,
  rootComment,
  selectCommentList,
  selectDetail,
  selectError,
  selectIsLoading, selectIsPermit
} from "../core/board";
import * as BoardActions from './../core/board/board.actions'
import {Observable} from "rxjs";
import {BoardService, isRead} from "../services/board.service";
import {map} from "rxjs/operators";
import {DialogControl} from "../dialog/dialog.component";

@Component({
  selector: 'app-board-detail',
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.scss'],
  // providers: [HttpService]
})
export class BoardDetailComponent implements OnInit {
  articleNo: string | null
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  detail$: Observable<Article | null>;
  commentList$: Observable<Comment[] | null>;
  me: string | undefined;
  newComment: rootComment = new rootComment()
  now: any
  focusedThread: number = 0;
  userInfo: any | undefined;
  readYn: boolean = false;
  isLike: boolean | undefined = false;
  likeCnt: number | null | undefined = 0;
  likeArticle: number[] | undefined = [];
  // likeComment: number[] | undefined;
  pw: string | undefined;
  detail: Article | undefined = new ArticleVO();


  constructor(private service: HttpService,
              private store: Store,
              private location: Location,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private boardService: BoardService,
              private dialog: DialogControl) {
    this.isLoading$ = this.store.pipe(select(selectIsLoading))
    this.error$ = this.store.pipe(select(selectError))
    this.detail$ = this.store.pipe(select(selectDetail))
    this.commentList$ = this.store.pipe(select(selectCommentList))
    this.articleNo = this.activatedRoute.snapshot.paramMap.get('articleNo')
    this.detail$.subscribe(next => {
      if(next){
        this.detail = next
      }
      this.likeCnt = this.detail?.likeCnt
    })
    if (this.articleNo !== null) {
      this.readYn = isRead(Number(this.articleNo))
      this.isLike = this.likeArticle && this.likeArticle.includes(Number(this.articleNo))
    }
    this.userInfo = localStorage.getItem('userInfo')
    this.likeArticle = this.userInfo && JSON.parse(this.userInfo).likeArticle
  }

  ngOnInit(): void {
    this.store.dispatch(BoardActions.getDetail({no: this.articleNo, isRead: this.readYn}))
    this.store.dispatch(BoardActions.getComments({no: this.articleNo}))

    const logUser = localStorage.getItem('user')
    this.me = logUser && JSON.parse(logUser).username
    this.newComment.userEmail = this.me
    this.newComment.articleNo = Number(this.articleNo)
    this.now = new Date
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

  getPermit() {
    this.detail && this.store.dispatch(BoardActions.getPermissionToEdit({
      detail: this.detail, //userEmail, pw
      me: this.me ? this.me : 'anonymous',
      pw: this.pw
    }))
    let isPermit;
    this.store.pipe(select(selectIsPermit)).subscribe(res => {
      isPermit = res
    }).unsubscribe()
    return isPermit
  }

  goToEditBtn() {
    if (this.getPermit()) {
      this.router.navigate([`article`, this.articleNo, 'edit'])
    } else {
      this.dialog.openDialog({
        title:'비밀번호가 다릅니다',
      })
    }
  }

  delArticleBtn() {
    if (this.getPermit()) {
      this.dialog.openDialog({
        title: '정말 삭제하시겠습니까',
        btn: {no:'취소',ok:'삭제'}
      }).closed.subscribe((answer: any) => {
        if (answer) {
          this.store.dispatch(BoardActions.deleteArticle({articleNo: this.articleNo, userEmail: this.detail?.userEmail}))
        }
      })
    } else {
      this.dialog.openDialog({
        title:'비밀번호가 다릅니다',
      })
    }
  }

  submitCommentBtn(textarea: any): void {
    if (textarea.value.trim() !== '') {
      this.newComment.contents = textarea.value
      this.newComment = {...this.newComment, ...textarea.dataset}
      this.store.dispatch(BoardActions.setComment({comment: this.newComment}))
    }
  }

  likeArticleBtn(): void {
    // this.store.dispatch(BoardActions.likeArticle({articleNo: this.articleNo}))
    if (!this.me) {
      this.dialog.openDialog({
        title: '로그인페이지로 이동합니다.',
        btn: {no:'취소',ok:'이동'}
      }).closed.subscribe((answer: any) => {
        if (answer) {
          this.router.navigate(['login'])
        }
      })
    } else if (!this.isLike && this.articleNo) {
      this.boardService.addLikeArticle(Number(this.articleNo)).pipe(
        map((res) => {
          this.isLike = true
          this.likeCnt = res.likeCnt
          this.service.getUserInfo().subscribe(next => {
            if (next) {
              localStorage.setItem('userInfo', JSON.stringify(next))
            }
          })
        })
      ).subscribe()
    } else if (this.isLike && this.articleNo) {
      this.boardService.cancelLikeArticle(Number(this.articleNo)).pipe(
        map((res) => {
          this.isLike = false
          this.service.getUserInfo().subscribe(next => {
          this.likeCnt = res.likeCnt
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
    if (!this.me) {
      this.dialog.openDialog({
        title: '로그인페이지로 이동합니다.',
        btn: {no:'취소',ok:'이동'}
      }).closed.subscribe((answer: any) => {
        if (answer) {
          this.router.navigate(['login'])
        }
      })
    } else if (isLike) {
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

    this.dialog.openDialog({
      title: '정말 삭제하시겠습니까.',
      btn: {no:'취소',ok:'삭제'}
    }).closed.subscribe((answer: any) => {
      if (answer) {
        this.boardService.deleteComment(this.articleNo, commentNo).subscribe(
          () => {location.reload()})
      }
    })
  }

  showTextareaBtn(textarea: any): void {
    let display = textarea.parentElement.style.display
    textarea.parentElement.style.display = display === 'flex' ? 'none' : 'flex'
  }

  focusThread(num: any): void {
    this.focusedThread = num
  }

  foldThread($event: any): void {
    const no = $event.target.dataset.no

    let group: Comment[] | undefined = [];
    this.commentList$.subscribe({
      next(com) {
        group = com?.filter(c => {
          return c.thread?.includes(Number(no))
        })
      }
    })
    if (group !== undefined) {
      group.forEach((comment, i) => {
        const targetEl = document.getElementById(`c-${comment.no}`)
        let word = (i === 0) ? 'fold' : 'fold-tail'
        if (targetEl?.classList.contains(word)) {
          targetEl?.classList.remove(word)
        } else {
          targetEl?.classList.add(word)
        }
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
