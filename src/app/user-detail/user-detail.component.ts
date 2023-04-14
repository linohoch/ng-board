import {Component, OnInit, HostListener, DoCheck} from '@angular/core';
import {HttpService} from "../services/http.service";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {OrderBy, selectHistory, selectIsLoading, selectPage, selectSort, Sort} from "../core/board";
import * as BoardActions from './../core/board/board.actions'

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, DoCheck {
  user: string | null
  userDetail$: Observable<any> | undefined
  articles: any
  history$: Observable<any> | undefined
  page = 1
  isEnd = false;
  sort: Sort | undefined
  likeArticle: number[] | undefined
  likeComment: number[] | undefined

  constructor(
    private service: HttpService,
    private activatedRoute: ActivatedRoute,
    private store: Store,
  ) {
    this.user = this.activatedRoute.snapshot.paramMap.get('user')
    const userInfo = localStorage.getItem('userInfo')
    this.likeArticle= userInfo?JSON.parse(userInfo).likeArticle:[]
    this.likeComment= userInfo?JSON.parse(userInfo).likeComment:[]
    this.history$ = this.store.pipe(select(selectHistory))
    this.store.pipe(select(selectIsLoading)).subscribe(next => this.isEnd = next)
    this.store.pipe(select(selectSort)).subscribe(next => this.sort = next)
  }

  ngOnInit(): void {
    this.store.dispatch(BoardActions.setSort({nextPage:1, orderBy:OrderBy.date}))
    if (this.user) {
      this.userDetail$ = this.service.getUserInfoAndPosts(this.user)
      this.store.dispatch(BoardActions.getHistory({
        user: this.user,
      }))
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const docEl = event.target.documentElement
    if (!this.isEnd) {
      if (docEl.scrollTop + docEl.clientHeight + 200 >= docEl.scrollHeight) {
        this.isEnd = true
        if (this.user) {
          this.store.dispatch(BoardActions.getHistory({user: this.user, }))
        }
      }
    }
  }

  ngDoCheck(): void {
  }

  sortPage(btn: any) {
    const keyword = btn.currentTarget.value as OrderBy
    this.store.dispatch(BoardActions.setSort({nextPage: 1, orderBy: keyword}))
    this.store.dispatch(BoardActions.getHistory({user: this.user ?? '', options: {}}))
  }

  isLike(no: any, op: 'article' | 'comment'){
    switch (op) {
      case "article":
        return this.likeArticle && this.likeArticle.includes(Number(no))
      case "comment":
        return this.likeComment && this.likeComment.includes(Number(no))
      default:
        return false
    }
  }

}
