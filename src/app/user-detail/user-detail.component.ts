import {Component, OnInit, HostListener, DoCheck} from '@angular/core';
import {HttpService} from "../services/http.service";
import {ActivatedRoute} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {selectHistory, selectIsLoading} from "../core/board";
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

  constructor(
    private service: HttpService,
    private activatedRoute: ActivatedRoute,
    private store: Store,
  ) {
    this.user = this.activatedRoute.snapshot.paramMap.get('user')
    const userInfo = localStorage.getItem('userInfo')
    userInfo && JSON.parse(userInfo).no
    this.history$ = this.store.pipe(select(selectHistory))
    this.store.pipe(select(selectIsLoading)).subscribe(next =>
      this.isEnd = next)
  }

  ngOnInit(): void {
    if (this.user) {
      this.userDetail$ = this.service.getUserInfoAndPosts(this.user)
      this.store.dispatch(BoardActions.getHistory({user: this.user, options: {page: this.page}}))
    }
  }
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const docEl = event.target.documentElement
    if (!this.isEnd) {
      if (docEl.scrollTop + docEl.clientHeight + 200 >= docEl.scrollHeight) {
        this.isEnd=true
        this.page = this.page + 1
        if (this.user) {
          this.store.dispatch(BoardActions.getHistory({user: this.user, options: {page: this.page}}))
        }
      }
    }
  }

  ngDoCheck(): void {
  }

}
