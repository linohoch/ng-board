import {Component, OnInit} from '@angular/core';
import {HttpService} from "../services/http.service";
import {AbstractControl, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../auth/auth.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit{
  matcher = new MyErrorStateMatcher();
  unregisterForm = this.formBuilder.group({
    pw: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required, this.matchPassword('pw')]),
  })
  userInfo
  constructor(private service: HttpService,
              private formBuilder: FormBuilder,
              private router: Router,) {
  this.userInfo = JSON.parse(localStorage.getItem('userInfo')??'')
  }
  ngOnInit(): void {
    if(!this.userInfo){
      window.history.back()
    }
  }
  deleteAccount(formEl: any) {
    console.log(formEl)
    formEl.style.display=formEl.style.display==='none'?'grid':'none'
  }
  onSubmit(){
    if(this.unregisterForm) {
      const pw = this.unregisterForm.get('pw')?.value
      if(pw){
        this.service.deleteAccount(pw).subscribe(next=>{
          this.router.navigateByUrl('/')
        })
      }
    }
  }
  matchPassword(targetControl: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.parent?.value) {
        const password = (control.parent?.controls as any)[targetControl]
        const isValid = password && control.value === password.value
        return isValid ? null : {'mismatch': true}
      }
      return {'empty': true}
    }
  }
}
