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
export const DRUG = "Drug";
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
}];

export const APPOINTMENT_CANCELATION_SMS_TAG_OPTIONS = [{
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
}];
export const EMR_TYPE = "EMR";
export const BILLING_TYPE= "BILLING";

export const EMR_SUB_TYPE = [
  { title: 'PRESCRIPTION'},
  { title: 'TREATMENT PLAN'},
  { title: 'CASE SHEET' },
  { title: 'MEDICAL LEAVE'},
  { title: 'VITAL SIGNS' },
  { title: 'LAB ORDER'},
  { title: 'LAB ORDER RESULT'},
];
export const BILLING_SUB_TYPE =[
    { title:'INVOICE' },
    { title:'RECEIPTS'},
   ];

export const CUSTOMIZE_PAPER_TYPE=[
    'PAGE', 'HEADER', 'PATIENT', 'FOOTER'
];

export const PAPER_SIZE = ['A2','A3','A4','A5'];