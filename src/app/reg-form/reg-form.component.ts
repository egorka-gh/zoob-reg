import { Component, OnInit } from '@angular/core';

import {Client} from '../client';
import {ClientState} from '../client.state';
import {ClientService} from '../client.service';
import { ValidateResult } from '../validate.result';

enum ViewStates {
  Init = 0,
  CardInput = 1,
  WrongCard = 2,
  CardApproved = 3,
  Complite = 4,
  CardError = 5,
  ServiseError = 6
}

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

  ViewStates: typeof ViewStates = ViewStates;
  viewState: ViewStates = ViewStates.Init;

  stateMessage = '';

  model = new Client('', '', '', '', '', '', 0);

  constructor(private clientService: ClientService) { }


  ngOnInit() {
    this.viewState = ViewStates.Init;
    this.clientService.ping()
      .subscribe(val => this.onPing(val) );
  }

  onPing(res: ValidateResult) {
    if (res.err === -1) {
      // ping fault
      this.viewState = ViewStates.ServiseError;
      this.stateMessage = res.message;
      return;
    }
    this.viewState = ViewStates.CardInput;
    this.stateMessage = '';
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
        this.viewState = ViewStates.CardApproved;
    } else {
      this.stateMessage = this.statesMap.get(res.err).web_comment;
      if (res.err === -1) {
          // fatal service error
          this.viewState = ViewStates.ServiseError;
        } else if ( res.err === -10 ) {
          this.viewState = ViewStates.WrongCard;
        } else {
          this.viewState = ViewStates.CardError;
          this.stateMessage = this.statesMap.get(res.state).web_comment;
      }
  }
  }



  isBlank(str: string): boolean {
    if (str == null) { return true; }
    return str.replace(/\s/g, '').length === 0 ;
}

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }
}
