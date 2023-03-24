import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, EMPTY, Observable, of, switchMap} from 'rxjs';
import {HttpService} from "../services/http.service";
import {map} from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private service: HttpService) {
  }

  addAuthHeader(request: HttpRequest<any>){
    const user = localStorage.getItem('user');
    if (user) {
    console.log('addHeader')
      return request.clone(
        {
          setHeaders: {
            "Access-Control-Allow-Origin": 'http://localhost:3000',
            "Access-Control-Allow-Credentials": 'true',
            "Authorization": `Bearer ${JSON.parse(user).access_token}`,},
          withCredentials: true,
        })
    }
    return request
  }

  // errorHandler(err:any, request: HttpRequest<unknown>, next: HttpHandler){
  //   if (err.status === 401 && err.error.message === 'jwt expired') {
  //     return this.service.refreshToken()
  //       .pipe(switchMap(() => {
  //         const req = this.addAuthHeader(request)
  //         return next.handle(req)}
  //       ),
  //     )
  //   }
  //   if(err.status === 403 ){
  //     this.service.signOut()
  //   }
  //   return new Error(err.error)
  // }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const req = this.addAuthHeader(request)

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err.status, err.error.message)
        // return this.errorHandler(err,req,next)
        if (err.status === 401 && err.error.message === 'jwt expired') {
          return this.service.refreshToken()
            .pipe(
              switchMap(() => {
                  const req = this.addAuthHeader(request)
                  return next.handle(req)
                }
              ),
            )
        }
        throw new Error(err.error)
      })
    );
  }
}
