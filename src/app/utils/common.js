import axios from "axios/index";
import {message} from 'antd';
import {getAuthToken} from "./auth";
import CONFIG from "../../app.config";
import {API_URL} from "../constants/api";

import {ERROR_MESSAGE_404, ERROR_MESSAGE_500} from "../constants/messages";
import {ERROR_MSG_TYPE, INFO_MSG_TYPE, SUCCESS_MSG_TYPE, WARNING_MSG_TYPE} from "../constants/dataKeys";

export const makeURL = function (URL) {
    return API_URL + '/' + URL;
};

export const putAPI = function (URL, data, successFn, errorFn, headerConfig = {}) {
    // console.log("sending to " + makeURL(URL), data);
    axios({
        method: 'put',
        url: makeURL(URL),
        data: data,
        headers: {
            Authorization: 'Bearer ' + getAuthToken(),
            ...headerConfig
        }
    }).then(function (response) {
        // console.log(response);
        let data = response.data;
        successFn(data);
    }).catch(function (error) {
        handleErrorResponse(error);
        errorFn(data);
    });
};

export const postAPI = function (URL, data, successFn, errorFn, headerConfig = {}) {
    // console.log("sending to " + makeURL(URL), data);
    axios({
        method: 'post',
        url: makeURL(URL),
        data: data,
        headers: {
            Authorization: 'Bearer ' + getAuthToken(),
            ...headerConfig
        }
    }).then(function (response) {
        // console.log(response);
        let data = response.data;
        successFn(data);
    }).catch(function (error) {
        console.log(error);
        handleErrorResponse(error);
        errorFn();
    });
};

export const getAPI = function (URL, successFn, errorFn) {
    // console.log(getAuthToken());
    axios({
        method: 'get',
        url: makeURL(URL),
        headers: {
            Authorization: 'Bearer ' + getAuthToken()
        }
    }).then(function (response) {
        console.log(response);
        let data = response.data;
        successFn(data);
    }).catch(function (error) {
        console.log("Error aa rhi ", error);
        handleErrorResponse(error);
        errorFn();
    });
};
export const deleteAPI = function (URL, successFn, errorFn) {
    // console.log(getAuthToken());
    axios({
        method: 'delete',
        url: makeURL(URL),
        headers: {
            Authorization: 'Bearer ' + getAuthToken()
        }
    }).then(function (response) {
        console.log(response);
        let data = response.data;
        successFn(data);
    }).catch(function (error) {
        console.log("Error aa rhi ", error);
        handleErrorResponse(error);
        errorFn();
    });
};

export const handleErrorResponse = function (error) {
    let response = error.response;
    if (response) {
        console.info("Error Response Recieved", response);
        let status = response.status;
        if (status == 400) {
            if (response.data.message) {
                message.error(response.data.message);
            }
        } else if (status == 404) {
            if (response.data.message) {
                message.error(response.data.message);
            } else {
                message.error(ERROR_MESSAGE_404);
            }
        } else if (status == 500) {
            message.error(ERROR_MESSAGE_500);
        }
    } else {
        // message.error(ERROR_INTERNET_CONNECTIVITY);
        console.error(response);
    }
};

export const interpolate = function (theString, argumentArray) {
    var regex = /%s/;
    var _r = function (p, c) {
        return p.replace(regex, c);
    };
    return argumentArray.reduce(_r, theString);
};


export const displayMessage = function (type, msg) {
    if (type == SUCCESS_MSG_TYPE)
        message.success(msg);
    else if (type == INFO_MSG_TYPE)
        message.info(msg);
    else if (type == WARNING_MSG_TYPE)
        message.warning(msg);
    else if (type == ERROR_MSG_TYPE)
        message.error(msg);
};

export const startLoadingMessage = function (msg) {
    return message.loading(msg, 0);
};
export const stopLoadingMessage = function (msgFn, finishMsgType, finishMsg) {
    msgFn();
    if (finishMsgType)
        displayMessage(finishMsgType, finishMsg);
    return true;
}

export const parseQueryString = function (query) {
    var obj = {};
    // console.log(query, query.length);
    if (query.length) {
        if (query[0] == '?' || query[0] == '#') {
            query = query.substring(1, query.length)
        }
        var tempArr = query.split('&');
        console.log(tempArr);
        tempArr.forEach(function (str) {
            var arr = str.split('=');
            if (arr.length == 2) {
                obj[arr[0]] = arr[1]
            }
        });
    }
    return obj;
}
