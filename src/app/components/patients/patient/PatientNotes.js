import React from "react";
import {Divider} from "antd";
import {displayMessage, getAPI, interpolate} from "../../../utils/common";
import {INPUT_FIELD, SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";
import {Form, List} from "antd/lib/index";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {PATIENT_CALL_NOTES, PATIENT_GROUPS, PATIENT_NOTES} from "../../../constants/api";
import moment from "moment";

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
        let that = this;
        that.setState({
            loading:true
        })
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
    loadPatientCallNotes=()=>{
      let that = this;
      that.setState({
          callNotesLoading:true
      })
      let successFn = function (data) {
          that.setState({
              callNotes:data,
              callNotesLoading:false,
          })
      }
      let errorFn = function (data) {
          that.setState({
              callNotesLoading:false
          })
      }
      let apiParams ={
          patient:this.props.patientId
      }
      getAPI(PATIENT_CALL_NOTES,  successFn, errorFn, apiParams);
    };

    render() {
        let that = this;
        const fields = [{
            key: "name",
            required: true,
            type: INPUT_FIELD
        }]
        const formProp = {
            successFn: function (data) {

                displayMessage(SUCCESS_MSG_TYPE, "Patient Note Added");
                that.loadPatientNotes();
            },
            errorFn: function () {

            },
            action: interpolate(PATIENT_NOTES, [this.props.patientId, this.props.active_practiceId]),
            method: "post",
            beforeSubmit: function (data) {

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
            <List size={'small'} loading ={this.state.loading} dataSource={this.state.notes} renderItem={item => <List.Item>
                <List.Item.Meta
                    title={item.name}
                    description={'by ' + (item.staff ? item.staff.user.first_name : '--')+' on '+moment(item.created_at).format('lll')}
                />
            </List.Item>}/>

            <Divider>Voice Call Notes</Divider>
            <List size={'small'} loading ={this.state.callNotesLoading} dataSource={this.state.callNotes} renderItem={item => <List.Item>
                <List.Item.Meta
                    title={item.remarks?item.remarks:'--'}
                    description={'Created on '+moment(item.timestamp).format('lll')}
                />
            </List.Item>}/>

        </div>
    }
}
