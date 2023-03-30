import {Component, Injectable, OnInit} from '@angular/core';
import {HttpService} from "../services/http.service";
import {select, Store} from "@ngrx/store";
import * as BoardActions from '../core/board/board.actions';
import {Observable, Subject} from "rxjs";
import {Article, selectArticles, selectError, selectIsLoading} from "../core/board";
import {ActivatedRoute} from "@angular/router";
import {MatPaginatorIntl} from "@angular/material/paginator";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  page: number = 1;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  articles$: Observable<Article[]>;

  totalCnt: number | undefined;
  pageIndex: number = 0;
  pageSize: number  = 5
  pageSizeOptions: number[] = [5, 10]

  constructor(private service: HttpService,
              private store: Store,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.snapshot.queryParamMap.get('page')
    this.isLoading$ = this.store.pipe(select(selectIsLoading))
    this.error$ = this.store.pipe(select(selectError))
    this.articles$ = this.store.pipe(select(selectArticles))
    this.articles$.subscribe(l=> {
      this.totalCnt = l.length
    })
  }

  ngOnInit(): void {
    // this.service.getArticleList().subscribe((articles:Article[])=>{
    //   this.articleList=articles;
    // })
    this.store.dispatch(BoardActions.getArticles())
  }
  getPageEvent(e: { pageIndex: any; pageSize: any}){
    this.pageIndex=e.pageIndex
    this.pageSize=e.pageSize
  }

}
@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();
  firstPageLabel = $localize`First page`;
  itemsPerPageLabel = $localize`Items per page:`;
  lastPageLabel = $localize`Last page`;

  nextPageLabel = $localize`Next page`;
  previousPageLabel = $localize`Previous page`;

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`Page 1 of 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Page ${page + 1} of ${amountPages}`;
  }
}
