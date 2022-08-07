import { User } from './interfaces/user';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

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

  constructor() { }

  public logout(): void { }

}
