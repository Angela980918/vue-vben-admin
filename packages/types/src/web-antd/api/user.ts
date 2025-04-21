export interface UserCompanyResponse {
  cert_status: boolean | null;
  company_admin: string;
  created_at: string;
  creator: string;
  editor: string;
  id: string;
  industry: number;
  logo: string;
  mb_id: null | string;
  name: string;
  tax_number: string;
  updated_at: string;
  website: string;
  [property: string]: any;
}

export interface UserCompaniesResponse {
  companys: UserCompanyResponse[];
  message: string;
  [property: string]: any;
}
