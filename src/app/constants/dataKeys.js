/***
 * Status Constants
 * */

export const SUCCESS_MSG_TYPE = 'success';
export const WARNING_MSG_TYPE = 'warning';
export const ERROR_MSG_TYPE = 'error';
export const INFO_MSG_TYPE = 'info';

/***
 * Data Keys Constants
 * */
export const USERNAME = 'username';
export const PASSWORD = 'password';
export const PHONE = 'mob';
export const EMAIL = 'email';
export const DOB = 'dob';
export const GENDER = 'gender';
export const FIRST_NAME = 'firstname';
export const LAST_NAME = 'lastname';
export const AUTH_TOKEN = 'token';
export const ROLE = 'role';
export const GROUP = 'group';
export const PRACTICE = 'practice';
export const MEDICAL_HISTORY_KEY = 'Medical History';
export const PATIENT_GROUP_KEY = 'Patient Group';

/***
 * Form Data Types
 * */
export const INPUT_FIELD = 'input';
export const RADIO_FIELD = 'radio';
export const SELECT_FIELD = 'select';
export const MULTI_SELECT_FIELD = 'multiselect';
export const CHECKBOX_FIELD = 'checkbox';
export const SINGLE_CHECKBOX_FIELD = 'singlecheckbox';
export const NUMBER_FIELD = 'number';
export const DATE_PICKER = 'datepicker';
export const DATE_TIME_PICKER = 'datetimepicker';
export const TEXT_FIELD = 'textfield';
export const TIME_PICKER = 'timepicker';
export const COLOR_PICKER = 'colorpicker';
export const QUILL_TEXT_FIELD = 'quilltextfield';
export const SINGLE_IMAGE_UPLOAD_FIELD = 'singleimageupload';
export const MULTI_IMAGE_UPLOAD_FIELD = 'multiimageupload';
export const COUNTRY_FIELD = 'country';
export const STATE_FIELD = 'state';
export const CITY_FIELD = 'city';
export const PASSWORD_FIELD = 'password';
export const EMAIL_FIELD = 'email';
export const SMS_FIELD = 'sms_field';
export const DIVIDER_FIELD = 'divider_field';
export const MAIL_TEMPLATE_FIELD = 'mail_field';
/***
 *Role
 **/
export const DOCTORS_ROLE = '3';
export const CALENDAR_SETTINGS = 'calendar_settings';

/***Reports***/

/*Patient Reports*/
export const NEW_PATIENTS='DETAILED';
export const DAILY_NEW_PATIENTS='DAILY';
export const EXPIRING_MEMBERSHIP='EXPIRED';
export const PATIENTS_FIRST_APPOINTMENT='patientsfirstappointment';
export const MONTHLY_NEW_PATIENTS='MONTHLY';
export const NEW_MEMBERSHIP='NEW';

/*Appointment Reports*/
export const ALL_APPOINTMENT='all';
export const APPOINTMENT_FOR_EACH_CATEGORY='appointmentbycategory' ;
export const CANCELLATION_NUMBERS='cancellationofnumber';
export const AVERAGE_WAITING_ENGAGED_TIME_DAY_WISE='averagewaitingengagedtimedaywise';
export const AVERAGE_WAITING_ENGAGED_TIME_MONTH_WISE='averagewaitingengagedtimemonthwise';
export const REASONS_FOR_CANCELLATIONS='reasonsforcancellations';
export const DAILY_APPOINTMENT_COUNT='dailyappointmentcount';
export const APPOINTMENT_FOR_EACH_DOCTOR='appointmentforeachdoctor';
export const MONTHLY_APPOINTMENT_COUNT='monthlyappointmentcount';
export const APPOINTMENT_FOR_EACH_PATIENT_GROUP='appointmentforeachpatientgroup';


/*Amount Due Reports*/
export const TOTAL_AMOUNT_DUE='all';
export const AGEING_AMOUNT_DUE='a';
export const AMOUNT_DUE_PER_DOCTOR='b';
export const AMOUNT_DUE_PER_PROCEDURE='c';
export const UNSETTLED_INVOICE='d';


/*EMR Reports*/
export const ALL_TREATMENTS='all';
export const DAILY_TREATMENT_COUNT='a';
export const TREATMENTS_FOR_EACH_DOCTOR='b';
export const MONTHLY_TREATMENT_COUNT='c';
export const TREATMENT_FOR_EACH_CATEGORY='d';