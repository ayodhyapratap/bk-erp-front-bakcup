import {BACKEND_BASE_URL} from "../config/connect";

/***
 * API Connection URLs
 * */
export const API_URL = BACKEND_BASE_URL + '/erp-api';
export const FILE_UPLOAD_API = 'blogImage/';

export const SIGNUP_URL = '';
export const RESET_PASSWORD = 'users/reset_password/';
export const CHANGE_PASSWORD = 'users/passwordchange/';
export const RESET_PASSWORD_MAIL = 'users/staff_reset_mail/';
export const LOGIN_URL = 'users/login/';
export const USER_DATA = 'users/user_clone/';
export const PRACTICESTAFF = 'clinics/%s/practice_staff/';
export const ENABLE_STAFF_IN_PRACTICE = 'staff/%s/practice_list/'
export const DOCTOR_VISIT_TIMING_API = 'clinics/%s/doctor_timing/';
export const USER_PRACTICE_PERMISSIONS = 'user_permissions/?staff=%s&practice=%s';
export const SET_USER_PERMISSION = 'user_permissions/';
export const SET_SPECIFIC_USER_PERMISSION = 'user_permissions/%s/';
export const ALL_PRACTICE = 'clinics/';
export const ALL_PERMISSIONS = 'users/all_permissions/';
export const PRACTICE = 'clinics/%s/';
export const PRACTICE_DELETE = 'clinics/%s/delete_clinic/';
export const TAXES = 'clinics/%s/taxes/';
export const OFFERS = 'clinics/%s/offers/';
export const PAYMENT_MODES = 'clinics/%s/payment_modes/';
export const PROCEDURE_CATEGORY = 'clinics/%s/procedure_category/';

export const EMR_DIAGNOSES = 'clinics/%s/diagnoses/';
export const EMR_COMPLAINTS = 'clinics/%s/complaints/';
export const EMR_OBSERVATIONS = 'clinics/%s/observations/';
export const EMR_TREATMENTNOTES = 'clinics/%s/treatmentnotes/';
export const EMR_INVESTIGATIONS = 'clinics/%s/investigations/';
export const EMR_FILETAGS = 'clinics/%s/filetags/';
export const EMR_VITAL_SIGNS ='clinics/%s/vital_sign/'
export const APPOINTMENT_CATEGORIES = 'clinics/%s/appointment_category/';
export const ALL_PRACTICE_STAFF = 'staff/';
export const SINGLE_PRACTICE_STAFF_API = 'staff/%s/';

export const PATIENTS_LIST = 'patients/';
export const PATIENT_PROFILE = 'patients/%s/';
export const MERGE_PATIENTS = 'patients/merge_patients/';
export const STAFF_ROLES = 'staff/roles/';
export const MEDICAL_HISTORY = 'patients/history/?id=%s'
// export const PATIENT_MEDICAL_HISTORY = 'patients/history/?id=%s';
export const PATIENT_FILES = 'patients/files/';
export const ALL_PATIENT_FILES = 'patients/files/';
export const EXPENSE_TYPE = 'clinics/%s/expense_type/';
export const DRUG_CATALOG = 'clinics/%s/drugcatalog/';
export const SINGLE_DRUG_CATALOG = 'clinics/%s/drugcatalog/?id=%s';
export const LABTEST_API = 'clinics/%s/labtest/';
export const COMMUNICATONS_API = 'clinics/%s/communications/';
export const EMAIL_COMMUNICATONS_API = 'clinics/%s/email_communications/';
export const CALENDER_SETTINGS = 'clinics/%s/calender_settings/';
export const ALL_APPOINTMENT_API = 'appointment/';
export const APPOINTMENT_API = 'appointment/%s/';
export const APPOINTMENT_PERPRACTICE_API = 'appointment/?id=%s';
export const SINGLE_APPOINTMENT_PERPRACTICE_API = 'appointment/?id=%s&patient=%s';
export const PATIENT_GROUPS = 'patients/group/?id=%s';
export const VITAL_SIGNS_API = 'patients/vital_sign/'; //?patient=patientId&practice=practiceId
export const PRESCRIPTIONS_API = 'patients/prescriptions/'; //?id=patientId&practice=practiceId
export const SINGLE_REATMENTPLANS_API = 'patients/procedure/?id=%s';
export const BLOCK_CALENDAR = 'appointment/block_calendar/';
export const ROOM_TYPE = 'clinics/room_types/';
export const PATIENT_NOTES = 'patients/patient_notes/?patient=%s&practice=%s';
export const LABPANEL_API = 'clinics/%s/labpanel/';
export const PATIENT_TIMELINE_API = 'patients/%s/combine_patient_report/';
export const PATIENT_TIMELINE_PDF = 'patients/%s/timeline_pdf/';
export const ALL_MEDICAL_CERITICATE_API= 'patients/medical_certificate/?practice=%s&page=%s'
export const MEDICAL_CERTIFICATE_API = 'patients/medical_certificate/?practice=%s&patient=%s';
export const MEDICAL_MEMBERSHIP_CANCEL_API ='patients/cancel_membership/'
export const PATIENTS_MEMBERSHIP_API='patients/membership/?patient=%s'
export const PATIENT_MAILEDFILES = 'patients/files/';
/*DELETE OBJECT*/
export const TREATMENTPLANS_API = 'patients/procedure/'; //?id=patientId&complete=true/false
export const TREATMENTPLANS_MARK_COMPLETE_API = 'patients/complete_procedure/?id=%s&complete=%s';
export const ALL_PRESCRIPTIONS_API = 'patients/prescriptions/%s/';
export const INVOICES_API = 'invoice/';
export const SINGLE_INVOICES_API = 'invoice/%s/'
export const INVOICE_PDF_API = 'invoice/%s/get_pdf';
export const CREATE_OR_EDIT_INVOICES = 'invoice/';
export const SINGLE_INVOICE_API = 'invoice/%s/';
export const PATIENT_CLINIC_NOTES_API = 'patients/clinic_notes/';
export const PATIENT_PAYMENTS_API = 'payment/';
export const SINGLE_PAYMENT_API = 'payment/%s/';
export const PRACTICE_PRINT_SETTING_API = 'clinics/%s/practice_print_settings/?type=%s&sub_type=%s';
export const SAVE_ALL_PRINT_SETTINGS = 'clinics/%s/all_print_settings/';
export const PATIENT_COMMUNICATION_HISTORY_API = 'users/sms_status_update/?user=%s';
export const PRESCRIPTION_TEMPLATE = "clinics/%s/prescription_template/";
export const UNPAID_PRESCRIPTIONS = "patients/unpaid_prescriptions/?id=%s";
//search and advanced search API
export const SEARCH_PATIENT = 'patients/search/?name=%s';


//extra data
export const EXTRA_DATA = 'clinics/extra_data';

//reports

export const APPOINTMENT_REPORTS = 'clinics/%s/appointment_report/'
export const EXPENSE_REPORT = 'clinics/%s/expense_report/'
export const INVOICE_REPORTS = 'clinics/%s/invoice_report/'
export const PATIENTS_REPORTS = 'clinics/%s/patients_report/'
export const PAYMENTS_REPORTS = 'clinics/%s/payments_report/'
export const TREATMENT_REPORTS = 'clinics/%s/treatment_report/'
export const DRUG_TYPE_API = 'clinics/%s/drugtype/';
export const DRUG_UNIT_API = 'clinics/%s/drugunit/';
export const PRINT_PREVIEW_RENDER = 'patients/print/';
export const MEMBERSHIP_API = 'clinics/%s/membership/';
/**
 * Blogs API
 * */

export const BLOG_POST = 'post/';
export const SINGLE_POST = 'post/%s/';
export const BLOG_VIDEOS = 'video/';
export const SINGLE_VIDEO = 'video/%s/';
export const BLOG_DISEASE = 'disease/';
export const SINGLE_DISEASE = 'disease/%s/';
export const BLOG_EVENTS = 'events/';
export const SINGLE_EVENTS = 'events/%s/';
export const BLOG_CONTACTUS = 'contactus/';
export const SINGLE_CONTACT = 'contactus/%s/';
export const BLOG_PAGE_SEO = 'page_seo/';
export const SINGLE_PAGE_SEO = 'page_seo/%s/';
export const BLOG_SLIDER = 'slider/';
export const SINGLE_SLIDER = 'slider/%s/';
export const BLOG_FACILITY = 'facility/';
export const SINGLE_FACILITY = 'facility/%s/';
export const LANDING_PAGE_CONTENT = 'landing_page_content/';
export const SINGLE_LANDING_PAGE_CONTENT = 'landing_page_content/%s/';
export const LANDING_PAGE_VIDEO = 'landing_page_video/';
export const SINGLE_LANDING_PAGE_VIDEO = 'landing_page_video/%s/';
export const MANAGE_PRODUCT = 'product_content/';
export const MANAGE_SINGLE_PRODUCT = 'product_content/%s/';
export const MANAGE_THERAPY = 'therapy_content/';
export const MANAGE_SINGLE_THERAPY = 'therapy_content/%s/';


/**
 * INVENTORY API
 * */

export const EXPENSES_API = "expenses/";
export const SINGLE_EXPENSES_API = "expenses/%s/";
export const VENDOR_API = "clinics/%s/vendor/";
export const SINGLE_VENDOR_API = "vendor/%s/";
export const ACTIVITY_API = "activity/";
export const SINGLE_ACTIVITY_API = "activity/%s/";
export const LAB_API = "lab/";
export const SINGLE_LAB_API = "lab/%s/";
export const MANUFACTURER_API = "manufacturer/";
export const SINGLE_MANUFACTURER_API = "manufacturer/%s/";
export const INVENTORY_ITEM_API = "inventory_item/";
export const SINGLE_INVENTORY_ITEM_API = "inventory_item/%s/";
export const INVENTORY_API = "inventory/";
export const SINGLE_INVENTORY_API = "inventory/%s/";
export const ITEM_TYPE_STOCK = "item_type_stock/";
export const SINGLE_ITEM_TYPE_STOCK = "item_type_stock/%s/";
export const STOCK_ENTRY = "stock_entry/";
export const BULK_STOCK_ENTRY = "stock_entry/bulk/";
export const SUPPLIER_API = 'stock_entry/practice_supplier';
export const SEARCH_THROUGH_QR = 'item_type_stock/find_item';
/**
 * MLM API
 * */
export const ROLE_COMMISION = "role_commission/";
export const PRODUCT_LEVEL = "product_level";
export const PRODUCT_MARGIN = "product_margin/";
export const SINGLE_PRODUCT_MARGIN = "product_margin/%s/";
export const GENERATE_MLM_COMMISSON = 'product_margin/generate_mlm/';


/**
 * PDFs Links
 * */

export const PRESCRIPTION_PDF = 'patients/prescriptions_pdf/?id=%s';
export const VITAL_SIGN_PDF = 'patients/vital_sign_pdf/?id=%s';
export const CLINIC_NOTES_PDF = 'patients/clinic_notes_pdf/?id=%s';
export const TREATMENTPLANS_PDF = 'patients/treatment_plan_pdf/?id=%s';
export const MEDICAL_CERTIFICATE_PDF = 'patients/medical_certificate_pdf/?id=%s';
export const PAYMENT_PDF = 'payment/%s/get_pdf/';


