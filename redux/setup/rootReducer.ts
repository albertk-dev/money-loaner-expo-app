import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../auth/auth.slice";
import companyReducer from "../company/company.slice";
import employeeReducer from "../employee/employee.slice";
import loanReducer from "../loan/loan.slice";
import appReducer from "../App/app.slice";


const rootReducer = combineReducers({
   auth: authReducer,
    company: companyReducer,
   employee: employeeReducer,
   loan:loanReducer,
   app: appReducer,
}) 


export type RootState = ReturnType<typeof rootReducer>

export default rootReducer