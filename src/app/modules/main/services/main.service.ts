import { Observable } from 'rxjs';
import { Person } from './../../../interfaces/person';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  private peopleCollection: AngularFirestoreCollection<Person> = this.afs.collection('people');

  constructor(
    private afs: AngularFirestore
  ) { }

  public getPeople(): Observable<Person[]> {
    return this.peopleCollection.valueChanges();
  }

  public addPerson(p: Person): void {
    this.peopleCollection.add(p);
  }
}
