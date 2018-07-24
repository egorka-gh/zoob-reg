import { Component, OnInit } from '@angular/core';

import { Client } from '../client';
import { ClientState } from '../client.state';
import { ClientService } from '../client.service';
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

  sessionState = new ValidateResult(0, '', 0);

  captchaUrl = '';
  captchaMessage = 'Введите символы указанные на изображении';
  stateMessage = '';
  isBusy = true;

  model = new Client('', '', '', '', '', '', 0, '', '', '', true);

  constructor(public clientService: ClientService) { }


  ngOnInit() {
    this.clientService.ping()
      .subscribe(val => this.onPing(val));
  }

  onPing(res: ValidateResult) {
    if (res.err === -1) {
      // ping fault
      this.sessionState.err = res.err;
      this.stateMessage = res.message;
      return;
    }
    this.isBusy = false;
    this.stateMessage = '';
    this.sessionState = res;
    this.setCaptchaUrl();
    this.getStates();
  }

  setCaptchaUrl(reload: boolean = false) {
    if (this.isBlank(this.sessionState.captcha)) {
      this.captchaUrl = '';
      return;
    }
    let url = this.clientService.rootUrl + 'captcha/' + this.sessionState.captcha + '.png';
    if (reload) {
      url = url + '?reload=' + (new Date()).getTime();
    }
    this.captchaUrl = url;
  }

  getStates() {
    this.clientService.getStates()
      .subscribe(states => this.setStates(states));
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
    if (this.isBlank(this.sessionState.captchaSolution)) { return; }
    this.isBusy = true;
    this.sessionState.card = this.model.card;
    this.clientService.validateCard(this.sessionState)
      .subscribe(r => this.onValidateCard(r));
  }
  onValidateCard(res: ValidateResult) {
    this.isBusy = false;
    this.sessionState = res;

    switch (res.err) {
      case 0: {
        this.stateMessage = '';
        break;
      }
      case -5: {
        this.captchaMessage = 'Указаны не верные символы';
        break;
      }
      case -1:
      case -12:
      case -10: {
        this.stateMessage = this.statesMap.get(res.err).web_comment;
        break;
      }
      default: {
        this.stateMessage = this.statesMap.get(res.state).web_comment;
        break;
      }
    }
  }

  registerCard() {
    // if (this.isBlank(this.sessionState.captchaSolution)) { return; }
    this.isBusy = true;
    this.clientService.registerCard(this.sessionState, this.model)
      .subscribe(r => this.onRegisterCard(r));
  }
  onRegisterCard(res: ValidateResult) {
    this.isBusy = false;
    this.sessionState = res;
    if (res.err === 0 ) {
      // complited
      this.stateMessage = 'Спасибо за регистрацию. ' +  this.statesMap.get(res.state).web_comment;
    }
  }

  isBlank(str: string): boolean {
    if (str == null) { return true; }
    return str.replace(/\s/g, '').length === 0;
  }

  /*
  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }
  get sess() { return JSON.stringify(this.sessionState); }
  */
}
