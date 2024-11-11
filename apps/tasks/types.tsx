export interface User {
  user_id?: number;
  email: string;
  contact?: string;
  role?: string;
  date_joined?: string;
  tokens?: Tokens
}

export interface Tokens{
  access: string,
  refresh: string
}

export interface Theme {
  primary: string;
  paper: string;
  pale: string;
  error: string;
  success: string;
  text: string;
  placeholder: string;
}

export interface Alert {
  title: string;
  icon?: any;
  body?: string;
  buttons?: any[];
  mode?: "success" | "error" | "normal" | "";
}
export interface AlertPayload{
    payload: Alert
}
export interface UserPayload{
    payload: User
}
export interface CompanyPayload{
    payload: Company
}
export interface DepartmentPayload{
    payload: Department
}

export interface Company{
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface Department{
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface State {
  user: User;
  theme?: Theme;
  SERVER_URL: string;
  alert: Alert;
  loading: boolean
  company?: Company
  department?: Department
  hide: boolean
}
