import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAppParams } from "money-loaner-api-types";




interface AppState  {
    appLoanerAccount: string;
    appPercentage : number;
}

const initialState : AppState = {
    appLoanerAccount: "679770464",
    appPercentage: 10,
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers : {
        setAppParams(state, action: PayloadAction<IAppParams>){
            state.appLoanerAccount = action.payload.appLoanerAccount;
            state.appPercentage = action.payload.appPercentage;

        }

    }
})

export const appActions = appSlice.actions

const appReducer = appSlice.reducer

export default appReducer