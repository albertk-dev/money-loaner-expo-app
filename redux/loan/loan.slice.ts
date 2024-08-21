import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICreateLoanRequest, IGetAllCompanyLoansRequest, IGetAllLoansOfEmployeeRequest, ILoan, IVerifyEmployeeRequest, IVerifyIfEmployeeCanDoLoanRequest, IVerifyIfEmployeeCanDoLoanResponse } from "money-loaner-api-types";



// Interface pour l'état du slice
interface LoanState {
    companyLoans: ILoan[]; // Adapter le type selon vos besoins
    employeeLoans: ILoan[]; // Adapter le type selon vos besoins
    loading: boolean;
    error: string | null;
    employeeCanDoLoan: boolean;
    loanCreatedSuccess: boolean | null;
    repayLoanSuccess: boolean | null;
    selectedLoansToRepay: ILoan[];
    oneLoanToRepay: ILoan | null;
    repayMode: 'one' | 'multiple' | 'all' | 'none'


}

// État initial
const initialState: LoanState = {
    companyLoans: [],
    employeeLoans:[],
    loading: false,
    error: null,
    selectedLoansToRepay: [],
    oneLoanToRepay:  null,
    repayMode: 'none',
    employeeCanDoLoan: false,
    loanCreatedSuccess: null,
    repayLoanSuccess:null,
};

// Créer le slice
const loanSlice = createSlice({
    name: 'loan',
    initialState,
    reducers: {
        createLoanStart(state, action:PayloadAction<ICreateLoanRequest>) {
            state.loading = true;
            state.error = null;
            state.loanCreatedSuccess = null;
        },
        createLoanSuccess(state) {
            state.loading = false;
            state.loanCreatedSuccess = true;
          
        },
        createLoanFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            state.loanCreatedSuccess = false;
        },
        repayLoanStart(state, action: PayloadAction<{ mode: 'one' | 'multiple' | 'all' | 'none', companyId: string, loans_Ids: Array<string>, repayAccount: string }>) {
            state.loading = true;
            state.error = null;
            state.repayLoanSuccess = null;
        },
        repayLoanSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
            state.repayLoanSuccess = true;
            // Mettre à jour l'état des prêts si nécessaire
        },
        repayLoanFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            state.repayLoanSuccess = false;
        },
        getAllCompanyLoansStart(state, action:PayloadAction<IGetAllCompanyLoansRequest>) {
            state.loading = true;
            state.error = null;
        },
        getAllCompanyLoansSuccess(state, action: PayloadAction<ILoan[]>) {
            state.loading = false;
            state.companyLoans = action.payload;
        },
        getAllCompanyLoansFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        getAllEmployeeLoansStart(state,action:PayloadAction<IGetAllLoansOfEmployeeRequest>) {
            state.loading = true;
            state.error = null;
        },
        getAllEmployeeLoansSuccess(state, action:PayloadAction<ILoan[]>) {
            state.loading = false;
            state.error = null;
            state.employeeLoans = action.payload;
            state.companyLoans = []
        },
        getAllEmployeeLoansFailure(state, action:PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload; 
        },
        verifyEmployee(state, action:PayloadAction<IVerifyIfEmployeeCanDoLoanRequest>) {
            state.loading = true;
            state.error = null;
        },
        verifyEmployeeSuccess(state, action: PayloadAction<IVerifyIfEmployeeCanDoLoanResponse>) {
            state.loading = true;
            state.error = null;
            state.employeeCanDoLoan = action.payload.data.canDoLoan;
        },
        verifyEmployeeFailure(state, action:PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            state.employeeCanDoLoan = false
        },
        clearSelectedLoans(state){
                state.selectedLoansToRepay = []
        },
      
        setRepayMode(state, action:PayloadAction<'one' | 'multiple' | 'all'>){
            state.repayMode = action.payload;
        },
        setOneLoanToRepay(state, action:PayloadAction<ILoan>){
            state.oneLoanToRepay = action.payload;
        },
        addLoanToRepay(state, action:PayloadAction<ILoan>){
            state.selectedLoansToRepay.push(action.payload)
        },
        removeLoanToRepay(state, action:PayloadAction<ILoan>){
            state.selectedLoansToRepay = state.selectedLoansToRepay.filter((l)=>l._id!= action.payload._id)
        },
        
       
        clearRepaydata(state) {
            state.repayLoanSuccess = null;
            state.loading = false;
        },
        clearCreateData(state) {
            state.loanCreatedSuccess = null;
        },
        clearError(state) {
            state.error = null;
        },
        clearData(state) {
            state.loading = false;
            state.error = null;
            state.employeeLoans = [];
            state.companyLoans = [];
            state.loanCreatedSuccess = null;
            state.repayLoanSuccess = null;
        },

    },
});


export const loanActions = loanSlice.actions

const loanReducer = loanSlice.reducer;

export default loanReducer;