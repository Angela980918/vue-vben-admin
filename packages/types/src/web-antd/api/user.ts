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

export interface Industries {
  created_at: string;
  description: string;
  id: number;
  name: string;
  updated_at: string;
  [property: string]: any;
}

export interface User {
  address: null;
  birthday: null;
  company_id: string;
  company_name: string;
  created: string;
  creator: null;
  deleted: number;
  edited: string;
  editor: string;
  email: null;
  gender: string;
  head_img_url: string;
  id: string;
  is_locked: number;
  is_verified: boolean;
  last_login: null;
  login_count: number;
  mobile: null;
  role: string;
  role_id: number;
  salt: null;
  state: null;
  updated_at: string;
  user_name: string;
  [property: string]: any;
}

export interface Company {
  cert_status: null;
  company_admin: string;
  created_at: string;
  creator: string;
  editor: string;
  id: string;
  industries: Industries;
  industry: number;
  logo: string;
  mb_id: null;
  name: string;
  tax_number: string;
  updated_at: string;
  website: string;
  [property: string]: any;
}
/**
 * SwitchUserCompanyDto
 */
export interface SwitchUserCompanyDto {
  company: Company;
  message: string;
  user: User;
  [property: string]: any;
}
