export class User {
  constructor(
    public id: string,
    public email: string,
    private _token: string,
    public tokenExpirationDate: Date,
    public role: string
  ) {}

  get token() {
    if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
      return null;
    }
    return this._token;
  }

  get exparation() {
    return this.tokenExpirationDate;
  }
}
