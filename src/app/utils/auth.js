import lockr from 'lockr';
import axios from 'axios';
import {AUTH_TOKEN, PASSWORD, ROLE,PRACTICE, GROUP, ERROR_MSG_TYPE} from "../constants/dataKeys";
import {displayMessage, getAPI, handleErrorResponse, makeURL} from "./common";
import {LOGIN_URL, OTP_LOGIN_URL, USER_DATA} from "../constants/api";
import {CURRENT_PRACTICE} from "../constants/formLabels";


export const loggedInUser = function () {
    const role = lockr.get(ROLE);
    const token = lockr.get(AUTH_TOKEN);
    if (role && token) {
        return role;
    }
    return null;
};

export const setCurrentPractice = function (practice) {
    lockr.set(CURRENT_PRACTICE, practice);
}

export const loggedInUserPractices = function () {
    const role = lockr.get(ROLE);
    const token = lockr.get(AUTH_TOKEN);
    const practice = lockr.get(PRACTICE);
    if (role && token && practice) {
        return practice;
    }
    return [];
};
export const loggedInactivePractice = function () {
    const currentPractice = lockr.get(CURRENT_PRACTICE);
    if (currentPractice && currentPractice != {}) {
        return currentPractice;
    }
        const practice = lockr.get(PRACTICE);
        if (practice && practice.length) {
            setCurrentPractice(practice[0].practice.id);
            return loggedInactivePractice();
        }

    return null
}



export const getAllPermissions = function () {
    const permissions = [];
    const lockrPermissions = lockr.get('PERMISSIONS');
    if (lockrPermissions && lockrPermissions.ADMIN && lockrPermissions.ADMIN.length) {
        return lockrPermissions.ADMIN;
    }
    return permissions
}

export const logInUser = function (dataToSend, successFn, errorFn) {
    console.log("workign");
    const reqData = {
        'mobile': dataToSend.email,
        [PASSWORD]: dataToSend.password
    };
    axios.post(makeURL(LOGIN_URL), reqData).then(function (response) {
        const {data} = response;
        lockr.set(ROLE, data.user);
        lockr.set(AUTH_TOKEN, data.token);
        lockr.set(PRACTICE, data.practice_list);
        // lockr.set('PERMISSIONS', data.permissions_list);
        successFn()
    }).catch(function (error) {
        console.log(error);
        handleErrorResponse(error);
        errorFn();
    })
};
export const logInUserWithOtp = function (dataToSend, successFn, errorFn) {
    const reqData = {
        'phone_no': dataToSend.phone_no,
        'otp': dataToSend.otp
    };
    axios.post(makeURL(OTP_LOGIN_URL), reqData).then(function (response) {
        const {data} = response;
        lockr.set(ROLE, data.user);
        lockr.set(AUTH_TOKEN, data.token);
        lockr.set(PRACTICE, data.practice_list);
        successFn()
    }).catch(function (error) {
        handleErrorResponse(error);
        errorFn();
    })
};
export const loadUserDetails = function (practice, callBackFn,callBackErrorFn) {
    const successFn = function (data) {
        lockr.set(ROLE, data.user);
        lockr.set(PRACTICE, data.practice_list);
        callBackFn(data);
    }
    const errorFn = function () {
        displayMessage(ERROR_MSG_TYPE, "Permission Loading Failed. Kindly refresh or check your internet connection...");
        callBackErrorFn();
    }
    getAPI(USER_DATA, successFn, errorFn, {practice});
}

export const logOutUser = function (successFn) {
    lockr.rm(ROLE);
    lockr.rm(AUTH_TOKEN);
    lockr.rm(PRACTICE);
    lockr.rm(GROUP);
    successFn();
};
export const getAuthToken = function () {
    const token = lockr.get(AUTH_TOKEN);
    return token;
};

export const sendLoginOTP = function(url,phone,successFn,errorFn){
    const reqData = {
        "phone_no": phone
    };
    axios.post(url, reqData).then(function (response) {
        successFn(response)
    }).catch(function (error) {
        // eslint-disable-next-line
        console.log(error);
        handleErrorResponse(error);
        errorFn();
    })
}
