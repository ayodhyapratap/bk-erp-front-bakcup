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
