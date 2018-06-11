export class Client {

  constructor(
    public card: string,
    public name: string,
    public surname: string,
    public patronymic: string,
    public phone_code: string,
    public phone: string,
    public gender: number,
    public birthday?: Date,
    public email?: string,
    public pet?: string,
    public send_promo?: boolean
  ) {  }

}
