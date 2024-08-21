// company.saga.ts
import { call, put, takeLatest } from 'redux-saga/effects';
import ML_API from '../../api';
import {  ILoginEmployeeRequestBody, ILoginEmployeeResponse, IUpdateEmployeeRequest, IUpdateEmployeeResponse} from 'money-loaner-api-types';

import { PayloadAction } from '@reduxjs/toolkit';
import { authActions } from '../auth/auth.slice';
import { employeeActions } from './employee.slice';


const delay = async (time:number)=>new Promise(resolve => setTimeout(resolve, time))

function* login(action: PayloadAction<ILoginEmployeeRequestBody>) {
    try {
        console.log("Login request", action)
        const response: ILoginEmployeeResponse = yield call([ML_API, ML_API.loginEmployee], action.payload);
        
        
        if (response) {
            yield put(employeeActions.loginEmployeeSuccess(response.entity));
            yield put(authActions.setConnectedEntityData(response.entity));
            yield put(authActions.setConnectedEntityType("employee"));
            yield put(authActions.setXRSFtoken(response.xsrfToken))
        }
    } catch (error: any) {
        yield put(employeeActions.loginEmployeeFailure(error.message || 'Erreur inconnue'));
    }
}

function* update(action: PayloadAction<IUpdateEmployeeRequest>) {
    try {
        
        
        const response: IUpdateEmployeeResponse = yield call([ML_API, ML_API.updateEmployee], action.payload);

        if (response) {
            yield put(employeeActions.updateEmployeeSuccess(response.data));
        } else {
            yield put(employeeActions.updateEmployeeFailure( 'impossible de joindre le serveur'));
        }
    } catch (error: any) {
        yield put(employeeActions.updateEmployeeFailure(error?.message || 'Erreur inconnue'));
    } finally {
        yield put(employeeActions.resetUpdatingEmployee())
    }
}



export default function* employeeSagas() {
    yield takeLatest(employeeActions.loginEmployeeRequest.type, login);
    yield takeLatest(employeeActions.updateEmployeeRequest.type, update);
   
}
