import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public loading: boolean = false;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    const { required, email, minLength } = Validators
    this.loginForm = this.fb.group({
      'email': ['', [required, email]],
      'password': ['', [required, minLength(6)]],
    })
  }

  public onSubmit(): void {

  }

  public loginGoogle(): void {

  }
}
