export class ValidateResult {
    constructor(
        public program: number,
        public card: string,
        public state: number,
        public err: number = 0,
        public message: string = '',
        public captcha: string = '',
        public captchaSolution: string = '',
        public captchaState: number = 0
      ) {  }
}
