import React from "react";
import {Divider,Form} from "antd";
import {displayMessage, getAPI, interpolate} from "../../../utils/common";
import {PATIENTS_MEMBERSHIP_API,MEMBERSHIP_API} from "../../../constants/api"
import {INPUT_FIELD,DATE_PICKER ,SUCCESS_MSG_TYPE, SELECT_FIELD} from "../../../constants/dataKeys";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import moment from "moment";


export default class MedicalMembership extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            currentPatient: this.props.currentPatient,
            MedicalMembership:[]
        }
        this.loadMedicalMembership =this.loadMedicalMembership.bind(this);
    }

    componentDidMount() {
        this.loadMedicalMembership();
    }

    loadMedicalMembership(){
        let that=this;
        let successFn =function (data){
            that.setState({
                MedicalMembership:data,
                loading:false
            })
        };
        let errorFn = function(){
            that.setState({
                loading:false
            })
        };
        if(that.state.currentPatient){
            getAPI(interpolate(MEMBERSHIP_API ,[that.props.active_practiceId]),successFn,errorFn);
        }

    }


    render(){
        console.log("props",this.props);
        let that = this;
        const fields = [{
            label: "Type",
            key: "medical_membership",
            type: SELECT_FIELD,
            options: this.state.MedicalMembership.map(Membership => ({label: Membership.name, value: Membership.id}))
        },{
            label:"Start Date",
            key:"medical_from",
            type:DATE_PICKER,format:'YYYY-MM-DD'

        }];
        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "Patient Note Added");
                that.loadMedicalMembership();
            },
            errorFn: function () {
                
            },
            action: interpolate(PATIENTS_MEMBERSHIP_API, [this.props.patientId]),
            method: "post"
        }
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        const defaultValues = [{key: 'patient', value: this.props.patientId}, {key: 'practice', value: this.props.active_practiceId}]

        return<div>
            <TestFormLayout formProp={formProp}
                            defaultValues={defaultValues}
                            fields={fields}/>
        </div>
    }
}