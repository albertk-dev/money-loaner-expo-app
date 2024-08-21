type ValidOperator = 'mtn' | 'orange' | 'camtel' | 'nextel' | 'unknown'

type OperatorList = {
    [key in ValidOperator]: string[]
}


export function getOperator(phoneNumber: string): ValidOperator {
    // Remove non-numeric characters and the country code +237 if present
    const cleanedNumber = phoneNumber.replace(/\D/g, '').replace(/^237/, '');

    const operators: OperatorList = {
        mtn: ['670', '671', '672', '673', '674', '675', '676', '677', '678', '679'],
        orange: ['690', '691', '692', '693', '694', '695', '696', '697', '698', '699'],
        camtel: ['222', '233', '242', '243', '244', '245', '246'],
        nextel: ['680', '681', '682', '683', '684', '685', '686', '687', '688', '689'],
        unknown: []
    };

    for (const operator in operators) {
        if (operators[operator as ValidOperator].some(prefix => cleanedNumber.startsWith(prefix))) {
            return operator as ValidOperator;
        }
    }

    return 'unknown';
}