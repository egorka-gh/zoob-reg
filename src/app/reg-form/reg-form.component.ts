import { Component, OnInit } from '@angular/core';

import {Client} from '../client';
import {ClientState} from '../client.state';
import {ClientService} from '../client.service';

@Component({
  selector: 'app-reg-form',
  templateUrl: './reg-form.component.html',
  styleUrls: ['./reg-form.component.css']
})

export class RegFormComponent implements OnInit {

  genders = ['-', 'Мужской', 'Женский'];
  states: ClientState[];
  // statesMap: { [id: number]: ClientState; } = {};
  statesMap = new Map<number, ClientState>();

  stateMessage = '';

  model = new Client('', 'name', 'surn', 'patr', '375', '29..', 0);

  cardApproved = false;


  constructor(private clientService: ClientService) { }


  ngOnInit() {
    this.getStates();
  }

  getStates() {
    this.clientService.getStates()
      .subscribe(states => this.setStates(states) );
  }

  setStates(val: ClientState[]) {
    this.states = val;
    // this.stateMessage = this.states[0].web_comment;

    for (const st of this.states) {
      // this.statesMap[st.id] = st;
      this.statesMap.set(st.id, st);
    }
    this.stateMessage = this.statesMap.get(-1000).web_comment;
  }


  reset() {
    this.cardApproved = false;
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }
}
