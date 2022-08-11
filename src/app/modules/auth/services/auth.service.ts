import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user';
import auth from "firebase/app";
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userCollection: AngularFirestoreCollection<User> =
    this.afs.collection('users');

  constructor(
    private afs: AngularFirestore,
    private afa: AngularFireAuth,
    private router: Router
  ) { }

  public register(user: User): Observable<boolean> {

    // transformando a promise em observable
    return from(
      this.afa.createUserWithEmailAndPassword(user.email, user.password)
    ).pipe(
      switchMap((u) => {
        return this.userCollection
          .doc(u.user.uid)
          .set({ ...user, id: u.user.uid })
          .then(() => true)
      }),
      catchError((err) => throwError(err))
    )
  }

  public login(email: string, pwd: string): Observable<User> {
    return from(this.afa.signInWithEmailAndPassword(email, pwd))
      .pipe(
        switchMap((u) => this.userCollection.doc<User>(u.user.uid).valueChanges()),
        catchError(() => throwError('Invalid credentials or user is not registered.'))
      )
  }

  public getUser(): Observable<User> {
    return this.afa.authState
      .pipe(
        switchMap(u =>
          (u ? this.userCollection.doc<User>(u.uid).valueChanges() : of(null))
        )
      )
  }

  public authenticated(): Observable<boolean> {
    return this.afa.authState
      .pipe(map(u => (u ? true : false)))
  }

  private async updateUserData(u: auth.auth.UserCredential): Promise<User> {
    try {
      const newUser = {
        firstName: u.user.displayName,
        lastName: '',
        address: '',
        city: '',
        state: '',
        phone: '',
        mobilePhone: '',
        email: u.user.email,
        password: '',
        id: u.user.uid
      };
      await this.userCollection.doc(u.user.uid).set(newUser)
      return newUser
    } catch (error) {
      throw new Error(error)
    }
  }

  private async loginWithGoogleAccount(): Promise<User> {
    try {
      const provider = new auth.auth.GoogleAuthProvider();
      let credentials: auth.auth.UserCredential = await this.afa.signInWithPopup(provider)
      let user: User = await this.updateUserData(credentials)
      return user
    } catch (err) {
      throw new Error(err)
    }
  }

  public loginGoogle(): Observable<User> {
    return from(this.loginWithGoogleAccount())
  }

  public oldLoginGoogle(): Observable<User> {
    const provider = new auth.auth.GoogleAuthProvider();
    return from(this.afa.signInWithPopup(provider))
      .pipe(
        // tap((data: auth.auth.UserCredential) => console.log(data)),
        switchMap((u: auth.auth.UserCredential) => {
          const newUser = {
            firstName: u.user.displayName,
            lastName: '',
            address: '',
            city: '',
            state: '',
            phone: '',
            mobilePhone: '',
            email: u.user.email,
            password: '',
            id: u.user.uid
          };
          return this.userCollection.doc(u.user.uid)
            .set(newUser).then(() => newUser)
        })
      )
  }

  public logout(): void {
    this.afa.signOut();
  }
}
