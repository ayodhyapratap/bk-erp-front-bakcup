import {
    APPOINTMENT_FOR_EACH_CATEGORY,
    CANCELLATION_NUMBERS,
    AVERAGE_WAITING_ENGAGED_TIME_DAY_WISE,
    AVERAGE_WAITING_ENGAGED_TIME_MONTH_WISE,
    REASONS_FOR_CANCELLATIONS,
    DAILY_APPOINTMENT_COUNT,
    APPOINTMENT_FOR_EACH_DOCTOR,
    MONTHLY_APPOINTMENT_COUNT,
    APPOINTMENT_FOR_EACH_PATIENT_GROUP,
    NEW_PATIENTS,
    DAILY_NEW_PATIENTS,
    PATIENTS_FIRST_APPOINTMENT,
    MONTHLY_NEW_PATIENTS,
    NEW_MEMBERSHIP,
    EXPIRING_MEMBERSHIP,
    AGEING_AMOUNT_DUE,
    AMOUNT_DUE_PER_DOCTOR,
    AMOUNT_DUE_PER_PROCEDURE,
    UNSETTLED_INVOICE,
    DAILY_TREATMENT_COUNT,
    TREATMENTS_FOR_EACH_DOCTOR,
    MONTHLY_TREATMENT_COUNT,
    TREATMENT_FOR_EACH_CATEGORY,
    DAILY_EXPENSES,
    MONTHLY_EXPENSES,
    EXPENSES_EACH_TYPE,
    DAILY_INVENTORY,
    MONTHLY_INVENTORY,
    TOP_INVENTORY,
    DAILY_BOOKING_COUNT,
    MONTHLY_BOOKING_COUNT,
    MEDICINE_USAGE_COUNT,
    BED_BOOKING_PACKAGE_COUNT,
    MARGIN_TYPE_WISE,
    PRODUCT_WISE,
    TRANSFERED_AMOUNT,
    WALLET_BALANCE_AMOUNT,
    CREDIT_AMOUNT_PER_DOCTOR,
    PAYMENT_REFUND,
    PATIENTS_UNSETTLED_ADVANCE,
    PAYMENT_RECEIVED_PATIENT_GROUP,
    MODE_OF_PAYMENTS,
    PAYMENT_RECEIVED_PER_DAY,
    PAYMENT_RECEIVED_PER_DOCTOR,
    PAYMENT_RECEIVED_PER_MONTH, PAYMENT_SETTLEMENT, PAYMENT_SETTLEMENT_PER_DOCTOR, CREDIT_NOTES
} from "../constants/dataKeys";


export const PAYMENT_TYPES = [
    {label: 'cash', value: 'cash'},
    {label: 'cheque', value: 'cheque'},
    {label: 'card', value: 'card'},
    {label: 'netbanking', value: 'netbanking'},
    {label: 'unknown', value: 'unknown'},
]
export const DISEASE_TYPES = [
    {label: 'Kidney Disease', value: 'Kidney Disease'},
    {label: 'Cancer Disease', value: 'Cancer Disease'},
    {label: 'Other Disease', value: 'Other Disease'}
];
export const DRUG = "Medicine";
export const EQUIPMENT = "Equipment";
export const SUPPLIES = "Supplies";
export const PROCEDURES = "Procedure";
export const PRESCRIPTIONS = "Prescriptions";
export const INVENTORY = "Inventory";


export const INVOICE_ITEM_TYPE = [
    {label: PROCEDURES, value: PROCEDURES},
    {label: PRESCRIPTIONS, value: PRESCRIPTIONS},
    {label: INVENTORY, value: INVENTORY}
];
export const INVENTORY_ITEM_TYPE = [
    {label: DRUG, value: DRUG},
    {label: EQUIPMENT, value: EQUIPMENT},
    {label: SUPPLIES, value: SUPPLIES}
];


export const ADD_STOCK = "ADD";
export const CONSUME_STOCK = "CONSUME";

export const APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS = [{
    label: "CLINIC CONTACT",
    value: "{{CLINICCONTACTNUMBER}}"
}, {
    label: "CLINIC NAME",
    value: "{{CLINIC}}"
}, {
    label: "PATIENT NAME",
    value: "{{PATIENT}}"
}, {
    label: "APPOINTMENT CATEGORY",
    value: "{{CATEGORY}}"
},{
    label:"DATE",
    value:"{{DATE}}"
},{
    label:"TIME",
    value:"{{TIME}}"
}];

export const EMR_TYPE = "EMR";
export const BILLING_TYPE = "BILLING";

export const EMR_SUB_TYPE = [
    {title: 'PRESCRIPTION'},
    {title: 'TREATMENT PLAN'},
    {title: 'CASE SHEET'},
    {title: 'MEDICAL LEAVE'},
    {title: 'REPORT MANUAL'},
    {title: 'LAB ORDER'},
    // {title: 'LAB ORDER RESULT'},
    {title: 'CLINICAL NOTES'}
];
export const BILLING_SUB_TYPE = [
    {title: 'INVOICE'},
    {title: 'RECEIPTS'},
    {title: 'RETURN'}
];

export const CUSTOMIZE_PAPER_TYPE = [
    'PAGE', 'HEADER', 'PATIENT', 'FOOTER'
];

export const PAPER_SIZE = ['A2', 'A3', 'A4', 'A5'];

export const PAGE_ORIENTATION = [
    {value: 'PORTRAIT'},
    {value: 'LANDSCAPE'}
];

export const PRINTER_TYPE = [
    {value: 'COLOR'},
    {value: 'BLACK'}
];
export const HEADER_INCLUDE = [
    {title: 'Yes', value: true},
    {title: 'No , I already have a letter head.', value: false}
];
export const LOGO_TYPE = [
    {value: 'Square'},
    {value: 'Narrow'},
    {value: 'Wide'}
];
export const LOGO_ALIGMENT = [
    {value: 'RIGHT'},
    {value: 'LEFT'},
    {value: 'CENTRE'}
];
export const LOGO_INCLUDE = [
    {title: 'Yes', value: true},
    {title: 'No', value: false}
];
export const PATIENT_DETAILS_LIST = [
    {value: 'Exclude Mediacal History'},
    {value: 'Exclude Patient Number'},
    {value: 'Exclude address'},
    {value: 'Exclude Blood Group'}
];
export const EXCLUDE_PATIENT_DOB = "Exclude Patient Gender & DOB";

export const SMS_ENABLE = [
    {title: 'Yes', value: true},
    {title: 'No', value: false}
]

export const EMAIL_ENABLE = [
    {title: 'Yes', value: true},
    {title: 'No', value: false}
]

export const BIRTHDAY_SMS_ENABLE = [
    {title: 'Yes', value: true},
    {title: 'No', value: false}
]

export const DURATIONS_UNIT = [
    {label: 'day(s)', value: 'day(s)'},
    {label: 'week(s)', value: 'week(s)'},
    {label: 'month(s)', value: 'month(s)'},
    {label: 'year(s)', value: 'year(s)'},
];

export const DOSE_FREQUENCIES = [
    {label: 'day(s)', value: 'day(s)'},
];

export const DOSE_REQUIRED = [
    {label: 'twice daily', value: 'twice daily'},
    {label: 'three times a day', value: 'three times a day'},
    {label: 'four times a day', value: 'four times a day'},
    {label: 'every four hours', value: 'every four hours'},
    {label: 'as needed', value: 'as needed'},
    {label: 'every 2 hour(s)', value: 'every 2 hour(s)'},
    {label: 'every other hour', value: 'every other hour'},
    {label: 'every day', value: 'every day'},
    {label: 'every other day', value: 'every other day'},
];

export const SCHEDULE_STATUS = 'Scheduled';
export const WAITING_STATUS = 'Waiting';
export const ENGAGED_STATUS = 'Engaged';
export const CHECKOUT_STATUS = 'CheckOut';
export const CANCELLED_STATUS = 'Cancelled';

export const TYPE_OF_CONSUMPTION = [
    {label: "Sales", value: "SALES"},
    {label: "Services", value: "SERVICES"},
    {label: "Damaged", value: "DAMAGED"},
    {label: "Returned", value: "RETURNED"},
    {label: "Adjustment", value: "ADJUSTMENT"},
];

export const TYPES_OF_BED_PACKAGES_ROOM_TYPE = [
    {label: "Private", value: "PRIVATE"},
    {label: "Dormitory", value: "DORMITORY"},
    {label: "Semi Private", value: "SEMI PRIVATE"},
]

export const CUSTOM_STRING_SEPERATOR = '$_$';

export const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const NOTES =[
    {label:"Valid for absence from court attendance", value: "valid_court"},
    {label:"Invalid for absence from court attendance", value: "invalid_court"},
    {label:"Dont mention", value: "no_mention"}
];

export const DEFAULT_TEMPERATURE_IN=[
    {label:"Degree Fahrenheit" ,value:"Degree Fahrenheit"},
    {label:"Degree Celsius" , value:"Degree Celsius"}
];
export const DEFAULT_TEMPERATURE_METHOD=[
    {label:"Armpit", value:"Armpit"},
    {label:"Forehead", value:"Forehead"},
    {label:"Anus", value:"Anus"},
    {label:"Mouth", value:"Mouth"},
    {label:"Ear" , value:"Ear"}
];
export const DEFAULT_BP_METHOD=[
    {label:"Sitting",value:"Sitting"},
    {label:"Standing" ,value:"Standing"}
];

export const APPOINTMENT_STATUS =[
    {label:"Scheduled",value:SCHEDULE_STATUS},
    {label:"Cancelled",value:CANCELLED_STATUS},
    {label:"Engaged",value:ENGAGED_STATUS}
];
export const MAILED ='true';

export const Booking_Type = [
    {value: 'TATKAL'},
    {value: 'NORMAL'}
];
export const PAYMENT_STATUS = [
    {label:"Success", value:"SUCCESSFUL"},
    {label:"Failed" ,value:"FAILED"},
    {label:"Pending",value:"PENDING"}
];
export const OPD_IPD =[
    {label:"OPD", value:"OPD"},
    {label:"IPD",value:"IPD"}
];

export const ROLES = [
    {label:"ADMIN" ,value:'1'},
    {label:"CLINIC_ADMIN" ,value:'2'}
];
/*Patient Reports*/
export const PATIENTS_RELATED_REPORT= [
    {name: 'Daily New Patients', value: DAILY_NEW_PATIENTS},
    {name: 'Expiring Membership', value: EXPIRING_MEMBERSHIP},
    {name: 'Patients First Appointment', value: PATIENTS_FIRST_APPOINTMENT},
    {name: 'Monthly New Patients', value: MONTHLY_NEW_PATIENTS},
    {name: 'New Membership', value: NEW_MEMBERSHIP},
];

/*Appointment Reports*/
export const APPOINTMENT_RELATED_REPORT = [
    {name: 'Appointments For Each Category', value: APPOINTMENT_FOR_EACH_CATEGORY},
    {name: 'Cancellation Numbers', value: CANCELLATION_NUMBERS},
    {name: 'Average Waiting/engaged Time Day Wise', value: AVERAGE_WAITING_ENGAGED_TIME_DAY_WISE},
    {name: 'Average Waiting/engaged Time Month Wise', value: AVERAGE_WAITING_ENGAGED_TIME_MONTH_WISE},
    // {name: 'Reasons For Cancellations', value: REASONS_FOR_CANCELLATIONS},
    {name: 'Daily Appointment Count', value: DAILY_APPOINTMENT_COUNT},
    {name: 'Appointments For Each Doctor', value: APPOINTMENT_FOR_EACH_DOCTOR},
    {name: 'Monthly Appointment Count', value: MONTHLY_APPOINTMENT_COUNT},
    {name: 'Appointment For Each Patient Group', value: APPOINTMENT_FOR_EACH_PATIENT_GROUP}];

/*Emr Reports*/
export  const EMR_RELATED_REPORT=[
    {name: 'Daily Treatments Count', value: DAILY_TREATMENT_COUNT},
    {name: 'Treatments For Each Doctor', value: TREATMENTS_FOR_EACH_DOCTOR},
    {name: 'Monthly Treatments Count', value: MONTHLY_TREATMENT_COUNT},
    {name: 'Treatments For Each Category', value: TREATMENT_FOR_EACH_CATEGORY}
    ];

/*Amount Due Reports*/
export const  AMOUNT_DUE_RELATED_REPORT=[
    {name:'Ageing Amount Due' ,value:AGEING_AMOUNT_DUE},
    {name:'Amount Due Per Doctor', value:AMOUNT_DUE_PER_DOCTOR},
    {name:'Amount Due Per Procedure' ,value:AMOUNT_DUE_PER_PROCEDURE},
    {name:'Unsettled Invoice',value:UNSETTLED_INVOICE},
];

export const BLOOD_GROUPS=[
    {name:"A+", value:'A+'},
    {name:"A-", value:'A-'},
    {name: "B+", value:'B+'},
    {name:"B-", value:'B-'},
    {name:"AB+", value:'AB+'},
    {name:"AB-", value:'AB-'},
    {name:"O+" ,value:'O+'},
    {name:"O-" ,value:'O-'},
];

/*** Expense Reports ***/
export const EXPENSE_RELATED_REPORT=[
    {name:'Daily Expenses' ,value:DAILY_EXPENSES},
    {name:'Expenses For Each Type' , value: EXPENSES_EACH_TYPE},
    {name:'Monthly Expenses' ,value:MONTHLY_EXPENSES}];

/***Inventory Reports **/
export const INVENTORY_RELATED_REPORT = [
    {name:'Daily Stock Consumption Item Wise',value:DAILY_INVENTORY},
    {name: 'Monthly Stock Consumption Item Wise', value:MONTHLY_INVENTORY},
    {name:'Top 10 Consumed Items',value:TOP_INVENTORY}
];
export const PRODUCT_ITEM=[
    {label:'All' ,value:'ALL'},
    {label: DRUG, value: DRUG},
    {label: EQUIPMENT, value: EQUIPMENT},
    {label: SUPPLIES, value: SUPPLIES},
];
/*Bed Booking Reports*/
export const BED_BOOKING_RELATED_REPORT=[
    {name:'Daily Booking Count',value:DAILY_BOOKING_COUNT},
    {name:'Monthly Booking Count',value: MONTHLY_BOOKING_COUNT},
    {name:'Medicine Usage Count',value:MEDICINE_USAGE_COUNT},
    {name:'Bed Booking Package Count',value:BED_BOOKING_PACKAGE_COUNT},
];
/*MLM reports*/
export const MLM_RELATED_REPORT=[
    {name:'Margin Type wise', value:MARGIN_TYPE_WISE},
    // {name:'Product Wise', value:PRODUCT_WISE},
    {name:'Wallet Balance Amount', value:WALLET_BALANCE_AMOUNT},
];

/*Payments Reports*/
export const PAYMENT_RELATED_REPORT = [
    {name: 'Refund Payments', value:PAYMENT_REFUND},
    {name: 'Payment Received From Each Patient Group', value:PATIENTS_UNSETTLED_ADVANCE},
    {name: 'Patients With Unsettled Advance, As Of Today', value: PAYMENT_RECEIVED_PATIENT_GROUP},
    {name: 'Modes Of Payment', value:MODE_OF_PAYMENTS},
    {name: 'Payment Received Per Day', value:PAYMENT_RECEIVED_PER_DAY},
    {name: 'Payment Received Per Doctor', value: PAYMENT_RECEIVED_PER_DOCTOR},
    {name: 'Payment Received Per Month', value: PAYMENT_RECEIVED_PER_MONTH},
    {name: 'Payment Settlement', value: PAYMENT_SETTLEMENT},
    {name: 'Payment Settlement Per Doctor', value: PAYMENT_SETTLEMENT_PER_DOCTOR},
    {name: 'Credit Notes', value: CREDIT_NOTES},
    {name: 'Credit Amount Per Doctor', value:CREDIT_AMOUNT_PER_DOCTOR},
];

export const SCHEDULE_OF_PAYMENT = [
    {label: "all payments", value: "SALES"},
    {label: "Only advance payments", value: "SERVICES"},
    {label: "Payment for services", value: "DAMAGED"},
    {label: "Payment for products", value: "RETURNED"},
];

export const PATIENT_AGE = [
    {label:'DOB' ,value:'DOB'},
    {label:'Age' ,value: 'AGE'}
];

/** Suggestions Reports***/
export const SUGGESTIONS_STATUS=[
    {label:"Open",value:"Open"},
    {label:"In Progress" ,value:"InProgress"},
    {label: "Closed" ,value: "Closed"},
];

export const SOURCE_PLATFORM=[
    {label:'Facebook' ,value:'FACEBOOK'},
    {label: "News Paper" ,value: "NEWS_PAPER"},
    {label: "TV" ,value: "TV"},
    {label:'Street Banners' ,value:"STREET"},
];