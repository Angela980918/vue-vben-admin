import type { Content, Direction, Status } from '../response';

export type Type = 'audio' | 'document' | 'template' | 'text' | 'video';

export interface ChatMessage {
  _id: string;
  from: string;
  wamid: string;
  to: string;
  type: Type;
  content: Content;
  direction: Direction;
  deliverTime: string;
  status: Status;
  __v: number;
  name: string;
  color: string;
  msgIndex: string;
  fileExtension?: string;
  fileExtension: string | undefined;
}
