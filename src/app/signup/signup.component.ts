import {Component, Injectable} from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  FormBuilder,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {HttpService} from "../services/http.service";
import {MyErrorStateMatcher} from "../auth/auth.component";
import {catchError, map, Observable, of} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  constructor(private formBuilder: FormBuilder,
              private service: HttpService,
              private uniqueEmailValidator: UniqueEmailValidator,
              private router: Router,
              private activatedRouter: ActivatedRoute) {
  }

  matcher = new MyErrorStateMatcher();
// /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/
  signUpForm = this.formBuilder.group({
    id: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator),
      updateOn: 'blur'
    }),
    pw: new FormControl('', [Validators.required, Validators.pattern(
      /(?=.*\d)[A-Za-z\d]{5,}/
    )]),
    confirmPassword: new FormControl('', [Validators.required, this.matchPassword('pw')]),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    provider: 'credential'
  })


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

  onSubmit() {
    const {confirmPassword, ...data} = this.signUpForm.value
    this.service.signUp(data).subscribe({
      next: (user) => {
        console.log('next->',user)
        alert('welcome '+user.id)
        const returnUrl = this.activatedRouter.snapshot.queryParams['returnUrl'] || '/login';
        this.router.navigateByUrl(returnUrl).then(r =>{} )//???
      },
      error: error => {
        console.log('error->',error)
      },
      complete: () => {

      }
    })
  }
}

@Injectable({ providedIn: 'root' })
export class UniqueEmailValidator implements AsyncValidator {
  constructor(private service: HttpService) {
  }

  validate(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return this.service.checkIsEmail(control.value).pipe(
      map(isEmail => (isEmail ? {'alreadyExist': true} : null)),
      catchError(() => of(null))
    );
  }
}
