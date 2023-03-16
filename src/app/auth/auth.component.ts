import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {HttpService} from "../services/http.service";
import {ActivatedRoute, Router} from "@angular/router";

declare let google: any;
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  constructor( private formBuilder : FormBuilder,
               private service: HttpService,
               private router: Router,
               private activatedRoute: ActivatedRoute) {}
  matcher = new MyErrorStateMatcher();
// /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/
  signInForm = this.formBuilder.group({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.pattern(
      /(?=.*\d)[A-Za-z\d]{5,}/
    )])
  })

  ngAfterViewInit(): void {
    const thisClass = this;
    google.accounts.id.initialize({
      client_id: "904288510274-tvtfor6hsjrktmp1anbq60cahoj8ohds.apps.googleusercontent.com",
      callback: (response: any) => { thisClass.handleCredentialResponse(response) }
    });
    google.accounts.id.renderButton(
      document.getElementById("google-sign-in"),
      { theme: "outline", size: "large" }
    );
    google.accounts.id.prompt();
  }

  public handleCredentialResponse(response: any) {
    const credential = response.credential
    const decodedCredential = this.decodeJwtResponse(credential)
    console.log(decodedCredential);
    this.service.signInWithGoogle(credential).subscribe()
  }

  public decodeJwtResponse(token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload) as any;
  };

  onSubmit() {
    this.service.signIn(this.signInForm.value).subscribe((user)=>{
      if(!!user){
        const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl)
      }
    })
  }

}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

