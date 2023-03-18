import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import articleList, {Article} from "../data";
import {HttpService} from "../services/http.service";
import {select, Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {appLoaded, selectDetail, selectError, selectIsLoading} from "../core/board";
import * as BoardActions from './../core/board/board.actions'
import {Observable} from "rxjs";

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
  commentList: any | undefined;

  constructor(private service: HttpService,
              private store: Store,
              private location: Location,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.isLoading$ = this.store.pipe(select(selectIsLoading))
    this.error$ = this.store.pipe(select(selectError))
    this.detail$ = this.store.pipe(select(selectDetail))
  }

  ngOnInit(): void {
    this.store.dispatch(appLoaded())
    this.store.dispatch(BoardActions.getDetail({no:Number(this.articleNo)}))
  }

}
