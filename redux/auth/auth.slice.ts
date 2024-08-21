import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICompany, IEmployee, IFullEmployee, IVerifyEmployeeRequest } from "money-loaner-api-types";



interface authState {
    xrsfToken: string | null,
    connectedEntity: {
        data: ICompany | IFullEmployee | null;
        type: "employee" | "company" | null;
    },
    allCompanies: Array<ICompany> | null;
    fetchingCompanies: boolean | null;
    fetchingCompaniesSuccess: boolean|null;
    errorFetchingCompanies: string | null;
    selectedCompany: ICompany | null;
    verifiedEmployee: IEmployee | null;
    verifyingEmployee: boolean | null;
    verifyEmployeeSuccess: boolean | null;
    errorVerifyEmployee: string | null;
}

const initialState: authState = {
    xrsfToken: null,
    connectedEntity: {
        data: null,
        type: null,
    },
    allCompanies:null,
    fetchingCompanies: false,
    fetchingCompaniesSuccess: false,
    errorFetchingCompanies: null,
    selectedCompany: null,
    verifiedEmployee: null,
    verifyingEmployee: null,
    verifyEmployeeSuccess:  null,
    errorVerifyEmployee: null,
    

}




export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setXRSFtoken(state, action: PayloadAction<string>) {
            state.xrsfToken = action.payload;
        },
        setSelectedCompany(state, action: PayloadAction<ICompany>) {
            state.selectedCompany = action.payload;
        },
        setConnectedEntityData(state, action: PayloadAction<ICompany | IFullEmployee>) {
            state.connectedEntity.data = action.payload;
        },
        setConnectedEntityType(state, action: PayloadAction<"employee" | "company">) {
            state.connectedEntity.type = action.payload;
        },
        setVerifiedEmployee(state, action: PayloadAction<IEmployee>) {
            state.verifiedEmployee = action.payload;
        },
        
        fetchCompaniesRequest(state) {
            state.fetchingCompanies = true;
            state.fetchingCompaniesSuccess = false;
            state.errorFetchingCompanies = null;
            
        },
        fetchCompaniesSuccess(state, action: PayloadAction<Array<ICompany>>) {
            state.fetchingCompanies = false;
            state.fetchingCompaniesSuccess = true;
            state.errorFetchingCompanies = null;
            state.allCompanies = action.payload;
            
        },
        fetchCompaniesFailure(state, action: PayloadAction<string>) {
            state.fetchingCompanies = false;
            state.fetchingCompaniesSuccess = false;
            state.errorFetchingCompanies = action.payload;
          
            
        },
        verifyEmployeeRequest(state, action:PayloadAction<IVerifyEmployeeRequest>) {
            state.verifyingEmployee = true;
        },
        verifyEmployeeSuccess(state, action:PayloadAction<IEmployee>) {
            state.verifyingEmployee = false;
            state.verifyEmployeeSuccess = true;
            state.errorVerifyEmployee = null;
            state.verifiedEmployee = action.payload
        },
        verifyEmployeeFailure(state, action: PayloadAction<string>) {
            state.verifyingEmployee = false;
            state.verifyEmployeeSuccess = false;
            state.errorVerifyEmployee = action.payload;
        },
        clearVerificationData(state) {
            state.verifiedEmployee= null;
    state.verifyingEmployee= null;
    state.verifyEmployeeSuccess=  null;
    state.errorVerifyEmployee= null;
        },

        clearAuhtData(state) {
            state.xrsfToken = null;
                state.connectedEntity = {
                    data: null,
                type: null,
                },
                state.allCompanies = null;
                state.fetchingCompanies = false;
                state.fetchingCompaniesSuccess = false;
                state.errorFetchingCompanies = null;
                state.selectedCompany = null;
            state.verifiedEmployee = null;
            state.verifyingEmployee= null;
            state.verifyEmployeeSuccess=  null;
            state.errorVerifyEmployee= null;
        },

    }
    
    
})


export const authActions = authSlice.actions

const authReducer = authSlice.reducer

export default authReducer