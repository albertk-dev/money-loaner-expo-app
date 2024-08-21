declare module rhf{
    interface ValidationRules {
    required?: boolean | string;
    minLength?: {
      value: number;
      message: string;
    };
    maxLength?: {
      value: number;
      message: string;
    };
    pattern?: {
      value: RegExp;
      message: string;
    };
    validate?: (value: any) => boolean | string | Promise<boolean | string>;
    // Ajoutez d'autres règles au besoin
  }
  
}


