import { Component } from '@angular/core';
import {Store} from "@ngrx/store";
import {appLoaded} from "../core/board";
import {Article} from "../data";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import * as BoardActions from './../core/board/board.actions'

@Component({
  selector: 'app-board-edit',
  templateUrl: './board-edit.component.html',
  styleUrls: ['./board-edit.component.scss']
})
export class BoardEditComponent {
  page = this.activatedRoute.snapshot.paramMap.get('page')
  constructor(private store: Store,
              private location: Location,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }
  ngOnInit() {
    this.store.dispatch(appLoaded())
    // this.store.dispatch(BoardActions.getDetail(page))
    // const detail = this.store.select(BoardActions.getDetail,{no:Number(this.page)})
  }
  submit(article: Article): void {
    // this.store.dispatch(editArticle())
  }
  cancel(){
    this.location.back()
  }
}
