import React from 'react';
import {CONFIG_API, MAILING_USERS_LIST, PRACTICESTAFF} from "../constants/api";
import {displayMessage, getAPI, interpolate} from "./common";
import {DOCTORS_ROLE, ERROR_MSG_TYPE} from "../constants/dataKeys";
import {Link} from "react-router-dom";
import {Form, Input, Menu, Modal} from 'antd';
import {MAIL_SEND_ERROR_MSG, MAIL_SEND_MSG, SUCCESS} from "../constants/messages";
const { confirm } = Modal;
export const loadDoctors = function (that) {
    let successFn = function (data) {
        let doctor = [];
        let selectedDoctor = {};
        data.staff.forEach(function (usersdata) {

            if (usersdata.role.indexOf(parseInt(DOCTORS_ROLE)) > -1 || usersdata.role.indexOf(DOCTORS_ROLE) > -1) {
                doctor.push(usersdata);
                if (that.props.user.id == usersdata.user.id) {
                    selectedDoctor = usersdata;
                }
            }
        });
        that.setState({
            practiceDoctors: doctor,
            selectedDoctor: (doctor.length && !selectedDoctor.id ? doctor[0] : selectedDoctor)
        });
    };
    let errorFn = function () {
    };
    getAPI(interpolate(PRACTICESTAFF, [that.props.active_practiceId]), successFn, errorFn);
}

export const patientSettingMenu = (<Menu>
        <Menu.Item key="1">
            <Link to={"/settings/prescriptions"}>
                Add/Edit Drugs
            </Link>
        </Menu.Item>
        <Menu.Item key="2">
            <Link to={"/settings/procedures"}>
                Add/Edit Procedures
            </Link>
        </Menu.Item>
        <Menu.Item key="3">
            <Link to={"/settings/emr#treatmentnotes"}>
                Add/Edit Clinical Notes
            </Link>
        </Menu.Item>
        <Menu.Item key="4">
            <Link to={"/settings/printout"}>
                Modify EMR/Billing Printout
            </Link>
        </Menu.Item>
        <Menu.Item key="5">
            <Link to={"/settings/billing#taxcatalog"}>
                Add/Edit taxes
            </Link>
        </Menu.Item>
        <Menu.Item key="6">
            <Link to={"/settings/billing#paymentmodes"}>
                Add/Edit Payment Modes
            </Link>
        </Menu.Item>
    </Menu>
);

export const hashCode = function (str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 6) - hash);
        hash = (hash >> 6) + hash
    }
    return hash;
}

export const intToRGB = function (i) {
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

export const loadConfigParameters = function (that, params = []) {
    let successFn = function (data) {
        that.setState({
            ...data
        });
    };
    let errorFn = function () {

    };
    let parameters = params.join(',');
    getAPI(CONFIG_API, successFn, errorFn, {parameters});
}

export const loadMailingUserListForReportsMail = function (that) {
    let successFn = function (data) {
        that.setState({
            mailingUsersList: data
        })
    }
    let errorFn = function () {

    }
    getAPI(MAILING_USERS_LIST, successFn, errorFn)
}

export const sendReportMail = function(url,params,successMsg, errorMsg){
    confirm({
        title: 'Are you sure send mail?',
        content: 'Email Id :'+ params.mail_to,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
            let successFn = function (data){
                if (successMsg){
                    displayMessage(SUCCESS,MAIL_SEND_MSG + "to" +params.mail_to)
                }

            }
            let errorFn = function (){
                if (errorMsg){
                    displayMessage(ERROR_MSG_TYPE,MAIL_SEND_ERROR_MSG)
                }


            }
            getAPI(url,successFn,errorFn,params);
        },
        onCancel() {
        },
    });

}

export const sendMail= function (url, params) {

    let successFn = function (data){

    };
    let errorFn = function (){

    };
    getAPI(url,successFn,errorFn,params);
}
