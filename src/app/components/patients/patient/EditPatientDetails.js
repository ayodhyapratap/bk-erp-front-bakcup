import React from "react";
import {Route} from "react-router";

import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {
    CHECKBOX_FIELD,
    DATE_PICKER,
    NUMBER_FIELD,
    SUCCESS_MSG_TYPE,
    INPUT_FIELD,
    RADIO_FIELD,
    SELECT_FIELD, EMAIL_FIELD, MULTI_SELECT_FIELD
} from "../../../constants/dataKeys";
import {PATIENTS_LIST, PATIENT_PROFILE, MEDICAL_HISTORY, PATIENT_GROUPS, MEMBERSHIP_API} from "../../../constants/api";
import {getAPI, interpolate, displayMessage} from "../../../utils/common";
import {Link, Redirect} from 'react-router-dom'
import moment from 'moment';


class EditPatientDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
            history: [],
            patientGroup: [],
            membership: []

        }
        this.changeRedirect = this.changeRedirect.bind(this);
        console.log("Working or not");

    }

    componentDidMount() {
        this.loadMedicalHistory();
        this.getPatientGroup();
        this.getPatientMembership();
    }

    getPatientMembership() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                membership: data
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(MEMBERSHIP_API, [this.props.active_practiceId]), successFn, errorFn);
    }

    loadMedicalHistory = () => {
        var that = this;
        let successFn = function (data) {
            console.log("get table");
            that.setState({
                history: data,
            })
        };
        let errorFn = function () {

        };

        getAPI(interpolate(MEDICAL_HISTORY, [this.props.active_practiceId]), successFn, errorFn);

    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    getPatientGroup = () => {
        let that = this;
        let successFn = function (data) {
            that.setState({
                patientGroup: data,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })

        };
        getAPI(interpolate(PATIENT_GROUPS, [this.props.active_practiceId]), successFn, errorFn);
    }

    render() {
        console.log(this.props.currentPatient);
        const fields = [{
            label: "Patient Name",
            key: "user.first_name",
            required: true,
            initialValue: this.props.currentPatient ? this.props.currentPatient.user.first_name : null,
            type: INPUT_FIELD
        }, {
            label: "Referral Code",
            key: "user.referer_code",
            initialValue: this.props.currentPatient ? this.props.currentPatient.user.referer_code : null,
            type: INPUT_FIELD
        }, {
            label: "Aadhar ID",
            key: "aadhar_id",
            // required: true,
            initialValue: this.props.currentPatient ? this.props.currentPatient.aadhar_id : null,
            type: INPUT_FIELD
        }, {
            label: "Gender",
            key: "gender",
            type: SELECT_FIELD,
            initialValue: this.props.currentPatient ? this.props.currentPatient.gender : null,
            options: [{label: "Male", value: "male"}, {label: "female", value: "female"}, {
                label: "other",
                value: "other"
            }]
        }, {
            label: "DOB",
            key: "dob",
            initialValue: this.props.currentPatient && this.props.currentPatient.dob ? moment(this.props.currentPatient.dob).format("YYYY-MM-DD") : '',
            format: "YYYY-MM-DD",
            type: DATE_PICKER
        }, {
            label: "Anniversary",
            key: "anniversary",
            initialValue: this.props.currentPatient && this.props.currentPatient.anniversary ? moment(this.props.currentPatient.anniversary) : null,
            format: "YYYY-MM-DD",
            type: DATE_PICKER
        }, {
            label: "Blood Group",
            key: "blood_group",
            initialValue: this.props.currentPatient ? this.props.currentPatient.blood_group : null,
            type: INPUT_FIELD
        }, {
            label: "Family Relation",
            key: "family_relation",
            initialValue: this.props.currentPatient ? this.props.currentPatient.family_relation : null,
            type: INPUT_FIELD,
        }, {
            label: "Mobile (Primary)",
            key: "user.mobile",
            initialValue: this.props.currentPatient ? this.props.currentPatient.user.mobile : null,
            type: INPUT_FIELD,
            required: true,
            disabled: !!this.props.currentPatient
        }, {
            label: "Mobile (Secondary)",
            key: "secondary_mobile_no",
            initialValue: this.props.currentPatient ? this.props.currentPatient.secondary_mobile_no : null,
            type: INPUT_FIELD,
        }, {
            label: "Landline",
            key: "landline_no",
            initialValue: this.props.currentPatient ? this.props.currentPatient.landline_no : null,
            type: INPUT_FIELD,
        }, {
            label: "Address",
            key: "address",
            initialValue: this.props.currentPatient ? this.props.currentPatient.address : null,
            type: INPUT_FIELD,
        }, {
            label: "Locality",
            key: "locality",
            initialValue: this.props.currentPatient ? this.props.currentPatient.locality : null,
            type: INPUT_FIELD,
        }, {
            label: "City",
            key: "city",
            initialValue: this.props.currentPatient ? this.props.currentPatient.city : null,
            type: INPUT_FIELD
        }, {
            label: "Pincode",
            key: "pincode",
            initialValue: this.props.currentPatient ? this.props.currentPatient.pincode : null,
            type: INPUT_FIELD
        }, {
            label: "Email",
            required: true,
            key: "user.email",
            initialValue: this.props.currentPatient ? this.props.currentPatient.user.email : null,
            type: EMAIL_FIELD
        }, {
            label: "Medical History",
            key: "medical_history",
            options: this.state.history.map(item => Object.create({
                label: item.name,
                value: item.id
            })),
            initialValue: this.props.currentPatient ? this.props.currentPatient.medical_history : null,
            type: MULTI_SELECT_FIELD
        }, {
            label: "Patient Group",
            key: "patient_group",
            options: this.state.patientGroup.map(item => Object.create({
                label: item.name,
                value: item.id
            })),
            initialValue: this.props.currentPatient ? this.props.currentPatient.patient_group : null,
            type: MULTI_SELECT_FIELD
        }, {
            label: "Membership",
            key: "medical_membership",
            options: this.state.membership.map(item => Object.create({
                label: item.name,
                value: item.id
            })),
            initialValue: this.props.currentPatient ? this.props.currentPatient.medical_membership : null,
            type: SELECT_FIELD
        }];


        let editformProp;
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        if (this.props.currentPatient) {
            editformProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "success")

                    console.log(data);
                },
                errorFn: function () {

                },
                action: interpolate(PATIENT_PROFILE, [this.props.currentPatient.id]),
                method: "put",
            }
        }
        const newformProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success")

                console.log(data);
            },
            errorFn: function () {

            },
            action: PATIENTS_LIST,
            method: "post",
        }
        const defaultValues = [];
        if (this.props.currentPatient)
            defaultValues.push({key: 'user', value: this.props.currentPatient.user});
        return <Row>
            <Card>
                <Route exact path='/patient/:id/profile/edit'
                       render={(route) => (this.props.currentPatient ?
                           <TestFormLayout title="Edit Patient" changeRedirect={this.changeRedirect}
                                           defaultValues={defaultValues}
                                           formProp={editformProp} fields={fields} {...route}/> :
                           <Redirect to='/patients/profile'/>)}/>
                <Route exact path='/patients/profile/add'
                       render={(route) => <TestFormLayout
                           title={<div>Add Patient <Link style={{float: 'right'}} to={"/patients/patientprintform"}>
                               <small>Print Patient Registration Form</small>
                           </Link></div>} changeRedirect={this.changeRedirect}
                           defaultValues={defaultValues}
                           formProp={newformProp} fields={fields} {...route}/>}/>


            </Card>
            {this.state.redirect && <Redirect to='/patients/profile'/>}
        </Row>

    }
}

export default EditPatientDetails;
