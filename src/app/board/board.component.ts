import {Component, OnInit} from '@angular/core';
import {Article} from "../data";
import {HttpService} from "../services/http.service";
import {select, Store} from "@ngrx/store";
import * as BoardActions from '../core/board/board.actions';
import {Observable} from "rxjs";
import {selectArticles, selectError, selectIsLoading} from "../core/board";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  page:number = 1;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  articles$: Observable<Article[]>;

  // articleList: Article[] | undefined

  constructor(private service: HttpService,
              private store: Store,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.snapshot.paramMap.get('page')
    this.isLoading$ = this.store.pipe(select(selectIsLoading))
    this.error$ = this.store.pipe(select(selectError))
    this.articles$ = this.store.pipe(select(selectArticles))
  }

  ngOnInit(): void {
    // this.service.getArticleList().subscribe((articles:Article[])=>{
    //   this.articleList=articles;
    // })
    this.store.dispatch(BoardActions.getArticles())
  }


}
