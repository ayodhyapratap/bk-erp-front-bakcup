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
            currentPatient: this.props.currentPatient,
            Membership:[]
        }
        this.loadMembership =this.loadMembership.bind(this);
    }

    componentDidMount() {
        this.loadMembership();
    }

    changeRedirect(){
        var redirectVar=this.state.redirect;
        this.setState({
            redirect:  !redirectVar,
        })  ;
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
        console.log("props",this.props);
        console.log("state",this.state)
        let that = this;
        const fields = [{
            label: "Type",
            key: "medical_membership",
            initilValue:"",
            type: SELECT_FIELD,
            options: this.state.Membership.map(MembershipItem => ({label: MembershipItem.name, value: MembershipItem.id}))
        },{
            label:"Start Date",
            key:"medical_from",
            type:DATE_PICKER,format:'YYYY-MM-DD'

        }];
        
            const editformProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "Medical Membership Update");
                    that.loadMedicalMembership();
                    that.setState({
                        redirect:true
                    })
                },
                errorFn: function () {
                    
                },
                action: interpolate(PATIENTS_MEMBERSHIP_API, [this.props.patientId]),
                method: "put",

            }
            const formProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "Medical Membership added");
                    that.loadMedicalMembership();
                    that.setState({
                        redirect:true
                    })
                },
                errorFn: function () {
                    
                },
                action: interpolate(PATIENTS_MEMBERSHIP_API, [this.props.patientId]),
                method: "post"
            }
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        const defaultValues = [{key: 'patient', value: this.props.patientId}, {key: 'practice', value: this.props.active_practiceId}]

        return<div>
            {this.props.MedicalMembership ?<TestFormLayout formProp={editformProp}
                            defaultValues={defaultValues}
                            fields={fields}/>
                :<TestFormLayout formProp={formProp}
                defaultValues={defaultValues}
                fields={fields}/>
            
            }
            {/* {this.state.redirect && <Redirect to={'/patient/' + this.props.patientId + 'profile'} />} */}
        </div>
    }
}