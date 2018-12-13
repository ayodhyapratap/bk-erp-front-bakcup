import {BACKEND_BASE_URL} from "../config/connect";

/***
 * API Connection URLs
 * */
 export const API_URL = BACKEND_BASE_URL + 'api';

export const SIGNUP_URL = '';
export const LOGIN_URL = 'users/login/';
export const PRACTICESTAFF='clinics/%s/practice_staff/';
export const ALL_PRACTICE= 'clinics/';
export const PRACTICE= 'clinics/%s/';
export const TAXES= 'clinics/%s/taxes/';
export const OFFERS= 'clinics/%s/offers/';
export const PAYMENT_MODES= 'clinics/%s/payment_modes/';
export const PROCEDURE_CATEGORY= 'clinics/%s/procedure_category/';
export const EMR_DIAGNOSES= 'clinics/%s/diagnoses/';
export const EMR_COMPLAINTS= 'clinics/%s/complaints/';
export const EMR_OBSERVATIONS= 'clinics/%s/observations/';
export const EMR_TREATMENTNOTES= 'clinics/%s/treatmentnotes/';
export const EMR_INVESTIGATIONS= 'clinics/%s/investigations/';
export const EMR_FILETAGS= 'clinics/%s/filetags/';
export const ALL_PRACTICE_STAFF='staff/';
export const ALL_PRACTICE_DOCTORS='doctor/';
export const PATIENTS_LIST = 'patients/'
export const PATIENT_PROFILE = 'patients/%s/'
export const STAFF_ROLES = 'staff/roles/'
export const MEDICAL_HISTORY = 'patients/history/?id=%s'
export const EXPENSE_TYPE= 'clinics/%s/expense_type/';
export const DRUG_CATALOG= 'clinics/%s/drugcatalog/';
export const LABTEST_API= 'clinics/%s/labtest/';
export const COMMUNICATONS_API= 'clinics/%s/communications/';
export const CALENDER_SETTINGS= 'clinics/%s/calender_settings/';
export const All_APPOINTMENT_API= 'appointment/';
export const APPOINTMENT_API= 'appointment/%s';
