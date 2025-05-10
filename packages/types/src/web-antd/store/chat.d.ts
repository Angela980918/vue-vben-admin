import type { Content, Direction, Status } from '../response';

export interface ChatMessage {
  _id: string;
  from?: string;
  wamid: string;
  to: string;
  type: MessageType;
  content: Content;
  direction: Direction;
  deliverTime: string;
  status?: Status;
  __v: number;
  name: string;
  color: string;
  msgIndex: string;
  fileExtension?: string;
  fileExtension: string | undefined;
  nickName?: string;
}
