import { Component } from '@angular/core';
import {Article} from "../data";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {selectDetail} from "../core/board";
import * as BoardActions from "../core/board/board.actions";

@Component({
  selector: 'app-board-create',
  templateUrl: './board-create.component.html',
  styleUrls: ['./board-create.component.scss']
})
export class BoardCreateComponent {
  articleNo = this.activatedRoute.snapshot.paramMap.get('articleNo')
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

  }

  ngOnInit() {
    const localUser = localStorage.getItem('user')
    if(localUser) {
      this.me = JSON.parse(localUser).username
    }
  }

  submit(): void {
    const title = this.editForm.get('title')?.value
    if (title != null && this.detail) {
      this.detail.title = title
    }
    this.detail && this.store.dispatch(BoardActions.createArticle({detail: this.detail}))
  }

  cancel(){
    this.location.back()
  }
}
