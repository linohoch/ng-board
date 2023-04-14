import {Component, Injectable, Input, OnInit} from '@angular/core';
import {HttpService} from "../services/http.service";
import {select, Store} from "@ngrx/store";
import * as BoardActions from '../core/board/board.actions';
import {Observable, Subject} from "rxjs";
import {
  Article,
  selectArticles,
  selectArticlesExceptDeleted,
  selectError,
  selectIsLoading, selectPage, selectPhotos
} from "../core/board";
import {ActivatedRoute} from "@angular/router";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {CommonService} from "../services/common.service";

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

  isDeleteFilter:string = 'all'

  selectData = {
    title:'글 필터링',
    options: [
      { key:'all articles', value:'all', isSelected: true },
      { key:'except deleted', value:'except', isSelected: false}
    ]
  }

  now: any
  me: string | null | undefined


  constructor(private service: HttpService,
              private store: Store,
              private activatedRoute: ActivatedRoute,
              private common: CommonService) {
    this.activatedRoute.snapshot.queryParamMap.get('page')
    this.isLoading$ = this.store.pipe(select(selectIsLoading))
    this.error$ = this.store.pipe(select(selectError))
    this.articles$ = this.store.pipe(select(selectArticles))
    this.articles$.subscribe(l=> {
      this.totalCnt = l.length
    })
  }

  receiveSelected(option: any) {
    this.isDeleteFilter=option.value
    this.exceptDeleted()
  }
  ngOnInit(): void {
    const localUser = localStorage.getItem('user')
    if(localUser) {
      this.me = JSON.parse(localUser).username
    }
    this.store.dispatch(BoardActions.getArticles())
    this.now = new Date
    this.store.pipe(select(selectPage)).subscribe(next=>{
      this.pageIndex=next??0
    })
  }
  getDate(d:any) {
    return this.common.calDate(d)
  }
  getPageEvent(e: { pageIndex: any; pageSize: any}){
    this.pageIndex=e.pageIndex
    this.pageSize=e.pageSize
    this.store.dispatch(BoardActions.setPage({no:Number(e.pageIndex)}))
  }
  exceptDeleted(){
    if(this.isDeleteFilter==='except'){
      this.articles$ = this.store.pipe(select(selectArticlesExceptDeleted))
    }
    if(this.isDeleteFilter==='all'){
      this.articles$ = this.store.pipe(select(selectArticles))
    }
      this.articles$.subscribe(l=> {
        this.totalCnt = l.length
      })
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

