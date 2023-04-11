import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import * as BoardActions from "../core/board/board.actions";
import {QuillEditorComponent} from "ngx-quill";
import {Article, ArticleVO, selectTemp} from "../core/board";
import Quill from 'quill';
import {BoardService} from "../services/board.service";
import {DialogComponent, DialogControl, DialogControl_2} from "../dialog/dialog.component";
import {v4 as uuid} from 'uuid';
import {Dialog, DialogRef} from "@angular/cdk/dialog";
// import * as QuillNamespace from 'quill';
// let Quill: any = QuillNamespace;

@Component({
  selector: 'app-board-create',
  templateUrl: './board-create.component.html',
  styleUrls: ['./board-create.component.scss']
})
export class BoardCreateComponent implements OnInit {
  articleNo = this.activatedRoute.snapshot.paramMap.get('articleNo')
  tempDetail: Article = new ArticleVO()
  me: string | undefined;
  createForm = this.formBuilder.group({
    title: new FormControl('', {validators: Validators.required, updateOn: 'blur', nonNullable: true}),
    contents: new FormControl(''),
    password: new FormControl('', Validators.required)
  })
  @ViewChild('editor') editor: QuillEditorComponent | undefined;
  quillEditorRef: Quill | undefined;
  expanded: boolean = false
  contentsChanged: string = ''
  tempFileList: Array<{ id: string; file: File; name: string | undefined; src: any }> | undefined = []

  constructor(private store: Store,
              private location: Location,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private service: BoardService,
              private dialog: DialogControl) {

  }

  ngOnInit() {
    const localUser = localStorage.getItem('user')
    if (localUser) {
      this.me = JSON.parse(localUser).username
    } else {
      this.me = 'anonymous'
    }
    // this.detectChange()
  }

  getEditorInstance(editor: any) {
    // console.log(editor === this.editor?.quillEditor);
    this.quillEditorRef = editor;
    const toolbar = editor.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler);
  }

  //pasteHTML을 하면 폼에 바로 안들어감
  changeContent(event: any) {
    if (event.html !== undefined) {
      this.contentsChanged = event.html ? event.html : ''
    }
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
          const find = this.tempFileList?.filter((temp) => {
            return temp.name === file.name
          })
          if (find && find.length > 0) {
            if (confirm('첨부목록에 같은 파일명이 존재합니다. 그래도 첨부할까요?')) {
              this.attachImageAddTempList(file, find.length)
            }
          } else {
            this.attachImageAddTempList(file)
          }
          input.value = ''
        } else {
          this.dialog.openDialog({
            title: '용량이 너무 큽니다.'
          })
        }
      } else {
        this.dialog.openDialog({
          title: '사진파일이 아닙니다.'
        })
      }
    }
  }
  attachImageAddTempList(file: File, num?: any) {
    const reader = new FileReader()
    reader.onload = () => {
      const index = this.quillEditorRef?.getSelection(true).index
      let filename = encodeURIComponent(file.name)
      if (num !== undefined && num > 0) {
        filename = filename.substring(0, filename.lastIndexOf('.')) + '(' + num + ')' + filename.substring(filename.lastIndexOf('.'))
      }
      const id = uuid() + '-' + filename
      const src = reader.result;
      this.tempFileList?.push({id:id, file: file, name: filename, src: src})
      this.quillEditorRef?.clipboard.dangerouslyPasteHTML(index ? index : 0,
        `<img src="${src}" alt="${id}" >`)
      this.quillEditorRef?.setSelection(index ? index + 1 : 2, 1)
    }
    reader.readAsDataURL(file)
  }

  removeImage(event: any) {
    const editorEl = document.querySelector('.ql-editor')
    editorEl?.querySelectorAll('img').forEach((el) => {
      if (el.alt === event.currentTarget.parentNode.id) {
        el.remove()
      }
    })
    this.tempFileList = this.tempFileList?.filter(fileObj => {
      return fileObj.id !== event.currentTarget.parentNode.id
    })
    event.currentTarget.parentElement.remove()
  }

  removeBase64() {
    let delta = this.quillEditorRef?.getContents();
    let range = this.quillEditorRef?.getSelection(true);
    if (delta && range) {
      delta.forEach((op) => {
        if (op.attributes) {
          let alt = op.attributes['alt']
          let insert = op.insert;
          if (insert.image?.slice(0, 4) === 'data') {
            delete insert.image;
            insert.image = alt;
            delete op.attributes['alt']
            this.tempFileList?.forEach((temp)=>{
              if(temp.id===alt && op.attributes) op.attributes['alt']=temp.name
            })
          }
        }
      })
      this.quillEditorRef?.setContents(delta, 'user');
      this.quillEditorRef?.setSelection(range, 'user');
    }
  }

  submit(): void {
    if (!this.createForm.get('title')?.hasError('required')) {
      this.removeBase64()
      this.save()
      this.getTemp()

      const title = this.createForm.get('title')?.value
      const contents = this.contentsChanged
      const pw = this.createForm.get('password')?.value
      const formData = new FormData()
      if (this.me === 'anonymous' && pw) {
        formData.append('pw', pw)
      }
      if (this.me && title) {
        formData.append('userEmail', this.me)
        formData.append('title', title)
        formData.append('contents', contents)
      }
      if (this.tempFileList !== undefined && this.tempFileList.length > 0) {
        this.tempFileList?.forEach((fileObj) => {
          formData.append("image", fileObj.file, fileObj.id)
        })
      }
      this.store.dispatch(BoardActions.setArticle({detail: formData}))
    }
  }

  save() {
    let title = this.createForm.get('title')?.value?.trim()
    let contents = this.contentsChanged
    this.tempDetail = Object.assign({...this.tempDetail}, {title: title, contents: contents})
    // store
    // this.store.dispatch(BoardActions.setEditedArticle({temp: this.tempDetail}))
  }

  getTemp() {
    this.createForm.get('title')?.setValue(this.tempDetail?.title)
    this.createForm.get('contents')?.setValue(this.tempDetail?.contents)
    // store
    // this.store.pipe(select(selectTemp)).subscribe(next => {
    //   if (next) {
    //     this.tempDetail = next
    //     this.createForm.get('title')?.setValue(this.tempDetail?.title)
    //     this.createForm.get('contents')?.setValue(this.tempDetail?.contents)
    //   }
    // })
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

  //
  // detectChange(){
  //   const div=document.querySelector('.editor-wrapper')
  //   const observer = new MutationObserver((mutation) => {
  //     console.log("div changed");
  //     // this.save()
  //   })
  //   if(div){
  //     observer.observe(div, {childList:true, subtree: true});
  //   }
  //
  // }
}
