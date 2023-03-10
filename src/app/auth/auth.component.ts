import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {HttpService} from "../services/http.service";
import {ActivatedRoute, Router} from "@angular/router";

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

