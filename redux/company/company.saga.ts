// company.saga.ts
import { call, put, takeLatest } from 'redux-saga/effects';
import ML_API from '../../api';
import { IGetAllEmployeesRequest, IGetAllEmployeesResponse, ILoginCompanyRequestBody, ILoginCompanyResponse, IRegisterEmployeeRequestBody, IRegisterEmployeeResponse, IUpdateCompanyRequest, IUpdateCompanyResponse, IUpdateEmployeeRequest, IUpdateEmployeeResponse, IUpdateLoanParametersRequest, IUpdateLoanParametersResponse } from 'money-loaner-api-types';
import { companyActions } from './company.slice';
import { PayloadAction } from '@reduxjs/toolkit';
import { authActions } from '../auth/auth.slice';


const delay = async (time:number)=>new Promise(resolve => setTimeout(resolve, time))

function* login(action: PayloadAction<ILoginCompanyRequestBody>) {
    try {
       
        const response: ILoginCompanyResponse = yield call([ML_API, ML_API.loginCompany], action.payload);
        
        
        if (response) {
            yield put(companyActions.loginCompanySuccess(response.entity));
            yield put(authActions.setConnectedEntityData(response.entity));
            yield put(authActions.setConnectedEntityType("company"));
            yield put(authActions.setXRSFtoken(response.xsrfToken))
        }
    } catch (error: any) {
        yield put(companyActions.loginCompanyFailure(error.message || 'Erreur inconnue'));
    }
}

function* update(action: PayloadAction<IUpdateCompanyRequest>) {
    try {
      
        
        const response: IUpdateCompanyResponse = yield call([ML_API, ML_API.updateCompany], action.payload);

        if (response) {
            yield put(companyActions.updatingCompanySuccess(response.data));
            yield put(authActions.setConnectedEntityData(response.data));
            yield put(authActions.setConnectedEntityType("company"));
        } else {
            yield put(companyActions.updatingCompanyFailure( 'impossible de joindre le serveur'));
        }
    } catch (error: any) {
        yield put(companyActions.updatingCompanyFailure(error.message || 'Erreur inconnue'));
    }
}

function* updateLoanParameters(action: PayloadAction<IUpdateLoanParametersRequest>) {
    try {
      
        const response: IUpdateLoanParametersResponse = yield call([ML_API, ML_API.updateLoanParameters], action.payload);

        if (response) {
            yield put(companyActions.updateLoanParamSuccess(response.data));
            yield put(authActions.setConnectedEntityData(response.data));
            yield put(authActions.setConnectedEntityType("company"));
        } else {
            yield put(companyActions.updateLoanParamFailure( 'impossible de joindre le serveur'));
        }
    } catch (error: any) {
        yield put(companyActions.updatingCompanyFailure(error.message || 'Erreur inconnue'));
    }
}

function* addEmployee(action: PayloadAction<IRegisterEmployeeRequestBody>) {
    try {
       
        
        const response: IRegisterEmployeeResponse = yield call([ML_API, ML_API.registerEmployee], action.payload);

        if (response) {
            yield put(companyActions.addEmployeeSuccess());
        } else {
            yield put(companyActions.addEmployeeFailure( 'impossible de joindre le serveur'));
        }
    } catch (error: any) {
        yield put(companyActions.addEmployeeFailure(error?.message || 'Erreur inconnue'));
    }
}

function* updateEmployee(action: PayloadAction<IUpdateEmployeeRequest>) {
    try {
        
        
        const response: IUpdateEmployeeResponse = yield call([ML_API, ML_API.updateEmployee], action.payload);

        if (response) {
            yield put(companyActions.updateEmployeeSuccess());
        } else {
            yield put(companyActions.updateEmployeeFailure( 'impossible de joindre le serveur'));
        }
    } catch (error: any) {
        yield put(companyActions.updateEmployeeFailure(error?.message || 'Erreur inconnue'));
    } finally {
        yield put(companyActions.resetUpdatingEmployee())
    }
}

function* fetchEmployees(action: PayloadAction<IGetAllEmployeesRequest>) {
    try {
        const response: IGetAllEmployeesResponse | null = yield call([ML_API, ML_API.getAllEmployees], action.payload)
        if (response) {
          yield  put(companyActions.getEmployeesSuccess(response.data))
        }
    } catch (error:any) {
        yield put(companyActions.getEmployeesFailure(error.message || "Erreur inconnu"))
    }
    
}

export default function* companySagas() {
    yield takeLatest(companyActions.loginCompanyRequest.type, login);
    yield takeLatest(companyActions.updateCompanyRequest.type, update);
    yield takeLatest(companyActions.addEmployeeRequest.type, addEmployee);
    yield takeLatest(companyActions.updateEmployeeRequest.type, updateEmployee);
    yield takeLatest(companyActions.getEmployeesrequest.type, fetchEmployees);
    yield takeLatest(companyActions.updateLoanParamRequest.type, updateLoanParameters)
}

