import React from "react";
import {Divider,Form, List} from "antd";
import moment from "moment";
import {displayMessage, getAPI, interpolate} from "../../../utils/common";
import {INPUT_FIELD, SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";

import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {PATIENT_CALL_NOTES, PATIENT_GROUPS, PATIENT_NOTES} from "../../../constants/api";

export default class PatientNotes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            callNotesLoading:false,
            loading:true
        }
    }

    componentDidMount() {
        this.loadPatientNotes();
        this.loadPatientCallNotes();
    }

    loadPatientNotes() {
        const that = this;
        that.setState({
            loading:true
        })
        const successFn = function (data) {
            that.setState({
                notes: data,
                loading: false
            });
        };
        const errorFn = function () {
            that.setState({
                loading: false
            })

        };
        getAPI(interpolate(PATIENT_NOTES, [this.props.patientId, this.props.active_practiceId]), successFn, errorFn);
    }

    loadPatientCallNotes=()=>{
      const that = this;
      that.setState({
          callNotesLoading:true
      })
      const successFn = function (data) {
          that.setState({
              callNotes:data,
              callNotesLoading:false,
          })
      }
      const errorFn = function (data) {
          that.setState({
              callNotesLoading:false
          })
      }
      const apiParams ={
          patient:this.props.patientId
      }
      getAPI(PATIENT_CALL_NOTES,  successFn, errorFn, apiParams);
    };

    render() {
        const that = this;
        const fields = [{
            key: "name",
            required: true,
            type: INPUT_FIELD
        }]
        const formProp = {
            successFn (data) {

                displayMessage(SUCCESS_MSG_TYPE, "Patient Note Added");
                that.loadPatientNotes();
            },
            errorFn () {

            },
            action: interpolate(PATIENT_NOTES, [this.props.patientId, this.props.active_practiceId]),
            method: "post",
            beforeSubmit (data) {

            }
        }
        const defaultValues = [{key: 'patient', value: this.props.patientId}, {
            key: 'practice',
            value: this.props.active_practiceId
        }]
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return (
<div>
            <Divider>Patient Notes</Divider>
            <TestFormLayout
              formProp={formProp}
              defaultValues={defaultValues}
              fields={fields}
            />
            <List
              size="small"
              loading={this.state.loading}
              dataSource={this.state.notes}
              renderItem={item => (
<List.Item>
                <List.Item.Meta
                  title={item.name}
                  description={`by ${  item.staff ? item.staff.user.first_name : '--'} on ${moment(item.created_at).format('lll')}`}
                />
</List.Item>
)}
            />

            <Divider>Voice Call Notes</Divider>
            <List
              size="small"
              loading={this.state.callNotesLoading}
              dataSource={this.state.callNotes}
              renderItem={item => (
<List.Item>
                <List.Item.Meta
                  title={item.remarks?item.remarks:'--'}
                  description={`Created on ${moment(item.timestamp).format('lll')}`}
                />
</List.Item>
)}
            />

</div>
)
    }
}
