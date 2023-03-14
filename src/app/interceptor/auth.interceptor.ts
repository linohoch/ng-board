import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({withCredentials: true})

    const user = localStorage.getItem('user');
    console.log(user)
    if (user) {
      request = request.clone(
        {
          setHeaders: {"Authorization": `Bearer ${JSON.parse(user).access_token}`,},
          withCredentials: true
        })
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err.status)

        throw new Error(err.error)
      })
    );
  }
}
