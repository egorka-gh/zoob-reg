import { Component, OnInit } from '@angular/core';

import {Client} from '../client';

@Component({
  selector: 'app-reg-form',
  templateUrl: './reg-form.component.html',
  styleUrls: ['./reg-form.component.css']
})

export class RegFormComponent implements OnInit {

  genders = ['-', 'Мужской', 'Женский'];

  model = new Client('', 'name', 'surn', 'patr', '375', '29..', 0);

  cardApproved = false;

  constructor() { }

  ngOnInit() {
  }

  reset() {
    this.cardApproved = false;
  }

}
