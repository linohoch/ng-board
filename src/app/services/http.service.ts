import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";
import {Article} from "../data";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  baseUrl = `http://localhost:3000`
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };
  constructor(private http: HttpClient) {
  }
  errorHandler(e:any){
    alert(e.message)
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
  isSignedIn(){
    return !!localStorage.getItem('user')
  }
  signOut(){
    //TODO 리프래시읽는데 실패할 경우를 대비해 유저이름 보냄
    return this.http.delete(`${this.baseUrl}/api/v1/auth/logout`).pipe(
      map((e)=>{return e})
    )
  }
  signIn(data: Partial<{ email: string | null; password: string | null; }>)
    : Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v1/auth/login`, data, this.httpOptions).pipe(
      map((user: any) => {
        if (user && user.access_token) {
          localStorage.setItem('user', JSON.stringify(user))
        } else {
          throw new Error('로그인 오류')
        }
        return user
      }),
      catchError(async (err) => this.errorHandler(err.error)))
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
}
