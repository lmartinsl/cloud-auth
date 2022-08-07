import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userCollection: AngularFirestoreCollection<User> =
    this.afs.collection('users');

  constructor(
    private afs: AngularFirestore,
    private afa: AngularFireAuth
  ) { }

  public register(user: User): Observable<boolean> {

    console.log(user.password)

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

  public logout(): void {
    this.afa.signOut();
  }
}
