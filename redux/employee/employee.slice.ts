import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICompany, IEmployee, IFullEmployee, ILoginEmployeeRequestBody, IUpdateEmployeeRequest } from "money-loaner-api-types";



interface employeeState {
    employeeInfos: IFullEmployee | null;
    loginLoading: boolean;
    loginSuccess: boolean;
    loginErrorMessage: string | null;
    updatingEmployee: boolean | null;
    updateEmployeeSuccess:boolean | null;
    errorUpdatingEmployee: string | null;
   
    
}

const initialState: employeeState = {
    employeeInfos: null,
    loginLoading: false,
    loginSuccess: false,
    loginErrorMessage: null,
    updatingEmployee:  null,
    updateEmployeeSuccess: null,
    errorUpdatingEmployee:null,
    
    
 
}




export const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {
        loginEmployeeRequest(state, action: PayloadAction<ILoginEmployeeRequestBody>) {
            state.loginLoading = true;
            state.loginSuccess = false;
            state.loginErrorMessage = null;
        },
        loginEmployeeSuccess(state, action: PayloadAction<IFullEmployee>) {
            state.loginLoading = false;
            state.loginSuccess = true;
            state.loginErrorMessage = null;
            state.employeeInfos = action.payload;
        },
        loginEmployeeFailure(state, action: PayloadAction<string>) {
            state.loginLoading = false;
            state.loginSuccess = false;
            state.loginErrorMessage = action.payload;
        },
        updateEmployeeRequest(state, action: PayloadAction<IUpdateEmployeeRequest>) {
            state.updatingEmployee = true;
            state.updateEmployeeSuccess = null;
            state.errorUpdatingEmployee = null;
        },
        updateEmployeeSuccess(state, action:PayloadAction<IFullEmployee>) {
            state.updatingEmployee = null;
            state.updateEmployeeSuccess = true;
            state.errorUpdatingEmployee = null;
            state.employeeInfos = action.payload;
        },
        updateEmployeeFailure(state, action: PayloadAction<string>) {
            state.updatingEmployee = false;
            state.updateEmployeeSuccess = false;
            state.errorUpdatingEmployee = action.payload;
        },
        resetUpdatingEmployee(state) {
            state.updatingEmployee = null;
            state.updateEmployeeSuccess = null;
            state.errorUpdatingEmployee = null;
        },
      
       
        clearData(state) {
            state.employeeInfos = null;
            state.loginLoading= false;
            state.loginSuccess= false;
            state.loginErrorMessage= null;
           
        }
    }
    
    
})


export const employeeActions = employeeSlice.actions


const employeeReducer = employeeSlice.reducer
export default employeeReducer