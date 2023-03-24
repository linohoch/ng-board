import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import articleList, {Article} from "../data";
import {HttpService} from "../services/http.service";
import {select, Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {
  appLoaded,
  Comment,
  rootComment, selectComment,
  selectCommentList,
  selectDetail,
  selectError,
  selectIsLoading
} from "../core/board";
import * as BoardActions from './../core/board/board.actions'
import {Observable} from "rxjs";
import {BoardService} from "../services/board.service";

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
  }
  ngOnInit(): void {
    this.store.dispatch(appLoaded())
    this.store.dispatch(BoardActions.getDetail({no:this.articleNo}))
    this.store.dispatch(BoardActions.getComments({no:this.articleNo}))
    const logUser= localStorage.getItem('user')
    this.me = logUser && JSON.parse(logUser).username
    this.newComment.userEmail = this.me
    this.newComment.articleNo = Number(this.articleNo)
  }
  goToEdit(){
    this.router.navigate([`article`,this.articleNo,'edit'])
  }
  delete(){
    this.store.dispatch(BoardActions.deleteArticle({articleNo: this.articleNo}))
  }
  commentBtn(textarea:any):void {
    if(textarea.value.trim()!==''){
      this.newComment.contents = textarea.value
      this.newComment = {...this.newComment, ...textarea.dataset}
      this.store.dispatch(BoardActions.setComment({comment: this.newComment}))
      // this.store.dispatch(BoardActions.createComment({comment: this.newComment}))
    }
    // this.boardService.createComment(this.newComment).subscribe()
  }
  likeCommentBtn():void {

  }
  delCommentBtn():void {

  }
}
