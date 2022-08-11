import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from './interfaces/user';
import { AuthService } from './modules/auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public authenticated$: Observable<boolean>
  public user$: Observable<User>

  public profileMenu
  public matMenu

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.getUser()
    this.authenticated$ = this.authService.authenticated()
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login')
  }
}
