import lockr from 'lockr';
import axios from 'axios';
import {AUTH_TOKEN, PASSWORD, ROLE, EMAIL, PRACTICE, GROUP, ERROR_MSG_TYPE} from "../constants/dataKeys";
import {displayMessage, getAPI, handleErrorResponse, makeURL} from "./common";
import {LOGIN_URL, OTP_LOGIN_URL, USER_DATA} from "../constants/api";
import {CURRENT_PRACTICE} from "../constants/formLabels";


export const loggedInUser = function () {
    let role = lockr.get(ROLE);
    let token = lockr.get(AUTH_TOKEN);
    if (role && token) {
        return role;
    }
    return null;
};

export const currentPractice = function () {

}
export const setCurrentPractice = function (practice) {
    lockr.set(CURRENT_PRACTICE, practice);
}
export const loggedInUserGroup = function () {
    let role = lockr.get(ROLE);
    let token = lockr.get(AUTH_TOKEN);
    let group = lockr.get(GROUP);
    if (role && token && group) {
        return group;
    }
    return null;
};
export const loggedInUserPractices = function () {
    let role = lockr.get(ROLE);
    let token = lockr.get(AUTH_TOKEN);
    let practice = lockr.get(PRACTICE);
    if (role && token && practice) {
        return practice;
    }
    return [];
};
export const loggedInactivePractice = function () {
    let currentPractice = lockr.get(CURRENT_PRACTICE);
    if (currentPractice && currentPractice != {}) {
        return currentPractice;
    } else {
        let practice = lockr.get(PRACTICE);
        if (practice && practice.length) {
            console.log(practice);
            setCurrentPractice(practice[0].practice.id);
            return loggedInactivePractice();
        }
    }
    return null
}


export const loggedInPermissions = function () {
    let groups = lockr.get(GROUP);
    let permissions = {};
    if (groups)
        groups.forEach(function (group) {
            group.permissions.forEach(function (permission) {
                permissions[permission.codename] = true
            });
        })
    return permissions;
}

export const getAllPermissions = function () {
    let permissions = [];
    let lockrPermissions = lockr.get('PERMISSIONS');
    if (lockrPermissions && lockrPermissions.ADMIN && lockrPermissions.ADMIN.length) {
        return lockrPermissions.ADMIN;
    }
    return permissions
}

export const getSuperUserPermissions = function () {
    let permissions = [];
    let lockrPermissions = lockr.get('PERMISSIONS');
    if (lockrPermissions && lockrPermissions.SUPERUSER && lockrPermissions.SUPERUSER.length) {
        return lockrPermissions.ADMIN;
    }
    return permissions
}
export const logInUser = function (data, successFn, errorFn) {
    console.log("workign");
    var reqData = {
        'mobile': data.email,
        [PASSWORD]: data.password
    };
    axios.post(makeURL(LOGIN_URL), reqData).then(function (response) {
        // console.log(response);
        let data = response.data;
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
export const logInUserWithOtp = function (data, successFn, errorFn) {
    var reqData = {
        'phone_no': data.phone_no,
        'otp': data.otp
    };
    axios.post(makeURL(OTP_LOGIN_URL), reqData).then(function (response) {
        // console.log(response);
        let data = response.data;
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
export const loadUserDetails = function (practice, callBackFn,callBackErrorFn) {
    let successFn = function (data) {
        lockr.set(ROLE, data.user);
        // lockr.set(PRACTICE, data.practice_permissions);
        callBackFn(data);
    }
    let errorFn = function () {
        displayMessage(ERROR_MSG_TYPE, "Permission Loading Failed. Kindly refresh or check your internet connection...");
        callBackErrorFn();
    }
    getAPI(USER_DATA, successFn, errorFn, {practice: practice});
}
export const saveAuthToken = function (response, successFn) {
    let data = response;
    lockr.set(ROLE, data.id);
    lockr.set(AUTH_TOKEN, data.token);
    successFn()
}

export const logOutUser = function (successFn, errorFn) {
    lockr.rm(ROLE);
    lockr.rm(AUTH_TOKEN);
    lockr.rm(PRACTICE);
    lockr.rm(GROUP);
    successFn();
};
export const getAuthToken = function () {
    let token = lockr.get(AUTH_TOKEN);
    return token;
};

export const checkRole = function (role) {
    let roles = lockr.get(ROLE);
    if (roles[role] === undefined || roles[role] === '' || !roles[role]) {
        return false;
    }
    return roles[role];
}


export const sendLoginOTP = function(url,phone,successFn,errorFn){
    let reqData = {
        "phone_no": phone
    };
    axios.post(url, reqData).then(function (response) {
        // console.log(response);
        successFn(response)
    }).catch(function (error) {
        console.log(error);
        handleErrorResponse(error);
        errorFn();
    })
}
