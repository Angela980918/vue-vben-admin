/**
 * 響應返回的商業號碼
 */
export interface AgentAccountRes {
  id: number;
  account_name: string;
  phone_number: string;
  status: string;
  creator: string;
  editor: string;
  created_at: string;
  updated_at: string;
}

export type AgentAccountsListRes = AgentAccountRes[];
