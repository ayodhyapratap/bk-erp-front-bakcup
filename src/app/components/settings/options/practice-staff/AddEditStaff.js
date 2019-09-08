import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {
    CHECKBOX_FIELD,
    SUCCESS_MSG_TYPE,
    INPUT_FIELD,
    RADIO_FIELD,
    SELECT_FIELD,
    SINGLE_CHECKBOX_FIELD,
    COLOR_PICKER,
    EMAIL_FIELD
} from "../../../../constants/dataKeys";
import {ALL_PRACTICE_STAFF, DRUG_CATALOG, SINGLE_PRACTICE_STAFF_API, STAFF_ROLES} from "../../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../../utils/common";
import {Redirect} from 'react-router-dom'
import {Route} from "react-router";
import {ROLES} from "../../../../constants/hardData";

class AddEditStaff extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            editStaff: null,
            // roles: [],


        }
        this.changeRedirect = this.changeRedirect.bind(this);
        this.loadEditPracticeStaff = this.loadEditPracticeStaff.bind(this);
        if (this.props.match.params.staffid) {
            this.loadEditPracticeStaff();
        }
        // this.staffRoles();
    }

    // staffRoles() {
    //     let that = this;
    //     let successFn = function (data) {
    //         that.setState({
    //             roles: data,
    //         })
    //     }
    //     let errorFn = function () {
    //     }
    //     getAPI(STAFF_ROLES, successFn, errorFn)
    // }

    loadEditPracticeStaff() {
        let staffid = this.props.match.params.staffid;
        console.log(staffid)
        let that = this;
        let successFn = function (data) {
            that.setState({
                editStaff: data,
            })
        };
        let errorFn = function () {
            that.setState({
            })
        }
        getAPI(interpolate(SINGLE_PRACTICE_STAFF_API, [staffid]), successFn, errorFn)

    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    render() {
        let that = this;
        const fields = [
            {
                label: "Staff Name",
                key: "user.first_name",
                required: true,
                placeholder:"Staff Name",
                initialValue: this.state.editStaff ? this.state.editStaff.user.first_name : null,
                type: INPUT_FIELD
            }, {
                label: "Mobile Number",
                key: "user.mobile",
                placeholder:"Mobile Number",
                required: true,
                initialValue: this.state.editStaff ? this.state.editStaff.user.mobile : null,
                type: INPUT_FIELD,
                disabled: !!this.state.editStaff
            }, {
                label: "Email Id",
                key: "user.email",
                placeholder:"Email Id",
                required: true,
                disabled: !!this.state.editStaff,
                initialValue: this.state.editStaff ? this.state.editStaff.user.email : null,
                type: EMAIL_FIELD
            },{
                label: "Role",
                key: "role",
                required: true,
                initialValue: this.state.editStaff ? this.state.editStaff.role : null,
                type: SELECT_FIELD,
                options: ROLES.map(role => ({label: role.label, value: [role.value]}))
            }, {
                label: "Schedule SMS",
                key: "schedule_sms",
                initialValue: this.state.editStaff ? this.state.editStaff.schedule_sms : false,
                type: SINGLE_CHECKBOX_FIELD,
            }, {
                label: "Confirmation SMS",
                key: "confirmation_sms",
                initialValue: this.state.editStaff ? this.state.editStaff.confirmation_sms : false,
                type: SINGLE_CHECKBOX_FIELD,
            }, {
                label: "Confirmation Email",
                key: "confirmation_email",
                initialValue: this.state.editStaff ? this.state.editStaff.confirmation_email : false,
                type: SINGLE_CHECKBOX_FIELD,
            }, {
                label: "Online Appointment SMS",
                key: "online_appointment_sms",
                initialValue: this.state.editStaff ? this.state.editStaff.online_appointment_sms : false,
                type: SINGLE_CHECKBOX_FIELD,
            },]
        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success");
                console.log("all data", data);
                that.setState({
                    redirect: true

                });
                that.props.loadData();
            },
            errorFn: function () {

            },
            action: ALL_PRACTICE_STAFF,
            method: "post",
        }
        let editformProp;
        if (this.state.editStaff) {

            editformProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "success");
                    that.setState({
                        redirect: true,
                    });
                    that.props.loadData();
                },
                errorFn: function () {

                },
                action: interpolate(SINGLE_PRACTICE_STAFF_API, [that.props.match.params.staffid]),
                method: "put",
            }
        }
        const defaultValues = [];

        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <Row>
            <Card>
                <Route exact path='/settings/clinics-staff/staff/:staffid/edit'
                       render={(route) => (this.props.match.params.staffid ?
                           <TestFormLayout defaultValues={defaultValues} title="Edit Staff"
                                           changeRedirect={this.changeRedirect} formProp={editformProp}
                                           fields={fields} {...route}/> : <Redirect to={'/settings/clinics-staff'}/>)}/>

                <Route exact path='/settings/clinics-staff/addstaff'
                       render={(route) => <TestFormLayout defaultValues={defaultValues} changeRedirect={this.changeRedirect}
                                                     title="Add Staff " formProp={formProp} fields={fields} {...route}/>}/>
            </Card>
            {this.state.redirect && <Redirect to='/settings/clinics-staff'/>}

        </Row>
    }
}

export default AddEditStaff;
