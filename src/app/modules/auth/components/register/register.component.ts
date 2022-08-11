import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from './../../../../interfaces/user';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public formRegister: FormGroup;
  public states = [
    'MG', 'RG', 'SC', 'SP', 'GO'
  ]

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  public onSubmit(): void {
    const {
      firstName, lastName, address, city, state, phone, mobilePhone, email
    } = this.formRegister.value

    const newUser: User = {
      firstName, lastName, address, city, state, phone, mobilePhone, email
    }

    this.authService.register(newUser)
      .subscribe(
        () => {
          this.snack('Successfully registered. Use your new credentials to sign in.')
          this.router.navigateByUrl('/auth/login')
        },
        (err) => {
          console.error(err)
          this.snack('Error. You are not registered.')
        }
      )
  }

  private createForm(): void {
    const { required, email, minLength } = Validators
    this.formRegister = this.fb.group({
      'firstName': ['', [required]],
      'lastName': ['', [required]],
      'address': ['', [required]],
      'city': ['', [required]],
      'state': ['', [required]],
      'phone': ['', [required]],
      'mobilePhone': ['', [required]],
      'email': ['', [required, email]],
      'password1': ['', [required, minLength(6)]],
      'password2': ['', [required, minLength(6)]],
    }, {
      validator: this.matchPasswords
    })
  }

  private matchPasswords(group: FormGroup) {
    if (group) {
      const { password1: pw1, password2: pw2 } = group.controls
      if (pw1.value === pw2.value) {
        return null
      }
    }
    return { match: false };
  }

  private snack(msg): void {
    this.snackbar.open(
      msg, 'OK', { duration: 2000 }
    )
  }

}
