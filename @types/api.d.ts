// api.d.ts

declare module 'money-loaner-api-types' {
    // Entités

    interface ICompany {

        _id: string;
        name: string;
        email: string;
        logoURL: string;
        phoneNumber?: string;
        socialId?: string;
        localisation?: string;
        employees?: Array<string>;
        createdAt?: Date;
        updatedAt?: Date;
        password: string;
        logoCloudImagePath: string;
        loanParameters: ILoanParameters;
    }

    interface IEmployee {
        _id: string;
        name: string;
        email: string;
        photoURL: string;
        phoneNumber?: string;
        inCompanyId?: string;
        salary: string;
        job: string;
        createdAt?: Date;
        updatedAt?: Date;
        codePin?: string;
        photoCloudPath: string;
        companyId: string;
    }
    interface IFullEmployee extends IEmployee {
        companyId: ICompany;
    }
    interface IActivity {
        type: "loan"| "repay";
        date?: Date;
        amount: number;
        companyId:string;
    }

    interface IRefreshToken {
        _id?: string;
        token: string;
        expireAt: Date;
        entityId: string;
        entityType: 'employee' | 'company';
        createdAt?: Date;
        updatedAt?: Date;
    }

    // Interfaces des en-têtes
    interface ICommonHeaders {
        'Content-Type': string;
        
    }

    interface IApiAuthHeaders extends ICommonHeaders {
        'x-xsrf-token': string;
    }

    // Requêtes et réponses spécifiques aux entreprises
    interface ILoginCompanyRequestBody {
        
        email: string;
        password: string;
        _id?: string;

    }

    interface ILoginCompanyResponse {
        xsrfToken: string;
        access_token_expireIn: string;
        entity: ICompany;
        eid: string;
    }

    interface IRegisterCompanyRequestBody {
     
            name: string;
            email: string;
            password: string;
            logoURL: string;
        logoCloudImagePath: string;
        socialId: string;
    
    }

    interface IRegisterCompanyResponse {
        message: string;
        data: ICompany;
    }

    interface IUpdateCompanyRequest {
       
        id: string;
        updateData: Partial<ICompany>;
    }

    interface IUpdateCompanyResponse {
        message: string;
        data: ICompany;
    }

    // Requêtes et réponses spécifiques aux employés
    interface ILoginEmployeeRequestBody {
       
    _id: string;
    codePin: string;
    }

    interface ILoginEmployeeResponse {
        xsrfToken: string;
        access_token_expireIn: string;
        entity: IFullEmployee;
        eid: string;
    }

    interface IRegisterEmployeeRequestBody extends Partial<IEmployee> {}

    interface IRegisterEmployeeResponse {
        message: string
        data: IEmployee;
    }

    interface IUpdateEmployeeRequest {
        id: string;
        data: Partial<IEmployee>
    
    }

    interface IUpdateEmployeeResponse {
        message: string
        data: IFullEmployee;

    }

    interface IGetAllEmployeesRequest {
        companyId: string;
    }

    interface IGetAllEmployeesResponse {
        message: string;
        data: IEmployee[];
    }

    interface IVerifyEmployeeRequest {
        
         companyId: string 
         inCompanyId: string 
    }

    interface IVerifyEmployeeResponse {
        
        message: string;
        data: IEmployee;
    }

    // Requêtes et réponses spécifiques aux tokens de rafraîchissement
    interface IRefreshTokenRequest {
       xsrfToken:string
    }

    interface IRefreshTokenResponse {
        message: string;
        xsrfToken: string;
        access_token_expireIn: number;
        eid: string;
        entity: ICompany | IFullEmployee;
        entityType: "employee" | "company";
    }

    // Types de requêtes et réponses communes
    interface IDeleteEntityRequest {
        id: string;
    }

    interface IDeleteEntityResponse {
        message: string;
        data: ICompany | IEmployee ;
    }

   // Requête de création de prêt
export interface ICreateLoanRequest {
    employeeId: string;
    companyId: string;
    amount: number;
    account: string;
    repayAmount: number;
}

// Réponse de création de prêt
export interface ICreateLoanResponse {
    message: string;
    data: ILoan;
}

// Requête de mise à jour de prêt
export interface IUpdateLoanRequest {
    amount?: number;
    refunded?: boolean;
    refundedAt?: Date;
}

// Réponse de mise à jour de prêt
export interface IUpdateLoanResponse {
    message: string;
    data: ILoan;
}

// Interface de prêt
export interface ILoan {
    _id: string;
    no: number;
    employee: IEmployee;
    date: Date;
    company: ICompany;
    amount: number;
    refunded: boolean;
    refundedAt?: Date;
    account: string;
    repayAmount: number;
    repayAccount: string;
    }
    
    // Requête de remboursement de prêt
export interface IRepayLoanRequest {
    loanId: string;
    repayAccount: string;
}

// Réponse de remboursement de prêt
export interface IRepayLoanResponse {
    message: string;
    data: ILoan;
}

// Requête de récupération des prêts d'une entreprise par date
export interface IGetCompanyLoansByDateRequest {
    companyId: string;
    date: Date;
}

// Réponse de récupération des prêts d'une entreprise par date
export interface IGetCompanyLoansByDateResponse {
    message: string;
    data: ILoan[];
}

// Requête de récupération des prêts d'une entreprise sur une période
export interface IGetCompanyLoansByPeriodRequest {
    companyId: string;
    startDate: Date;
    endDate: Date;
}

// Réponse de récupération des prêts d'une entreprise sur une période
export interface IGetCompanyLoansByPeriodResponse {
    message: string;
    data: ILoan[];
}

// Requête de récupération des prêts d'une entreprise par montant
export interface IGetCompanyLoansByAmountRequest {
    companyId: string;
    amount: number;
}

// Réponse de récupération des prêts d'une entreprise par montant
export interface IGetCompanyLoansByAmountResponse {
    message: string;
    data: ILoan[];
    }
    
    // Requête pour récupérer tous les prêts d'une entreprise
export interface IGetAllCompanyLoansRequest {
    companyId: string;
    }
    
    export interface IGetAllCompanyLoansResponse {
        message: string;
        data: ILoan[];
        }

    
    export interface  ILoanParameters {
            maxPercentage: number; // Pourcentage maximum (0 à 100)
            minAmount: number;     // Montant minimum
            stepAmount: number;    // Pas de décompte (par exemple, de 100 en 100)
          }
    export interface IUpdateLoanParametersRequest{
        companyId: string;
        loanParameters: Partial<ILoanParameters>
    }

    export interface IUpdateLoanParametersResponse{
        message: string;
        data: ICompany;
    }

    export interface IGetAllLoansOfEmployeeRequest{
        employeeId: string;
    }

    export interface IGetAllLoansOfEmployeeResponse{
        message: string;
        data: ILoan[];
    }

    export interface IVerifyIfEmployeeCanDoLoanRequest{
        employeeId: string;
    }

    export interface IVerifyIfEmployeeCanDoLoanResponse{
        message: string;
        data: {
            canDoLoan: boolean;
        };
    }
    export interface IAppParams{
        appLoanerAccount: string;
        appPercentage: number;
    }

    export interface IRepayMultipleLoansRequest {
        loanIds: string[];
        repayAccount: string;
        companyId: string;
      }
      export interface IGetActivitiesResponse{
        message:string;
        data:IActivity[];
      }

    // Déclarations des fonctions pour l'API
    interface Api {
        loginCompany(request: ILoginCompanyRequest): Promise<ILoginCompanyResponse>;
        registerCompany(request: IRegisterCompanyRequestBody): Promise<IRegisterCompanyResponse>;
        updateCompany(request: IUpdateCompanyRequest): Promise<IUpdateCompanyResponse>;
        deleteCompany(request: IDeleteEntityRequest): Promise<IDeleteEntityResponse>;
        getAllCompanies(): Promise<Array<ICompany>>;
        getAppParams():Promise<IAppParams | null>;
        logoutCompany()
        logoutEmployee()
        loginEmployee(request: ILoginEmployeeRequestBody): Promise<ILoginEmployeeResponse>;
        registerEmployee(request: IRegisterEmployeeRequest): Promise<IRegisterEmployeeResponse>;
        updateEmployee(request: IUpdateEmployeeRequest): Promise<IUpdateEmployeeResponse>;
        deleteEmployee(request: IDeleteEntityRequest): Promise<IDeleteEntityResponse>;
        getAllEmployees(request: IGetAllEmployeesRequest): Promise<IGetAllEmployeesResponse>;
        verifyEmployee(request: IVerifyEmployeeRequest): Promise<IVerifyEmployeeResponse>;
           // Prêts
        createLoan(data: ICreateLoanRequest): Promise<ICreateLoanResponse>;
        repayLoan(data: IRepayLoanRequest): Promise<IRepayLoanResponse>;
        rePayAllLoanOfCompany(companyId: string, repayAccount:string): Promise<{message: string, data:{modifiedCount:number}}> 
        repayMultiple(data: IRepayMultipleLoansRequest): Promise<{message:string, data:{refunded:boolean}}>;

        getAllCompanyLoans(data: IGetAllCompanyLoansRequest): Promise<IGetAllCompanyLoansResponse>;
        updateLoanParameters(data: IUpdateLoanParametersRequest): Promise<IUpdateLoanParametersResponse>;
        verifyIfEmployeeCanDoLoan(data: IVerifyIfEmployeeCanDoLoanRequest):Promise<IVerifyIfEmployeeCanDoLoanResponse>
        getAllLoansOfEmployee(data: IGetAllLoansOfEmployeeRequest):Promise<IGetAllLoansOfEmployeeResponse>;
        getLastedActivities(companyId: string, number?:number)
    }
}
