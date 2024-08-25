import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IActivity, ICompany, IEmployee, IGetAllEmployeesRequest, ILoginCompanyRequestBody, IRegisterEmployeeRequestBody, IUpdateCompanyRequest, IUpdateEmployeeRequest, IUpdateLoanParametersRequest } from "money-loaner-api-types";



interface companyState {
    companyInfos: ICompany | null;
    employees: IEmployee[];
    loginLoading: boolean | null;
    loginSuccess: boolean | null;
    loginErrorMessage: string | null;
    gettingEmployees: boolean | null;
    gettingEmployeesSucces: boolean | null;
    errorGettingEmployees: string | null;
    postingEmployee: boolean | null;
    postingEmployeeSucces: boolean | null ;
    errorPostingEmployee: string | null;
    updatingCompany: boolean | null;
    updateCompanySuccess: boolean | null;
    errorUpdatingCompany: string | null;
    addingEmployee: boolean | null;
    addEmployeeSuccess: boolean | null;
    errorAddingEmployee: string | null;
    updatingEmployee: boolean | null;
    updateEmployeeSuccess:boolean | null;
    errorUpdatingEmployee: string | null;
    updatingLoanParam: boolean | null;
    updateLoanParamSuccess: boolean | null;
    errorUpdatingLoanParam: string| null;
    lastedActivities:IActivity[];
   
}

const initialState: companyState = {
    companyInfos:null,
    lastedActivities:[],
    employees:  [],
    loginLoading: null,
    loginSuccess: null,
    loginErrorMessage:  null,
    gettingEmployees: null,
    gettingEmployeesSucces: null,
    errorGettingEmployees: null,
    postingEmployee: null,
    postingEmployeeSucces: null,
    errorPostingEmployee: null,
    updatingCompany:  null,
    updateCompanySuccess:  null,
    errorUpdatingCompany: null,
    addingEmployee: null,
    addEmployeeSuccess: null,
    errorAddingEmployee: null,
    updatingEmployee:  null,
    updateEmployeeSuccess: null,
    errorUpdatingEmployee: null,
    updatingLoanParam:  null,
    updateLoanParamSuccess:null,
    errorUpdatingLoanParam:  null,
    
}




export const companySlice = createSlice({
    name: "company",
    initialState,
    reducers: {
        loginCompanyRequest(state, action: PayloadAction<ILoginCompanyRequestBody>) {
            state.loginLoading = true;
            state.loginSuccess = null;
            state.loginErrorMessage = null;
        },
        loginCompanySuccess(state, action: PayloadAction<ICompany>) {
            state.loginLoading = null;
            state.loginSuccess = true;
            state.loginErrorMessage = null;
            state.companyInfos = action.payload;
        },
        loginCompanyFailure(state, action: PayloadAction<string>) {
            state.loginLoading = null;
            state.loginSuccess = null;
            state.loginErrorMessage = action.payload;
        },
        updateCompanyRequest(state, action: PayloadAction<IUpdateCompanyRequest>) {
            state.updatingCompany = true;
            state.errorUpdatingCompany = null;
            state.updateCompanySuccess = true;
        },
        updatingCompanySuccess(state, action: PayloadAction<ICompany>) {
            state.updatingCompany = false;
            state.updateCompanySuccess = true;
            state.companyInfos = action.payload;
            state.errorUpdatingCompany = null;
        },
        updatingCompanyFailure(state, action: PayloadAction<string>) {
            state.updatingCompany = false;
            state.updateCompanySuccess = false;
            state.errorUpdatingCompany = action.payload;
        },
        updateLoanParamRequest(state, action:PayloadAction<IUpdateLoanParametersRequest>) {
            state.updatingLoanParam = true;
            state.updateLoanParamSuccess = null;
            state.errorUpdatingLoanParam = null;
        },
        updateLoanParamSuccess(state, action:PayloadAction<ICompany>) {
            state.updatingLoanParam = false;
            state.updateLoanParamSuccess = true;
            state.errorUpdatingLoanParam = null;
            state.companyInfos = action.payload;
        },
        updateLoanParamFailure(state, action:PayloadAction<string>) {
            state.updatingLoanParam = false;
            state.updateLoanParamSuccess = false;
            state.errorUpdatingLoanParam = action.payload;
        },
        resetUpdateLoanParam(state) {
            state.updatingLoanParam = null;
            state.updateLoanParamSuccess = null;
            state.errorUpdatingLoanParam = null;
        },
        addEmployeeRequest(state, action: PayloadAction<IRegisterEmployeeRequestBody>) {
            state.addingEmployee = true;
            state.addEmployeeSuccess = null;
            state.errorAddingEmployee = null;
        },
        addEmployeeSuccess(state) {
            state.addingEmployee = null;
            state.addEmployeeSuccess = true;
            state.errorAddingEmployee = null;
        },
        addEmployeeFailure(state, action: PayloadAction<string>) {
            state.addingEmployee = false;
            state.addEmployeeSuccess = false;
            state.errorAddingEmployee = action.payload;
        },
        updateEmployeeRequest(state, action: PayloadAction<IUpdateEmployeeRequest>) {
            state.updatingEmployee = true;
            state.updateEmployeeSuccess = null;
            state.errorUpdatingEmployee = null;
        },
        updateEmployeeSuccess(state) {
            state.updatingEmployee = null;
            state.updateEmployeeSuccess = true;
            state.errorUpdatingEmployee = null;
        },
        updateEmployeeFailure(state, action: PayloadAction<string>) {
            state.updatingEmployee = false;
            state.updateEmployeeSuccess = false;
            state.errorUpdatingEmployee = action.payload;
        },
        resetAddingEmployee(state) {
            state.addingEmployee = null;
            state.addEmployeeSuccess = null;
            state.errorAddingEmployee = null;
        },
        resetUpdatingEmployee(state) {
            state.updatingEmployee = null;
            state.updateEmployeeSuccess = null;
            state.errorUpdatingEmployee = null;
        },
        getEmployeesrequest(state, action: PayloadAction<IGetAllEmployeesRequest>) {
            state.gettingEmployees = true;
            state.gettingEmployeesSucces = false;
            state.errorGettingEmployees = null;
        },
        getEmployeesSuccess(state, action: PayloadAction<Array<IEmployee>>) {
            state.gettingEmployees = false;
            state.gettingEmployeesSucces = true;
            state.errorGettingEmployees = null;
            state.employees = action.payload;
        },
        getEmployeesFailure(state, action: PayloadAction<string>) {
            state.gettingEmployees = false;
            state.gettingEmployeesSucces = false;
            state.errorGettingEmployees = action.payload;
        },
        clearUpdateData(state) {
            state.updateCompanySuccess = null
            state.updatingCompany = null
            state.errorUpdatingCompany = null
        },
        getActivitiesRequest(state, action: PayloadAction<{companyId:string, number?:number}>){
            console.log("getting acttivities...")

        },
        setActivities(state,action: PayloadAction<IActivity[]>){
            console.log("act payload", action)
           
            state.lastedActivities = action.payload
        },
        clearData(state) {
            state.companyInfos = null;
            state.employees = [];
            state.loginLoading = null;
            state.loginSuccess = null;
            state.loginErrorMessage = null;
            state.gettingEmployees = null;
            state.gettingEmployeesSucces = null;
            state.errorGettingEmployees = null;
            state.postingEmployee = null,
            state.postingEmployeeSucces = null;
            state.errorPostingEmployee = null;
            state.updatingCompany = null;
            state.updateCompanySuccess = null;
            state.errorUpdatingCompany = null;
            state.addingEmployee = null;
            state.addEmployeeSuccess = null;
            state.errorAddingEmployee = null;
            state.updatingEmployee = null;
            state.updateEmployeeSuccess = null;
            state.errorUpdatingEmployee = null;
    
    
        }
    }
})


export const companyActions = companySlice.actions

const companyReducer = companySlice.reducer

export default companyReducer