import {Component, OnChanges, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {
  Photo,
  selectDetail, selectIsLoading,
  selectIsPermit,
  selectPhotos,
} from "../core/board";
import {formatDate, Location} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Router, RoutesRecognized} from "@angular/router";
import * as BoardActions from './../core/board/board.actions'
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import Quill from "quill";
import {v4 as uuid} from "uuid";
import {DialogControl} from "../dialog/dialog.component";
import {BoardService} from "../services/board.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-board-edit',
  templateUrl: './board-edit.component.html',
  styleUrls: ['./board-edit.component.scss']
})
export class BoardEditComponent implements OnInit{
  articleNo = this.activatedRoute.snapshot.paramMap.get('articleNo')
  detail: { title: string, contents: string } = {title: '', contents: ''};
  isPermit: boolean = false;
  me: string | undefined;
  editForm = this.formBuilder.group({
    title: new FormControl('', Validators.required),
    contents: new FormControl(''),
    newPassword: new FormControl('', Validators.required)
  })
  quillEditorRef: Quill | undefined;
  expanded: boolean = false
  contentsChanged: string = ''
  photos: Array<Photo> = []
  isLoading$: Observable<boolean>;

  constructor(private store: Store,
              private location: Location,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private dialog: DialogControl,
              private service: BoardService) {
    this.isLoading$ = this.store.pipe(select(selectIsLoading))
    this.store.dispatch(BoardActions.getDetail({no: this.articleNo}))
    this.store.dispatch(BoardActions.getPhotos({no: this.articleNo}))
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
      alert('권한없는 접근');
      window.history.back();
    }

    this.store.pipe(select(selectDetail))
      .subscribe(next => {
        if (next) {
          this.detail = Object.assign({}, next)
          this.editForm.get('title')?.setValue(this.detail?.title)
          this.editForm.get('contents')?.setValue(this.detail?.contents)
        }
      })
    this.store.pipe(select(selectPhotos))
      .subscribe(next => {
        if (next) {
          this.photos = JSON.parse(JSON.stringify(next))
        }
      })
  }

  getEditorInstance(editor: any) {
    this.quillEditorRef = editor;
    const toolbar = editor.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler);
  }

  changeContent(event: any) {
    if (event.html !== undefined) {
      this.contentsChanged = event.html
    }
  }
  attachImage(file: File, num?:any){
    const index = this.quillEditorRef?.getSelection(true).index
    const filename = (num)? file.name.replace('.','('+num+').'):file.name
    let photo: Photo;
    const form = new FormData()
    form.append('image', file, filename)
    this.service.setPhoto(form, Number(this.articleNo)).subscribe((next) => {
      if (next.message === 'success') {
        photo = next.result
        this.store.dispatch(BoardActions.setPhotoSuccess({photo: photo}))
        this.quillEditorRef?.clipboard.dangerouslyPasteHTML(index ? index : 0,
          `<img src="${photo.url}" alt="${photo.origin}" >`)
        this.quillEditorRef?.setSelection(index ? index + 1 : 2, 1)
      } else {
        alert('저장실패')
      }
    })
    // this.store.dispatch(BoardActions.setPhoto({file:file, articleNo:this.articleNo, ql: this.quillEditorRef}))

  }

  imageHandler = () => {
    const input = <HTMLInputElement>document.getElementById('fileInputField');
    input.click()
    input.onchange = () => {
      if (!input.files) {
        return
      }
      let file: File = input.files[0];
      if (file?.type === 'image/jpeg' || file?.type === 'image/png' || file?.type === 'image/jpg') {
        if (file.size < 5000000) {
          const find = this.photos?.filter((photo) => {
            return photo.origin === file.name
          })
          if (find && find.length > 0) {
            if (confirm('첨부목록에 같은 파일명이 존재합니다. 그래도 첨부할까요?')) {
              this.attachImage(file, find.length)
            }
          } else {
            this.attachImage(file)
          }
          input.value = ''
        } else {//sizeError
          this.dialog.openDialog({
            title: '용량이 너무 큽니다.'
          })
        }
      } else {//typeError
        this.dialog.openDialog({
          title: '사진파일이 아닙니다.'
        })
      }
    }
  }

  removeFile(event: any) {
    const editorEl = document.querySelector('.ql-editor')
    this.store.dispatch(BoardActions.delPhoto({photoNo: event.currentTarget.parentNode.id, articleNo: this.articleNo}))
    editorEl?.querySelectorAll('img').forEach((el) => {
      if (el.alt === event.currentTarget.parentNode.dataset.origin) {
        el.remove()
      }
    })
    event.currentTarget.parentElement.remove()
    this.submit(true)
  }

  submit(auto?: boolean): void {
    this.save()
    this.getTemp()
    const title = this.editForm.get('title')?.value
    const contents = this.contentsChanged
    if (title != null && contents != null) {
      if(auto) {
        this.store.dispatch(BoardActions.editPhoto(
          {detail: {no: this.articleNo, title: title, contents: contents}}))
      } else {
        this.store.dispatch(BoardActions.editArticle(
          {detail: {no: this.articleNo, title: title, contents: contents}}))
      }
    }
  }

  save() {
    let title = this.editForm.get('title')?.value?.trim()
    let contents = this.contentsChanged
    this.detail = Object.assign({...this.detail}, {title: title, contents: contents})
  }

  getTemp() {
    this.editForm.get('title')?.setValue(this.detail?.title)
    this.editForm.get('contents')?.setValue(this.detail?.contents)
  }

  expand() {
    const editor = document.querySelector('.ql-editor') as HTMLElement
    if (editor.style.maxHeight === '400px') {
      editor.style.maxHeight = 'none'
      this.expanded = true
    } else {
      editor.style.maxHeight = '400px'
      this.expanded = false
    }
  }

  cancel() {
    this.location.back()
  }
}
