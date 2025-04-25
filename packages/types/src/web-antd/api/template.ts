import type { RawTemplateData } from '../store';

export type YCouldTemplateResponse = {
  items: RawTemplateData[];
  length: number;
  limit: number;
  offset: number;
  total: number;
};
