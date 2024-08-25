import AsyncStorage from "@react-native-async-storage/async-storage";
import { Api, IApiAuthHeaders, IAppParams, ICommonHeaders, ICompany, ICreateLoanRequest, ICreateLoanResponse, IDeleteEntityRequest, IDeleteEntityResponse, IEmployee, IFullEmployee, IGetActivitiesResponse, IGetAllCompanyLoansRequest, IGetAllCompanyLoansResponse, IGetAllEmployeesRequest, IGetAllEmployeesResponse, IGetAllLoansOfEmployeeRequest, IGetAllLoansOfEmployeeResponse, ILoan, ILoginCompanyRequestBody, ILoginCompanyResponse, ILoginEmployeeRequestBody, ILoginEmployeeResponse, IRefreshTokenResponse, IRegisterCompanyRequestBody, IRegisterCompanyResponse, IRegisterEmployeeRequestBody, IRegisterEmployeeResponse, IRepayLoanRequest, IRepayLoanResponse, IRepayMultipleLoansRequest, IUpdateCompanyRequest, IUpdateCompanyResponse, IUpdateEmployeeRequest, IUpdateEmployeeResponse, IUpdateLoanParametersRequest, IUpdateLoanParametersResponse, IVerifyEmployeeRequest, IVerifyEmployeeResponse, IVerifyIfEmployeeCanDoLoanRequest, IVerifyIfEmployeeCanDoLoanResponse } from "money-loaner-api-types";
import { baseURL } from "./url";

export type FetchMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

class MoneyLoanerAPI implements Api{
    
    private static _instance: boolean = false;

    private commonHeader: ICommonHeaders = {
        "Content-Type": "application/json"
    }

    private _xsrfToken: string = ''
  

    private authHeader: IApiAuthHeaders = {
        "x-xsrf-token": this._xsrfToken,
        ...this.commonHeader
    }

    private async getAuthHeaderData() {
        const xrsfToken = await AsyncStorage.getItem('xsrfToken') || this.xsrfToken;
        const authHeader:  IApiAuthHeaders = {
            "x-xsrf-token": xrsfToken,
            "Content-Type": "application/json"
        }
        return authHeader
    } 

readonly  _baseURL:string;

    public refreshTokenInterval: number;
    private _connectedEntity: ICompany | IFullEmployee | null = null
    private _connectedEntityType: 'employee' | 'company' | null = null

    private _companyRoute:string;
    private _employeeRoute:string;
    private _companyLoginRoute :string;
    private _employeeLoginRoute :string;
    private _companyLogoutRoute:string;
    private _employeeLogoutRoute:string;
    private _refreshTokenRoute: string;
    private refreshTokenTimeoutId: NodeJS.Timeout | null;
    private _appSettingsRoute: string;

    private _appParams: IAppParams | null;

    constructor(baseUrl: string) {
        console.log("ML_Constructor");
        
        this._baseURL = baseUrl;
        this.refreshTokenInterval = 5 * 60 * 1000; // 15 minutes en millisecondes
        if (MoneyLoanerAPI._instance) {
            throw new Error("Instance d'API déjà en cours d'utilisation");
        } else {
            this._companyRoute = `${this._baseURL}/companies`;
            this._employeeRoute = `${this._baseURL}/employees`;
            this._companyLoginRoute = `${this._companyRoute}/login`;
            this._employeeLoginRoute = `${this._employeeRoute}/login`;
            this._companyLogoutRoute = `${this._companyRoute}/logout`;
            this._employeeLogoutRoute = `${this._employeeRoute}/logout`;
            this._refreshTokenRoute = `${this._baseURL}/refresh-token`;
            this._appSettingsRoute = `${this._baseURL}/settings`
            this.refreshTokenTimeoutId = null;
            this._appParams = {
                appLoanerAccount: "679770464",
                appPercentage: 10
            }

            this.getAppParams()
            
        };
    }


     // Méthode pour initialiser le rafraîchissement du token
  public async initializeTokenRefresh(): Promise<void> {
    if (this._xsrfToken) {
    const refreshTokenSucceful = await  this.refreshToken(); // Exécuter immédiatement si le token est déjà présent
        if (!refreshTokenSucceful) {
            throw new Error("refresh token failed, please reconnect user")
        }
     this.refreshTokenTimeoutId = setInterval(() => {
        this.refreshToken();
      }, this.refreshTokenInterval);
    }
    }

    
  // Méthode pour arrêter le rafraîchissement du token
  public stopTokenRefresh(): void {
    if (this.refreshTokenTimeoutId) {
      clearInterval(this.refreshTokenTimeoutId);
      this.refreshTokenTimeoutId = null;
    }
  }
    
    set xsrfToken(value:string) {
        this._xsrfToken = value;
    }
    get xsrfToken() {
        return this._xsrfToken
    }

    get currentUser() {
        if(this._connectedEntity){
            return this._connectedEntity
        } else {
            return null
        }
    }

    get appParams(){
        return this._appParams
    }

    get currentUserType() {
        if(this._connectedEntityType){
            return this._connectedEntityType
        } else {
            return null
        }
    }
  
  
    private  async doNormalRequest(url: string, data?: any,method:FetchMethod = "GET"):Promise<any> {
        
        const response = await fetch(url, {
            credentials: 'include',
            headers: { ...this.commonHeader },
            body: JSON.stringify(data),
            method
        })
       return response
    }
    private  async doAuthRequest(url: string, data?: any,method:FetchMethod = "GET"):Promise<any> {
      const xrsfToken =  await AsyncStorage.getItem('xsrfToken');
        const response = await fetch(url, {
            credentials: 'include',
            headers: { ...this.authHeader, 'x-xsrf-token': xrsfToken as string},
            body: JSON.stringify(data),
            method
        })
       return response
    }
        
    async getAppParams(): Promise<IAppParams | null>{
        try {
            console.log("gettings params ...", this._appSettingsRoute)
            const res: Response = await this.doNormalRequest(this._appSettingsRoute,undefined,"GET")
            if (res.ok) {
                const json: IAppParams = await res.json();
                console.log("app params json", json)
                this._appParams = json;
                return json
            } else {
                console.log("res no get", res)
                const json: { message: string; error: { name: string; message: string } } = await res.json();
                return this._appParams;
            }

        } catch (error:any) {
            console.log(error.message || error)
            throw new Error(error.message || error)
    }
}
    
    async getAllCompanies(): Promise<ICompany[]> {
        try {
            const res: Response = await this.doNormalRequest(this._companyRoute)
            if (res.ok) {
                const json: { message: string; data:Array<ICompany>} = await res.json();
                return json.data
            } else {
                const json: { message: string; error: { name: string; message: string } } = await res.json();
                throw new Error(json.error.message || json.message)
            }

        } catch (error:any) {
            throw new Error(error.message || error)
        }
        
    }

   async  registerCompany(data: IRegisterCompanyRequestBody): Promise<IRegisterCompanyResponse > {

       try {
           await this.logoutCompany();
         const res: Response = await this.doNormalRequest(this._companyRoute, data, "POST");
       if (res.ok) {
        const json: IRegisterCompanyResponse = await res.json();
        return json
    } else {
        const json: { message: string; error: { name: string; message: string } } = await res.json();
        throw new Error(json.error.message || json.message)
    }
       } catch (error:any) {
        throw new Error(error.message || error)
       }
       
      
       
    }


    async loginCompany(data: ILoginCompanyRequestBody): Promise<ILoginCompanyResponse> {

        try {
            await this.logoutCompany()
            const response: Response = await this.doNormalRequest(this._companyLoginRoute, data, "POST");
            if (response.ok) {
                const json: ILoginCompanyResponse = await response.json();
                this._xsrfToken = json.xsrfToken
                await AsyncStorage.setItem('xsrfToken', json.xsrfToken);
                this.initializeTokenRefresh()
                return json
            } else {
                const json: { message: string; error: { name: string; message: string } } = await response.json();
                throw new Error(json.error.message || json.message)
                
            }
        } catch (error:any) {
            throw new Error(error?.message || error)
        }

        
      
   };
   
   async updateCompany(request: IUpdateCompanyRequest): Promise<IUpdateCompanyResponse> {
       const url = `${this._companyRoute}/${request.id}`
       
       try {
        const response: Response = await this.doAuthRequest(url, request.updateData,"PUT");
        if (response.ok) {
            const json: IUpdateCompanyResponse = await response.json();
            return json
        } else {
            const json: { message: string; error: { name: string; message: string } } = await response.json();
            throw new Error(json.error.message || json.message)
            
        }
    } catch (error:any) {
        throw new Error(error?.message || error)
    }
    };

    async deleteCompany(request: IDeleteEntityRequest): Promise<IDeleteEntityResponse> {
        const url = `${this._companyRoute}/${request.id}`;
        return await this.doAuthRequest(url,{},"DELETE")
    };
    
    async logoutCompany() {
       await this.doAuthRequest(this._companyLogoutRoute,{},"POST")
        AsyncStorage.removeItem('xsrfToken');
        this._xsrfToken = ""
        this.stopTokenRefresh()
    }

    async loginEmployee(data: ILoginEmployeeRequestBody): Promise<ILoginEmployeeResponse>{
        
        try {
            const response: Response = await this.doNormalRequest(this._employeeLoginRoute, data, "POST");
            if (response.ok) {
                const json: ILoginEmployeeResponse = await response.json();
                this._xsrfToken = json.xsrfToken
                await AsyncStorage.setItem('xsrfToken', json.xsrfToken);
                this.initializeTokenRefresh()
                return json
            } else {
                const json: { message: string; error: { name: string; message: string } } = await response.json();
                throw new Error(json.error.message || json.message)
                
            }
        } catch (error:any) {
            throw new Error(error?.message || error)
        }
    };

    async logoutEmployee() {
       await this.doAuthRequest(this._employeeLogoutRoute,{},"POST")
        AsyncStorage.removeItem('xsrfToken');
        this._xsrfToken = ""
        this.stopTokenRefresh()
    }
    
    async registerEmployee(employee: IRegisterEmployeeRequestBody): Promise<IRegisterEmployeeResponse>{

        try {
            const response: Response = await this.doAuthRequest(this._employeeRoute,employee,"POST");
            if (response.ok) {
                const json: IRegisterEmployeeResponse = await response.json();
                return json
            } else {
                const json: { message: string; error: { name: string; message: string } } = await response.json();
                throw new Error(json.error.message || json.message)
                
            }
        } catch (error:any) {
            throw new Error(error?.message || error)
        }
   
    };
    async updateEmployee(request: IUpdateEmployeeRequest): Promise<IUpdateEmployeeResponse> {
        const url = `${this._employeeRoute}/${request.id}`
        try {
            const response: Response = await this.doAuthRequest(url,request.data,"PUT");
            if (response.ok) {
                const json: IUpdateEmployeeResponse = await response.json();
                return json
            } else {
                const json: { message: string; error: { name: string; message: string } } = await response.json();
                throw new Error(json.error.message || json.message)
                
            }
        } catch (error:any) {
            throw new Error(error?.message || error)
        }
    };
    
    async deleteEmployee(request: IDeleteEntityRequest): Promise<IDeleteEntityResponse>{
        const url = `${this._employeeRoute}/${request.id}`;
        return await this.doAuthRequest(url,{},"DELETE")
   };
   async getAllEmployees(request: IGetAllEmployeesRequest): Promise<IGetAllEmployeesResponse>{

    const url = `${this._employeeRoute}/${request.companyId}`;
    try {
        const response: Response = await this.doAuthRequest(url,undefined,"GET");
        if (response.ok) {
            const json: IGetAllEmployeesResponse = await response.json();
            return json
        } else {
            const json: { message: string; error: { name: string; message: string } } = await response.json();
            throw new Error(json.error.message || json.message)
            
        }
    } catch (error:any) {
        throw new Error(error?.message || error)
    }
    };
    async verifyEmployee(request: IVerifyEmployeeRequest): Promise<IVerifyEmployeeResponse>{
       

        const params = new URLSearchParams({ inCompanyId: request.inCompanyId })
       const url = `${this._employeeRoute}/search/${request.companyId}?${params}`
        
        try {
            const response: Response = await this.doNormalRequest(url);
            if (response.ok) {
                const json: IVerifyEmployeeResponse = await response.json();
                return json
            } else {
                const json: { message: string; error: { name: string; message: string } } = await response.json();
                throw new Error(json.error.message || json.message)
                
            }
        } catch (error:any) {
            throw new Error(error?.message || error)
        }
    };

    public async refreshToken(): Promise<boolean>{
        try {
            const xsrfToken = await AsyncStorage.getItem('xsrfToken');
            if (!xsrfToken) {
                return false
            } else {
                this._xsrfToken = xsrfToken
            }
            const response: Response = await this.doAuthRequest(this._refreshTokenRoute, {}, "POST")

            if (response.ok) {
                const json : IRefreshTokenResponse = await response.json()
                this._xsrfToken = json.xsrfToken;
                this._connectedEntity = json.entity;
                this._connectedEntityType = json.entityType;
                await AsyncStorage.setItem('xsrfToken',json.xsrfToken);
            return true
            } else {
                 const json: { message: string; error: { name: string; message: string } } = await response.json();
                throw new Error(json.error.message || json.message)
            }
           
        } catch (error : any) {
            throw new Error(error)
         
       }
      

    };


    private async handleResponse<T>(response: Response): Promise<T> {
     
        if (!response.ok) {
            const json: { message: string; error: { name: string; message: string } } = await response.json();
            throw new Error(json.error.message || json.message || 'Failed to fetch data');
        }
        return  response.json();
    }

    public async createLoan(data: ICreateLoanRequest): Promise<ICreateLoanResponse> {
        try {
            const url = `${this._baseURL}/loan`;
            const response = await this.doAuthRequest(url, data, 'POST');
            return this.handleResponse<ICreateLoanResponse>(response);
        } catch (error) {
            console.error('Error creating loan:', error);
            throw error;
        }
    }

    public async repayLoan(data: IRepayLoanRequest): Promise<IRepayLoanResponse> {
        try {
            const url = `${this._baseURL}/loan/${data.loanId}/repay`;
            const response = await this.doAuthRequest(url, data, 'PATCH');
            return this.handleResponse<IRepayLoanResponse>(response);
        } catch (error) {
            console.error('Error repaying loan:', error);
            throw error;
        }
    }

    public async getAllCompanyLoans(data: IGetAllCompanyLoansRequest): Promise<IGetAllCompanyLoansResponse> {
        try {
            const url = `${this._baseURL}/loan/all/${data.companyId}`;
            const response = await this.doAuthRequest(url, undefined, 'GET');
            return this.handleResponse<IGetAllCompanyLoansResponse>(response);
        } catch (error) {
            console.error('Error fetching company loans:', error);
            throw error;
        }
    }

    public async rePayAllLoanOfCompany(companyId: string, repayAccount: string): Promise<{message: string, data:{modifiedCount:number}}> {
        try {
            const url = `${this._baseURL}/loan/company/${companyId}/repayAll`;
            const response = await this.doAuthRequest(url, {repayAccount}, 'PATCH');
            return this.handleResponse<{message: string, data:{modifiedCount:number}}>(response);
        } catch (error) {
            console.error('Error repaying all loans of company:', error);
            throw error;
        }
    }

   public async repayMultiple(data: IRepayMultipleLoansRequest): Promise<{ message: string; data: { refunded: boolean; }; }> {
    try {
        const url = `${this._baseURL}/loan/company/${data.companyId}/repayMultiple`;
        const response = await this.doAuthRequest(url, {loanIds: data.loanIds, repayAccount: data.repayAccount}, 'PATCH');
        return this.handleResponse<{ message: string; data: { refunded: boolean; }; }>(response);
    } catch (error) {
        console.error('Error repaying  loans:', error,data.loanIds);
        throw error;
    }
   }


    public async updateLoanParameters(data: IUpdateLoanParametersRequest): Promise<IUpdateLoanParametersResponse> {
        try {
            const url = `${this._companyRoute}/${data.companyId}/loanParameters`;
            const response = await this.doAuthRequest(url, data.loanParameters, 'PATCH');
            return this.handleResponse<IUpdateLoanParametersResponse>(response);
        } catch (error) {
            console.error('Error updating loanParameters:', error);
            throw error;
        }
    }
    public async verifyIfEmployeeCanDoLoan(data: IVerifyIfEmployeeCanDoLoanRequest): Promise<IVerifyIfEmployeeCanDoLoanResponse> {
        try {
            console.log("verification de l'employee")
            const url = `${this._baseURL}/loan/employee/${data.employeeId}/verify`;
            const response = await this.doAuthRequest(url, undefined, 'GET');
            return this.handleResponse<IVerifyIfEmployeeCanDoLoanResponse>(response);
        } catch (error) {
            console.error('Error verify employee:', error);
            throw error;
        }
    }

    public async getAllLoansOfEmployee(data: IGetAllLoansOfEmployeeRequest): Promise<IGetAllLoansOfEmployeeResponse> {
        try {
            
            const url = `${this._baseURL}/loan/employee/${data.employeeId}/loans`;
          
            const response = await this.doAuthRequest(url, undefined, 'GET');
            return this.handleResponse<IGetAllLoansOfEmployeeResponse>(response);
        } catch (error) {
            console.error('Error getting employee loan:', error);
            throw error;
        }
    }

    public async getLastedActivities(companyId: string, number: number = 10) {
        try{
            const url = `${this._companyRoute}/${companyId}/activities?number=${number}`;
            const response = await this.doAuthRequest(url, undefined, 'GET');
           
            return await response.json()
        } catch(error){
            console.log("connot get activities because : ", error)
            throw error
        }
    }
}


const ML_API = new MoneyLoanerAPI(baseURL)

export default ML_API