import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import * as BoardActions from "../core/board/board.actions";
import {QuillEditorComponent} from "ngx-quill";
import {Article, selectTemp} from "../core/board";

@Component({
  selector: 'app-board-create',
  templateUrl: './board-create.component.html',
  styleUrls: ['./board-create.component.scss']
})
export class BoardCreateComponent implements OnInit{
  articleNo = this.activatedRoute.snapshot.paramMap.get('articleNo')
  detail = {title:'',contents:''}
  me: string | undefined;
  editForm = this.formBuilder.group({
    title: new FormControl('', Validators.required),
    contents: new FormControl('', Validators.required)
  })
  changedText: string = ''
  @ViewChild('editor') editor: QuillEditorComponent | undefined;

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
  changeContent(event: { editor: { getText: () => any; }; }){
    this.changedText = event.editor.getText();
  }
  submit(): void {
    const title = this.editForm.get('title')?.value
    const contents = this.editForm.get('contents')?.value
    if (title != null && contents !=null) {
      console.log(title, contents)
      this.store.dispatch(BoardActions.setArticle({detail: {title: title, contents: contents}}))
    }
  }
  save(){
    let title = this.editForm.get('title')?.value
    let contents = this.editForm.get('contents')?.value
    if (title != null && contents !=null) {
      this.detail.title = title
      this.detail.contents = contents
      console.log(this.detail)
      this.store.dispatch(BoardActions.setEditedArticle({temp: this.detail}))
    }
  }
  getTemp() {
    this.store.pipe(select(selectTemp)).subscribe(next=> {
      if(next) {
        this.detail = next
        this.editForm.get('title')?.setValue(this.detail?.title)
        this.editForm.get('contents')?.setValue(this.detail?.contents)
      }
    })
  }
  cancel(){
    this.location.back()
  }
}
