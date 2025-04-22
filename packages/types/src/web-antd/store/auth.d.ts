export interface LoginParams extends Recordable<boolean | string> {
  account: string;
  password: string;
  selectAccount: string;
  captcha: boolean;
}
