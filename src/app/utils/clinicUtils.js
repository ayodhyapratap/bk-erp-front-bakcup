import React from 'react';
import {PRACTICESTAFF} from "../constants/api";
import {getAPI, interpolate} from "./common";
import {DOCTORS_ROLE} from "../constants/dataKeys";
import {Link} from "react-router-dom";
import {Menu} from 'antd';

export const loadDoctors = function (that) {
    let successFn = function (data) {
        let doctor = [];
        let selectedDoctor = {};
        data.staff.forEach(function (usersdata) {
            if (usersdata.role.indexOf(parseInt(DOCTORS_ROLE)) > -1 || usersdata.role.indexOf(DOCTORS_ROLE) > -1) {
                doctor.push(usersdata);
                if (that.state.selectedDoctor) {
                    selectedDoctor = that.state.selectedDoctor
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
