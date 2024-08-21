import { call, put, takeLatest } from "redux-saga/effects";
import ML_API from "../../api";
import { ICompany, IVerifyEmployeeRequest, IVerifyEmployeeResponse } from "money-loaner-api-types";
import { authActions } from "./auth.slice";
import { companyActions } from "../company/company.slice";
import { PayloadAction } from "@reduxjs/toolkit";



function* fetchCompanies() {
    try {
        const response: Array<ICompany> | null = yield call([ML_API, ML_API.getAllCompanies])
        if (response) {
          yield  put(authActions.fetchCompaniesSuccess(response))
        }
    } catch (error:any) {
        yield put(authActions.fetchCompaniesFailure(error.message || "Erreur inconnu"))
    }
    
}



function* verifyEmployee(action: PayloadAction<IVerifyEmployeeRequest>) {
    try {
       
        const response: IVerifyEmployeeResponse = yield call([ML_API, ML_API.verifyEmployee], action.payload);
        
        
        if (response) {
            yield put(authActions.verifyEmployeeSuccess(response.data));
        }
    } catch (error: any) {
        yield put(authActions.verifyEmployeeFailure(error.message || 'Erreur inconnue'));
    }
}



export default function* authSagas() {
    yield takeLatest(authActions.fetchCompaniesRequest.type, fetchCompanies)
    yield takeLatest(authActions.verifyEmployeeRequest.type, verifyEmployee)
    
    
    
}