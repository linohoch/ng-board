import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {appLoaded, Article, selectDetail, selectIsPermit, selectTemp} from "../core/board";
import {Location} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Router, RoutesRecognized} from "@angular/router";
import * as BoardActions from './../core/board/board.actions'
import {FormBuilder, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-board-edit',
  templateUrl: './board-edit.component.html',
  styleUrls: ['./board-edit.component.scss']
})
export class BoardEditComponent implements OnInit {
  articleNo = this.activatedRoute.snapshot.paramMap.get('articleNo')
  detail: Article | undefined;
  me: string | undefined;
  editForm = this.formBuilder.group({
    title: new FormControl('', Validators.required),
    contents: new FormControl('', Validators.required)
  })
  isPermit: boolean = false;

  constructor(private store: Store,
              private location: Location,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder) {
    this.store.dispatch(BoardActions.getDetail({no: this.articleNo}))
    this.store.pipe(select(selectIsPermit)).subscribe(next => {
      this.isPermit = next
    })
    const localUser = localStorage.getItem('user')
    if (localUser) {
      this.me = JSON.parse(localUser).username
    } else {
      this.me = 'anonymous'
    }
  }

  ngOnInit() {
    if (window.history.state.navigationId === 1) {
      alert('잘못된 접근');
      window.history.back();
    } else if (!this.isPermit) {
      alert('수정권한이 없음');
      window.history.back();
    }

    this.store.pipe(select(selectDetail))
      .subscribe(next => {
        if (next) {
          console.log(next)
          this.detail = Object.assign({}, next)
          this.editForm.get('title')?.setValue(this.detail?.title)
          this.editForm.get('contents')?.setValue(this.detail?.contents)
        }
      })
  }

  submit(): void {
    const title = this.editForm.get('title')?.value
    const contents = this.editForm.get('contents')?.value
    if (title != null && contents != null) {
      this.store.dispatch(BoardActions.editArticle(
        {detail: {no: this.articleNo, title: title, contents: contents}}))
    }
  }

  save() {
    let title = this.editForm.get('title')?.value
    let contents = this.editForm.get('contents')?.value
    if (title != null && contents != null && this.detail !== undefined) {
      this.detail.title = title
      this.detail.contents = contents
      this.store.dispatch(BoardActions.setEditedArticle({temp: this.detail}))
    }
  }

  getTemp() {
    this.store.pipe(select(selectTemp)).subscribe(next => {
      if (next) {
        this.detail = next
        this.editForm.get('title')?.setValue(this.detail?.title)
        this.editForm.get('contents')?.setValue(this.detail?.contents)
      }
    })
  }

  cancel() {
    this.location.back()
  }
}
