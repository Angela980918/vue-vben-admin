import type { HttpStatusCode } from './custom.https';

type MessageType = 'success';

export interface CustomRespone<T> {
  code: HttpStatusCode | number;
  message: MessageType;
  result: T;
}
