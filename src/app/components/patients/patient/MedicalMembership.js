import React from "react";
import {Divider,Form} from "antd";
import {displayMessage, getAPI, interpolate} from "../../../utils/common";
import {PATIENTS_MEMBERSHIP_API,MEMBERSHIP_API} from "../../../constants/api"
import {INPUT_FIELD,DATE_PICKER ,SUCCESS_MSG_TYPE, SELECT_FIELD} from "../../../constants/dataKeys";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import moment from "moment";
import {Redirect} from "react-router-dom";

export default class MedicalMembership extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            redirect:false,
            currentPatient: this.props.currentPatient,
            Membership:[],
            
        }
        this.loadMembership =this.loadMembership.bind(this);
    }

    componentDidMount() {
        this.loadMembership();
    }

    loadMembership(){
        let that=this;
        let successFn =function (data){
            that.setState({
                Membership:data,
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
        let that = this;
        console.log("form state",this.state)
        const fields = [{
            label: "Type",
            key: "medical_membership",
            type: SELECT_FIELD,
            options: this.state.Membership.map(MembershipItem => ({label: MembershipItem.name, value: MembershipItem.id}))
        },{
            label:"Start Date",
            key:"medical_from",
            initilValue:moment(),
            type:DATE_PICKER,format:'YYYY-MM-DD'

        }];
            const formProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "Medical Membership added");
                    that.props.loadProfile();
                    that.props.loadMedicalMembership();
                    that.props.formChange();
                },
                errorFn: function () {
                    
                },
                action: interpolate(PATIENTS_MEMBERSHIP_API, [this.props.patientId]),
                method: "post"
            }
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        const defaultValues = [{key: 'patient', value: this.props.patientId}, {key: 'practice', value: this.props.active_practiceId}]

        return<TestFormLayout formProp={formProp} defaultValues={defaultValues} fields={fields}/>
    }
}