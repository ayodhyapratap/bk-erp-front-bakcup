import React from "react";
import {Route} from "react-router";
import DynamicFieldsForm from "../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {
    CHECKBOX_FIELD,
    SINGLE_CHECKBOX_FIELD,
    DATE_PICKER,
    NUMBER_FIELD,
    SUCCESS_MSG_TYPE,
    INPUT_FIELD,
    RADIO_FIELD,
    SELECT_FIELD,
    DOCTORS_ROLE
} from "../../constants/dataKeys";
import {
    PATIENTS_LIST,
    ALL_APPOINTMENT_API,
    APPOINTMENT_CATEGORIES,
    PRACTICESTAFF,
    PROCEDURE_CATEGORY, APPOINTMENT_API, SINGLE_PRACTICE_STAFF_API, SEARCH_PATIENT
} from "../../constants/api";
import {getAPI, interpolate, displayMessage} from "../../utils/common";
import {Redirect} from 'react-router-dom'
import moment from 'moment';
import CreateAppointmentForm from "./CreateAppointmentForm";


class CreateAppointment extends React.Component {
    constructor(props){
        super(props);
        this.state={

        }
    }
    render() {

        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success")

            },
            errorFn: function () {

            },
            onFieldsDataChange: function (data) {
                // console.log(data);
            },
            action: ALL_APPOINTMENT_API,
            method: "post",
        };
        let defaultValues = [{"key": "practice", "value": this.props.active_practiceId}];
        let that = this;
        let editformProp;
        // if (this.state.appointment) {
        //     editformProp = {
        //         successFn: function (data) {
        //             displayMessage(SUCCESS_MSG_TYPE, "success");
        //             console.log(data);
        //         },
        //         errorFn: function () {
        //
        //         },
        //         onFieldsDataChange: function (data) {
        //             that.setState(function (prevState) {
        //                 return {appointment: {...prevState.appointment, ...data}}
        //             });
        //         },
        //         action: interpolate(APPOINTMENT_API, [this.state.appointment.id]),
        //         method: "put",
        //     }
        //     defaultValues = [{"key": "practice", "value": this.state.appointment.practice}];
        //
        // }
        const TestFormLayout = Form.create()(CreateAppointmentForm);
        return <Row>
            <Route exact path='/calendar/:appointmentid/edit-appointment'
                   render={(route) => (this.props.match.params.appointmentid ?
                       <TestFormLayout {...route} {...this.props} defaultValues={defaultValues} title="Edit Appointment"
                                       changeRedirect={this.changeRedirect}/> :
                       <Redirect to={'/patients/appointments/'}/>)}/>

            <Route exact path='/calendar/create-appointment'
                   render={(route) => <TestFormLayout {...this.props} defaultValues={defaultValues} changeRedirect={this.changeRedirect} {...route}
                                                 title="ADD Appointment "/>}/>

        </Row>
    }


}

export default CreateAppointment;
