import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";
import {Router} from "@angular/router";
import {DialogComponent, DialogControl} from "../dialog/dialog.component";
import {Article} from "../core/board";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  baseUrl = `http://localhost:3000`
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    }),
    withCredentials: true
  };
  constructor(private http: HttpClient,
              private router: Router,
              private dial: MatDialog,
              private dialog: DialogControl,) {
  }
  errorHandler(e:any){
    alert(e.error.message)
    return of([])
  }
  // setHeaders(){
  //  const user = localStorage.getItem('user');
  //   if(user){
  //     this.httpOptions.headers.set("Authorization", JSON.parse(user).access_token)
  //   }
  // }
//board-service
  getArticleList(){
    return this.http.get<Article[]>(`${this.baseUrl}/api/v1/board?page=1`)
  }
  getArticleDetail(no: number){
    return this.http.get<Article>(`${this.baseUrl}/api/v1/board/${no}`)
  }

//user-service
  getUserInfo() {
    return this.http.get(`${this.baseUrl}/api/v1/user/me`)
  }

  isSignedIn(){
    return !!localStorage.getItem('user')
  }
  signOut(){
    localStorage.removeItem('user')
    localStorage.removeItem('userInfo')
    window.location.reload()
    return this.http.delete(`${this.baseUrl}/api/v1/auth/logout`).pipe(
      map((e) => {
        return e
      })
    )
  }
  signIn(data: Partial<{ email: string | null; password: string | null; }>)
    : Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v1/auth/login`, data, this.httpOptions).pipe(
      map((user: any) => {
        if (user && user.access_token) {
          localStorage.setItem('user', JSON.stringify(user))
          this.getUserInfo().subscribe(next=> {
            if(next){
              localStorage.setItem('userInfo', JSON.stringify(next) )
            }
          })
        } else {
          throw new Error('로그인 오류')
        }
        return user
      }),
      catchError(async (err) => this.errorHandler(err.error)))
  }

  linkWithGoogle(credential: any){
    return this.http.post(`${this.baseUrl}/api/v1/auth/google/link`,{'credential':credential}, this.httpOptions).pipe(
      map((res:any)=> {
        if (res && res.access_token) {
          localStorage.setItem('user', JSON.stringify(res))
          this.getUserInfo().subscribe(next=> {
            if(next){
              localStorage.setItem('userInfo', JSON.stringify(next) )
            }
          })
        } else {
          throw new Error('로그인 오류')
        }
        return res
      }),
      catchError(async (err) => this.errorHandler(err.error)))
  }
  dialogActionForLink (credential:any) {

      if(confirm('email로 가입된 회원정보가 존재합니다. 연동하고 계속하려면 확인')){
        this.linkWithGoogle(credential).subscribe(()=>{
          this.router.navigateByUrl('/')
        })
      }else {
        this.router.navigate(['login'])
      }

      //TODO 구글 로그인 콜백에서 문제
    // const result = this.dialog.openDialog({
    //   title:'계정연동',
    //   contents:'email로 가입된 회원정보가 존재합니다.',
    //   btn:{
    //     okBtnText:'연결합니다.',
    //     noBtnText:'취소.',
    //   },
    // })
    // result.afterClosed().subscribe((result: any)=>{
    //   console.log('after->', result)
    //   if(result){
    //     this.linkWithGoogle(credential).subscribe(()=>{
    //       this.router.navigateByUrl('/')
    //     })
    //   }else {
    //     this.router.navigate(['signup'])
    //   }
    //
    // })
 }
  signInWithGoogle(credential: any) {
    return this.http.post(`${this.baseUrl}/api/v1/auth/google/callback2`, {'credential':credential}, this.httpOptions).pipe(
      map((res: any) => {
        if (res && res.access_token) {
          console.log('로그인완료')
          localStorage.setItem('user', JSON.stringify(res))
          this.getUserInfo().subscribe(next=> {
            if(next){
              localStorage.setItem('userInfo', JSON.stringify(next) )
            }
          })
        }
        // else {
        //   throw new Error('로그인 오류')
        // }
        return res
      }),
    )
  }
  /**
   *
   * @param email
   * @return if already exist return true else false
   */
  checkIsEmail(email:string) {
    return this.http.post(`${this.baseUrl}/api/v1/user/check`, { email : email }, this.httpOptions).pipe(
      map((res)=>{
        return res
      }),
      catchError(()=>of(null))
    )
  }
  signUp(data:any){
    return this.http.post(`${this.baseUrl}/api/v1/user/signup`,data,this.httpOptions).pipe(
      map((user:any)=>{
        if(user){
          return user
        }
        //next->undefined
      }),
      catchError(async (err) => {
        console.log(err.error.statusCode)
        // throw new Error(err.error.message)
        this.errorHandler(err.error)
      })
    )
  }
  refreshToken(){
    return this.http.get(`${this.baseUrl}/api/v1/auth/refresh`).pipe(
      map((res: any) => {
        if (res && res.access_token) {
          localStorage.setItem('user', JSON.stringify(res))
          console.log('receive token success')
        }
        return res
      }),
      catchError((err)=>{
        return this.errorHandler(err.error);
      })
    )
  }
}
