import React from "react";
import {Divider} from "antd";
import {displayMessage, getAPI, interpolate} from "../../../utils/common";
import {INPUT_FIELD, SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";
import {Form, List} from "antd/lib/index";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {PATIENT_GROUPS, PATIENT_NOTES} from "../../../constants/api";

export default class PatientNotes extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadPatientNotes();
    }

    loadPatientNotes() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                notes: data,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })

        };
        getAPI(interpolate(PATIENT_NOTES, [this.props.patientId, this.props.active_practiceId]), successFn, errorFn);
    }

    render() {
        let that = this;
        const fields = [{
            key: "name",
            required: true,
            type: INPUT_FIELD
        }]
        const formProp = {
            successFn: function (data) {
                console.log(data);
                displayMessage(SUCCESS_MSG_TYPE, "Patient Note Added");
                that.loadPatientNotes();
            },
            errorFn: function () {

            },
            action: interpolate(PATIENT_NOTES, [this.props.patientId, this.props.active_practiceId]),
            method: "post",
            beforeSubmit: function (data) {
                console.log(data)
            }
        }
        const defaultValues = [{key: 'patient', value: this.props.patientId}, {
            key: 'practice',
            value: this.props.active_practiceId
        }]
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
            <Divider>Patient Notes</Divider>
            <TestFormLayout formProp={formProp}
                            defaultValues={defaultValues}
                            fields={fields}/>
        </div>
    }
}
