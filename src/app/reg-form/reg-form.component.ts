import { Component, OnInit } from '@angular/core';

import {Client} from '../client';
import {ClientState} from '../client.state';
import {ClientService} from '../client.service';
import { ValidateResult } from '../validate.result';

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

  errMessage = '';
  stateMessage = '';

  model = new Client('', '', '', '', '', '', 0);

  cardApproved = false;
  hasErr = false;

  constructor(private clientService: ClientService) { }


  ngOnInit() {
    this.clientService.ping()
      .subscribe(val => this.onPing(val) );
  }

  onPing(res: ValidateResult) {
    if (res.err === -1) {
      // ping fault
      this.errMessage = res.message;
      this.hasErr = true;
      this.cardApproved = false;
      return;
    }
    this.errMessage = '';
    this.hasErr = false;
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

  validateCard() {
      if (this.isBlank(this.model.card)) { return; }
      this.clientService.validateCard(this.model.card)
      .subscribe(r => this.onValidateCard(r) );
  }
  onValidateCard(res: ValidateResult) {
    if (res.err === 0) {
        this.cardApproved = true;
        this.hasErr = false;
    } else {
        if (res.err === -1) {
          // fatal service error
          this.hasErr = true;
          this.errMessage = this.statesMap.get(res.err).web_comment;
          this.stateMessage = '';
        } else {
          this.cardApproved = false;
          this.hasErr = false;
          this.errMessage = '';
          this.stateMessage = this.statesMap.get(res.err).web_comment;
        }
    }
  }

  reset() {
    this.cardApproved = false;
  }

  isBlank(str: string): boolean {
    if (str == null) { return true; }
    return str.replace(/\s/g, '').length === 0 ;
}

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }
}
