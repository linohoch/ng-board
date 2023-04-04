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
  createForm = this.formBuilder.group({
    title: new FormControl('', Validators.required),
    contents: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
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
    } else {
      this.me = 'anonymous'
    }
  }
  changeContent(event: { editor: { getText: () => any; }; }){
    this.changedText = event.editor.getText();
  }
  submit(): void {
    const title = this.createForm.get('title')?.value
    const contents = this.createForm.get('contents')?.value
    const pw = this.createForm.get('password')?.value
    if (title != null && contents !=null) {
      let data = {title: title, contents: contents, userEmail: this.me, pw: pw}
      this.store.dispatch(BoardActions.setArticle({detail: data}))
    }
  }
  save(){
    let title = this.createForm.get('title')?.value
    let contents = this.createForm.get('contents')?.value
    if (title != null && contents !=null) {
      this.detail.title = title
      this.detail.contents = contents
      this.store.dispatch(BoardActions.setEditedArticle({temp: this.detail}))
    }
  }
  getTemp() {
    this.store.pipe(select(selectTemp)).subscribe(next=> {
      if(next) {
        this.detail = next
        this.createForm.get('title')?.setValue(this.detail?.title)
        this.createForm.get('contents')?.setValue(this.detail?.contents)
      }
    })
  }
  cancel(){
    this.location.back()
  }
}
