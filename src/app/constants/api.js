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
export const APPOINTMENT_CATEGORIES= 'clinics/%s/appointment_category/';
export const ALL_PRACTICE_STAFF='staff/';
export const SINGLE_PRACTICE_STAFF_API='staff/%s/';

export const PATIENTS_LIST = 'patients/'
export const PATIENT_PROFILE = 'patients/%s/'
export const STAFF_ROLES = 'staff/roles/'
export const MEDICAL_HISTORY = 'patients/history/?id=%s'
export const EXPENSE_TYPE= 'clinics/%s/expense_type/';
export const DRUG_CATALOG= 'clinics/%s/drugcatalog/';
export const LABTEST_API= 'clinics/%s/labtest/';
export const COMMUNICATONS_API= 'clinics/%s/communications/';
export const CALENDER_SETTINGS= 'clinics/%s/calender_settings/';
export const ALL_APPOINTMENT_API= 'appointment/';
export const APPOINTMENT_API= 'appointment/%s/';
export const APPOINTMENT_PERPRACTICE_API= 'appointment/?id=%s';
export const PATIENT_GROUPS = 'patients/group/?id=%s';
export const VITAL_SIGNS_API='patients/vital_sign/?id=%s';
export const PRESCRIPTIONS_API='patients/prescriptions/?id=%s';
export const TREATMENTPLANS_API='patients/procedure/?id=%s';
export const ALL_PRESCRIPTIONS_API='patients/prescriptions/%s/';
export const INVOICES_API='patients/invoices/?id=%s';
export const PATIENT_CLINIC_NOTES_API='patients/clinic_notes/?id=%s'
export const PATIENT_PAYMENTS_API='patients/payment/?id=%s'

//search and advanced search API
export const SEARCH_PATIENT='patients/search/?name=%s';


//extra data
export const EXTRA_DATA = 'clinics/extra_data';

//reports

export const APPOINTMENT_REPORTS = 'clinics/%s/appointment_report/?%s'
export const EXPENSE_REPORT = 'clinics/%s/expense_report/?%s'
export const INVOICE_REPORTS = 'clinics/%s/invoice_report/?%s'
export const PATIENTS_REPORTS = 'clinics/%s/patients_report/?%s'
export const PAYMENTS_REPORTS = 'clinics/%s/payments_report/?%s'
export const TREATMENT_REPORTS = 'clinics/%s/treatment_report/?%s'

//blogs APT


export const  BLOG_POST = 'post/';
export const  SINGLE_POST = 'post/%s/';
export const  BLOG_VIDEOS = 'video/';
export const  SINGLE_VIDEO = 'video/%s/';
export const  BLOG_DISEASE = 'disease/';
export const  SINGLE_DISEASE = 'disease/%s/';
export const  BLOG_EVENTS = 'events/';
export const  SINGLE_EVENTS = 'events/%s/';
export const  BLOG_CONTACTUS = 'contactus/';
export const  SINGLE_CONTACT = 'contactus/%s/';
export const  BLOG_PAGE_SEO = 'page_seo/';
export const  SINGLE_PAGE_SEO = 'page_seo/%s/';
export const  BLOG_SLIDER = 'slider/';
export const  SINGLE_SLIDER = 'slider/%s/';
export const  BLOG_FACILITY = 'facility/';
export const  SINGLE_FACILITY = 'facility/%s/';
export const  LANDING_PAGE_CONTENT = 'landing_page_content/';
export const  SINGLE_LANDING_PAGE_CONTENT = 'landing_page_content/%s/';
export const  LANDING_PAGE_VIDEO = 'landing_page_video/';
export const  SINGLE_LANDING_PAGE_VIDEO = 'landing_page_video/%s/';
