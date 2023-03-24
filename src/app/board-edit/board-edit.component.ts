import { Component } from '@angular/core';
import {select, Store} from "@ngrx/store";
import {appLoaded, selectDetail} from "../core/board";
import {Article} from "../data";
import {Location} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Router, RoutesRecognized} from "@angular/router";
import * as BoardActions from './../core/board/board.actions'
import {FormBuilder, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-board-edit',
  templateUrl: './board-edit.component.html',
  styleUrls: ['./board-edit.component.scss']
})
export class BoardEditComponent {
  articleNo = this.activatedRoute.snapshot.paramMap.get('articleNo')
  // isLoading$: Observable<boolean>;
  // error$: Observable<string | null>;
  // detail$: Observable<Article | null>;
  detail: Article | null | undefined;
  me: string | undefined;
  editForm = this.formBuilder.group({
    title: new FormControl('', Validators.required),
    contents: new FormControl('', Validators.required)
  })

  constructor(private store: Store,
              private location: Location,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder) {
    this.store.pipe(select(selectDetail))
              .subscribe(next => {
                if (next) {
                  this.detail = Object.assign({}, next)
                }
              })
  }

  ngOnInit() {
    const localUser = localStorage.getItem('user')
    if(localUser) {
      this.me = JSON.parse(localUser).username
    }
    this.detail && this.editForm.get('title')?.setValue(this.detail?.title)
    this.detail && this.editForm.get('contents')?.setValue(this.detail?.contents)
  }

  onSubmit(): void {
    const title = this.editForm.get('title')?.value
    if (title != null && this.detail) {
      this.detail.title = title
    }
    this.detail && this.store.dispatch(BoardActions.editArticle({detail: this.detail}))
  }
  deleteBtn() {
    this.detail && this.store.dispatch(BoardActions.deleteArticle({articleNo: Number(this.articleNo)}))
  }
  cancel(){
    this.location.back()
  }
}
