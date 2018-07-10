export class ValidateResult {
    constructor(
        public program: number,
        public card: string,
        public state: number,
        public err: number,
        public message: string
      ) {  }
}
