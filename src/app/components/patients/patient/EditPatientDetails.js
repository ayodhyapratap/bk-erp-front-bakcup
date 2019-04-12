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
    SELECT_FIELD
} from "../../../constants/dataKeys";
import {PATIENTS_LIST, PATIENT_PROFILE} from "../../../constants/api";
import {getAPI, interpolate, displayMessage} from "../../../utils/common";
import {Redirect} from 'react-router-dom'
import moment from 'moment';


class EditPatientDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false,

        }
        this.changeRedirect = this.changeRedirect.bind(this);
        console.log("Working or not");

    }

    componentDidMount() {
    }


    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
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
        },{
            //     label: "Patient ID",
            //     key: "patient_id",
            //     required: true,
            //     initialValue:this.props.currentPatient?this.props.currentPatient.patient_id:null,
            //     type: INPUT_FIELD
            // }, {
            label: "Adhaar ID",
            key: "addhar_id",
            required: true,
            initialValue: this.props.currentPatient ? this.props.currentPatient.addhar_id : null,
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
            initialValue: this.props.currentPatient ? moment(this.props.currentPatient.dob) : null,
            format: "YYYY-MM-DD",
            type: DATE_PICKER
        },
            {
                label: "Anniversary",
                key: "anniversary",
                initialValue: this.props.currentPatient ? moment(this.props.currentPatient.anniversary) : null,
                format: "YYYY-MM-DD",
                type: DATE_PICKER
            }, {
                label: "Blood Group",
                key: "blood_group",
                initialValue: this.props.currentPatient ? this.props.currentPatient.blood_group : null,
                type: INPUT_FIELD
            }, {
                label: "Age",
                key: "age",
                initialValue: this.props.currentPatient ? this.props.currentPatient.age : null,
                type: NUMBER_FIELD
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
                key: "user.email",
                initialValue: this.props.currentPatient ? this.props.currentPatient.user.email : null,
                type: INPUT_FIELD
            },];


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
        const defaultValues = [{key: 'user.is_active', value: true}, {key: 'user.last_name', value: null}];
        return <Row>
            <Card>
                <Route exact path='/patient/:id/profile/edit'
                       render={() => (this.props.currentPatient ?
                           <TestFormLayout title="Edit Patient" changeRedirect={this.changeRedirect}
                                           defaultValues={defaultValues}
                                           formProp={editformProp} fields={fields}/> :
                           <Redirect to='/patients/profile'/>)}/>
                <Route exact path='/patients/profile/add'
                       render={() => <TestFormLayout title="Add Patient" changeRedirect={this.changeRedirect}
                                                     defaultValues={defaultValues}
                                                     formProp={newformProp} fields={fields}/>}/>


            </Card>
            {this.state.redirect && <Redirect to='/patients/profile'/>}
        </Row>

    }
}

export default EditPatientDetails;
