// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import { LightMode } from "../theme/theme";
import { AlertPayload, UserPayload, CompanyPayload, State, User, DepartmentPayload } from "../types";
import { server_host, server_url } from "../utils/HTTP";

let TMS_USER = localStorage.getItem("TMS_USER");
TMS_USER = TMS_USER && JSON.parse(TMS_USER);

let TMS_DEPARTMENT = localStorage.getItem("TMS_DEPARTMENT")
TMS_DEPARTMENT = TMS_DEPARTMENT && JSON.parse(TMS_DEPARTMENT)

let TMS_COMPANY = localStorage.getItem("TMS_COMPANY")
TMS_COMPANY = TMS_COMPANY && JSON.parse(TMS_COMPANY)

const initialState: State = {
  hide: true,
  user: {
    email: TMS_USER?.email,
    role: TMS_USER?.role,
    user_id: TMS_USER?.user_id,
    tokens: TMS_USER?.tokens,
    // contact: "0756643681"
  },
  theme: LightMode,
  SERVER_URL: server_url,
  alert: {
    title: "",
    body: "",
    mode: "",
  },
  loading: false,
  department: TMS_DEPARTMENT,
  company: TMS_COMPANY,
};

export const DataSlice = createSlice({
  initialState,
  name: "data_slice",
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },

    setAlert: (state, action: AlertPayload) => {
      state.alert = action.payload;
    },
    disableHide: (state) => {
      state.hide = false
    },
    allowHide: (state)=>{
      state.hide = true
    },
    setLoadingState: (state, action) => {
      state.loading = action.payload;
    },
    setDepartment: (state, action: DepartmentPayload)=>{
        state.department = action.payload
        action.payload.name ? localStorage.setItem("TMS_DEPARTMENT", JSON.stringify(state.department)): localStorage.removeItem("TMS_DEPARTMENT")
    },
    setCompany: (state, action: CompanyPayload)=>{
        state.company = action.payload
        action.payload.name ? localStorage.setItem("TMS_COMPANY", JSON.stringify(state.company)): localStorage.removeItem("TMS_COMPANY")
    }
    ,
    setUser: (state, action: UserPayload) => {
      state.user = action?.payload;
      if (!action?.payload?.email) {
        localStorage.removeItem("TMS_USER");
        localStorage.removeItem("TMS_DEPARTMENT")
        localStorage.removeItem("TMS_COMPANY")
      } else {
        localStorage.setItem("TMS_USER", JSON.stringify(state?.user));
      }
    },
  },
});

export const getTheme = (state: any) => state?.data?.theme;
export const getHide = (state: any)=>state?.data?.hide
export const getCompany = (state: any) => state?.data?.company;
export const getDepartment = (state: any) => state?.data?.department;
export const loadingState = (state: any) => state?.data?.loading;
export const alert_msg = (state: any) => state?.data?.alert;
export const SERVER_URL = (state: any) => state?.data?.SERVER_URL;
export const getUser = (state: any) => state?.data?.user
export const { setAlert, setLoadingState, setUser, setCompany, allowHide, disableHide, setDepartment } = DataSlice.actions;

export default DataSlice.reducer;
