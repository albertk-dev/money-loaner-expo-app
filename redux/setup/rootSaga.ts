import { all } from "redux-saga/effects";
import authSagas from "../auth/auth.saga";
import companySagas from "../company/company.saga";
import employeeSagas from "../employee/employee.saga";
import loanSagas from "../loan/loan.saga";



export default function* rootSaga() {
    yield all([
        authSagas(),
        companySagas(),
        employeeSagas(),
        loanSagas()
    ])
}