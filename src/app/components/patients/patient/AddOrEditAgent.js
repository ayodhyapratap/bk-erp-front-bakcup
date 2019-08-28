import React from "react";
import {Divider,Form} from "antd";
import {displayMessage, getAPI, interpolate} from "../../../utils/common";
import {AGENT_ROLES, PATIENT_PROFILE} from "../../../constants/api"
import {SUCCESS_MSG_TYPE, SELECT_FIELD ,SINGLE_IMAGE_UPLOAD_FIELD} from "../../../constants/dataKeys";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";

export default class AddOrEditAgent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            redirect:false,
            currentPatient: this.props.currentPatient,
            agentRoles:[],

        }
        this.loadAgentRoles =this.loadAgentRoles.bind(this);
    }

    componentDidMount() {
        this.loadAgentRoles();
    }

    loadAgentRoles(){
        let that=this;
        let successFn =function (data){
            that.setState({
                agentRoles:data,
                loading:false
            })
        };
        let errorFn = function(){
            that.setState({
                loading:false
            })
        };
        if(that.state.currentPatient){
            getAPI(interpolate(AGENT_ROLES ,[that.props.active_practiceId]),successFn,errorFn);
        }

    }
    render(){
        let that = this;
        const fields = [{
            label: "Role Type",
            key: "role",
            type: SELECT_FIELD,
            options: this.state.agentRoles.map(roles => ({label: roles.name, value: roles.id}))
        },{
            label:"Document Upload",
            key:'aadhar_upload',
            type:SINGLE_IMAGE_UPLOAD_FIELD,
        }];
            const formProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "Agent Role added");
                    that.props.loadProfile();

                },
                errorFn: function () {

                },
                action: interpolate(PATIENT_PROFILE, [this.props.patientId]),
                method: "put"
            }
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        const defaultValues = [{key:'is_agent' , value:true}]

        return<TestFormLayout formProp={formProp} defaultValues={defaultValues} fields={fields}/>
    }
}