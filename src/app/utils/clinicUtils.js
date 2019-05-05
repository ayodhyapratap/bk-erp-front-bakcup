import {PRACTICESTAFF} from "../constants/api";
import {getAPI, interpolate} from "./common";
import {DOCTORS_ROLE} from "../constants/dataKeys";

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
