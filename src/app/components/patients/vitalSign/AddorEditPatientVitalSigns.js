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
import {VITAL_SIGNS_API, PATIENT_PROFILE} from "../../../constants/api";
import {getAPI, interpolate, displayMessage} from "../../../utils/common";
import {Redirect} from 'react-router-dom'
import moment from 'moment';


class AddorEditPatientVitalSigns extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
            vitalSign: null,
            editVitalSign: this.props.editVitalSign ? this.props.editVitalSign : null,

        }
        this.changeRedirect = this.changeRedirect.bind(this);
        console.log("Working or not");

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
            label: "Pulse",
            key: "pulse",
            required: true,
            initialValue: this.props.editVitalSign ? this.props.editVitalSign.pulse : null,
            type: NUMBER_FIELD
        }, {
            label: "Temperature",
            key: "temperature",
            initialValue: this.props.editVitalSign ? this.props.editVitalSign.temperature : null,
            type: INPUT_FIELD
        }, {
            label: "Temperature Part",
            key: "temperature_part",
            type: SELECT_FIELD,
            initialValue: this.props.editVitalSign ? this.props.editVitalSign.temperature_part : null,
            options: [{label: "forehead", value: "forehead"}, {label: "armpit", value: "armpit"}, {
                label: "oral ",
                value: "oral"
            }]
        }, {
            label: "Blood Pressure",
            key: "blood_pressure",
            initialValue: this.props.editVitalSign ? this.props.editVitalSign.blood_pressure : null,
            type: INPUT_FIELD,
        }, {
            label: "Position",
            key: "position",
            type: SELECT_FIELD,
            initialValue: this.props.editVitalSign ? this.props.editVitalSign.position : null,
            options: [{label: "standing", value: "standing"}, {label: "sitting", value: "sitting"}]
        }, {
            label: "Weight",
            key: "weight",
            initialValue: this.props.editVitalSign ? this.props.editVitalSign.weight : null,
            type: INPUT_FIELD,
        }, {
            label: "Resp Rate",
            key: "resp_rate",
            initialValue: this.props.editVitalSign ? this.props.editVitalSign.resp_rate : null,
            type: INPUT_FIELD,
        },];


        let editformProp;
        let defaultValues = []
        let that = this;
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        if (this.state.editVitalSign) {
            editformProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "success")
                    if (that.props.loadData)
                        that.props.loadData();
                },
                errorFn: function () {

                },
                action: interpolate(VITAL_SIGNS_API, [this.props.match.params.id]),
                method: "post",
            }
            defaultValues.push({"key": "id", "value": this.state.editVitalSign.id})
        }
        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success")
                if (that.props.loadData)
                    that.props.loadData();
            },
            errorFn: function () {

            },
            action: interpolate(VITAL_SIGNS_API, [this.props.match.params.id]),
            method: "post",
        }


        return <Row>
            <Card>
                <Route exact path='/patient/:id/emr/vitalsigns/edit'
                       render={() => (this.state.editVitalSign ?
                           <TestFormLayout defaultValues={defaultValues} title="Edit vital sign"
                                           changeRedirect={this.changeRedirect} formProp={editformProp}
                                           fields={fields}/> :
                           <Redirect to='/patients/profile'/>)}/>
                <Route exact path='/patient/:id/emr/vitalsigns/add'
                       render={() => <TestFormLayout title="Add vital sign" changeRedirect={this.changeRedirect}
                                                     formProp={formProp} fields={fields}/>}/>


            </Card>
            {this.state.redirect && <Redirect to={'/patient/' + this.props.match.params.id + '/emr/vitalsigns'}/>}
        </Row>

    }
}

export default AddorEditPatientVitalSigns;
