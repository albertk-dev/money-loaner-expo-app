import { all, call, put, takeEvery } from "redux-saga/effects";
import { loanActions } from "./loan.slice";
import ML_API from "../../api";
import { PayloadAction } from "@reduxjs/toolkit";
import { ICreateLoanRequest, ICreateLoanResponse, IGetAllCompanyLoansRequest, IGetAllCompanyLoansResponse, IGetAllLoansOfEmployeeRequest, IGetAllLoansOfEmployeeResponse, ILoan, IRepayLoanRequest, IRepayLoanResponse, IVerifyIfEmployeeCanDoLoanRequest, IVerifyIfEmployeeCanDoLoanResponse } from "money-loaner-api-types";

function* createLoanSaga(action: PayloadAction<ICreateLoanRequest>) {
  try {
    const canWork: IVerifyIfEmployeeCanDoLoanResponse = yield call([ML_API, ML_API.getAllLoansOfEmployee], action.payload);
    if (canWork) {
      yield put(loanActions.verifyEmployeeSuccess(canWork));
      const data: ICreateLoanResponse = yield call([ML_API, ML_API.createLoan], action.payload);
      console.log("pret créer avec succès : ", data.data)
      yield put(loanActions.createLoanSuccess());
    } else {
      throw ('Vous avez déja des prets non-remboursser')
    }

  } catch (error: any) {
    yield put(loanActions.createLoanFailure(error.message || error || "erreur lors de la creation: "));
  }
}



function* getAllCompanyLoansSaga(action: PayloadAction<IGetAllCompanyLoansRequest>) {
  try {
    const data: IGetAllCompanyLoansResponse = yield call([ML_API, ML_API.getAllCompanyLoans], action.payload);
    yield put(loanActions.getAllCompanyLoansSuccess(data.data));
  } catch (error: any) {
    yield put(loanActions.getAllCompanyLoansFailure(error.message));
  }
}

interface repayAllResponse {
  message: string;
  data: {
    modifiedCount: number;
  };
}
interface repayMulResponse {
  message: string;
  data: {
    refunded: boolean;
  };
}

function* repayLoansSaga(action: PayloadAction<{ mode: 'one' | 'multiple' | 'all' | 'none', companyId: string, loans_Ids: Array<string>, repayAccount: string }>) {
  try {
    switch (action.payload.mode) {
      case 'one':
        const data: IRepayLoanResponse = yield call([ML_API, ML_API.repayLoan], { loanId: action.payload.loans_Ids[0], repayAccount: action.payload.repayAccount });
        yield put(loanActions.repayLoanSuccess(data));
        break;
      case 'all':
        const data_all: repayAllResponse = yield call([ML_API, ML_API.rePayAllLoanOfCompany], action.payload.companyId, action.payload.repayAccount);
        yield put(loanActions.repayLoanSuccess(data_all));
        break;
      case 'multiple':
        const data_multiple: repayMulResponse = yield call([ML_API, ML_API.repayMultiple], {
          loanIds: action.payload.loans_Ids,
          repayAccount: action.payload.repayAccount,
          companyId: action.payload.companyId,
        });
        yield put(loanActions.repayLoanSuccess(data_multiple));
        break;
      default:
        console.log('no mode specified')
        return;

        break;
    }
  } catch (error) {

  }
}

function* getAllLoansOfEmployeeSaga(action: PayloadAction<IGetAllLoansOfEmployeeRequest>) {
  try {
    console.log('getting all employees')
    const data: IGetAllLoansOfEmployeeResponse = yield call([ML_API, ML_API.getAllLoansOfEmployee], action.payload);

    yield put(loanActions.getAllEmployeeLoansSuccess(data.data));
  } catch (error: any) {
    yield put(loanActions.getAllEmployeeLoansFailure(error.message));
  }
}

function* verifyIfEmployeeCanDoLoanSaga(action: PayloadAction<IVerifyIfEmployeeCanDoLoanRequest>) {
  try {
    const data: IVerifyIfEmployeeCanDoLoanResponse = yield call([ML_API, ML_API.verifyIfEmployeeCanDoLoan], action.payload);
    console.log('données de verif', data)
    yield put(loanActions.verifyEmployeeSuccess(data));
  } catch (error: any) {
    yield put(loanActions.getAllEmployeeLoansFailure(error.message));
  }
}

export default function* loanSagas() {
  yield all([
    takeEvery(loanActions.createLoanStart.type, createLoanSaga),
    takeEvery(loanActions.repayLoanStart.type, repayLoansSaga),
    takeEvery(loanActions.getAllCompanyLoansStart.type, getAllCompanyLoansSaga),
    takeEvery(loanActions.verifyEmployee.type, verifyIfEmployeeCanDoLoanSaga),
    takeEvery(loanActions.getAllEmployeeLoansStart.type, getAllLoansOfEmployeeSaga)
  ]);
}