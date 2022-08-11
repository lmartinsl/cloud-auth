import { User } from './../../../../interfaces/user';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  private loginOkNotification(u: User): void {
    this.snackBar.open(
      `Logged in successfully. Welcome, ${u.firstName}!`, 'OK', { duration: 2000 }
    )
  }

  private loginErrorNotification(err): void {
    this.snackBar.open(err, 'OK', { duration: 2000 })
  }

  private createForm(): void {
    const { required, email, minLength } = Validators
    this.loginForm = this.fb.group({
      'email': ['', [required, email]],
      'password': ['', [required, minLength(6)]],
    })
  }

  public onSubmit(): void {
    const { email, password } = this.loginForm.value
    this.loading = true;
    this.authService.login(email, password)
      .subscribe(
        (u) => {
          this.loginOkNotification(u)
          this.router.navigateByUrl('main/people')
          this.loading = false;
        },
        (err) => {
          this.loginErrorNotification(err)
          this.loading = false;
        }
      )

  }

  public loginGoogle(): void {
    this.loading = true;
    this.authService.loginGoogle()
      .subscribe(
        (u) => {
          this.loginOkNotification(u)
          this.router.navigateByUrl('main/people')
          this.loading = false;
        },
        (err) => {
          this.loginErrorNotification(err)
          this.loading = false;
        }
      )
  }
}
