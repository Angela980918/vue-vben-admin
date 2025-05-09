import type { WabaAccount } from '../api';

export interface ToggleCompanyProp {
  companyId: string;
  companyName: string;
  companyLogo: string;
  companyWabaInfo?: WabaAccount;
  wabaAccounts?: WabaAccount[];
}

export type ToggleCompanyProps = ToggleCompanyProp[];
