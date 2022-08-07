import { Person } from './../../../../interfaces/person';
import { Observable } from 'rxjs';
import { MainService } from './../../services/main.service';
import { Component, OnInit } from '@angular/core';
import * as faker from '@faker-js/faker'

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

  public people$: Observable<Person[]>;

  constructor(
    private mainService: MainService
  ) { }

  ngOnInit(): void {
    this.people$ = this.mainService.getPeople()
  }

  public addOne(): void {
    const { faker: _f } = faker
    const p: Person = {
      name: _f.name.findName(),
      age: _f.random.numeric(2),
      country: _f.address.country(),
      email: _f.internet.email(),
      company: _f.company.companyName(),
    }
    this.mainService.addPerson(p)
  }

  public generate(): void {
    for (let i = 0; i < 5; i++) {
      this.addOne()
    }
  }

}
