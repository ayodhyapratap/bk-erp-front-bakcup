import React from 'react';
import {PRACTICESTAFF} from "../constants/api";
import {getAPI, interpolate} from "./common";
import {DOCTORS_ROLE} from "../constants/dataKeys";
import {Link} from "react-router-dom";
import {Menu} from 'antd';

export const loadDoctors = function (that) {
    let successFn = function (data) {
        let doctor = [];
        data.staff.forEach(function (usersdata) {
            console.log(usersdata);
            if (usersdata.role.indexOf(parseInt(DOCTORS_ROLE)) > -1 || usersdata.role.indexOf(DOCTORS_ROLE) > -1) {
                doctor.push(usersdata);
            }
        });
        that.setState({
            practiceDoctors: doctor,
            selectedDoctor: doctor.length ? doctor[0] : {}
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
