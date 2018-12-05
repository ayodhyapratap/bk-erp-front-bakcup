import {BACKEND_BASE_URL} from "../config/connect";

/***
 * API Connection URLs
 * */
 export const API_URL = BACKEND_BASE_URL + 'api';

export const SIGNUP_URL = '';
export const LOGIN_URL = 'users/login/';
export const PRACTICESTAFF='clinics/%s/practice_staff/';
export const ALL_PRACTICE= 'clinics/'
export const PRACTICE= 'clinics/%s/'
export const TAXES= 'clinics/%s/taxes/'
export const OFFERS= 'clinics/%s/offers/'
export const PAYMENT_MODES= 'clinics/%s/payment_modes/'
export const PROCEDURE_CATEGORY= 'clinics/%s/procedure_category/'
