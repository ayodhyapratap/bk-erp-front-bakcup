import React from "react";
import {Route} from "react-router";

import DynamicFieldsForm from "../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {
    CHECKBOX_FIELD,
    SINGLE_CHECKBOX_FIELD,
    DATE_PICKER,
    NUMBER_FIELD,
    SUCCESS_MSG_TYPE,
    INPUT_FIELD,
    RADIO_FIELD,
    SELECT_FIELD,
    DOCTORS_ROLE
} from "../../constants/dataKeys";
import {
    PATIENTS_LIST,
    ALL_APPOINTMENT_API,
    PRACTICESTAFF,
    PROCEDURE_CATEGORY,
    EMR_TREATMENTNOTES
} from "../../constants/api";
import {getAPI,interpolate, displayMessage} from "../../utils/common";
import { Redirect } from 'react-router-dom'
import moment from 'moment';


class CreateAppointment extends React.Component{
  constructor(props) {
      super(props);

      this.state = {
        redirect:false,
          practice_doctors: [],
          procedure_category:null,
          treatmentNotes:null,
          practice_staff:[],


      }
      this.changeRedirect= this.changeRedirect.bind(this);
      this.loadDoctors = this.loadDoctors.bind(this);
      this.loadProcedureCategory = this.loadProcedureCategory.bind(this);
      this.loadTreatmentNotes = this.loadTreatmentNotes.bind(this);
  }
  componentDidMount(){
      this.loadDoctors();
      this.loadProcedureCategory();
      this.loadTreatmentNotes();
  }

  loadDoctors(){
      let that = this;
      let successFn = function(data){
          data.staff.forEach(function(usersdata){
              if(usersdata.role ==  DOCTORS_ROLE){
                  console.log("sdasdadsadadasdassdassassddassd")
                  let doctor=that.state.practice_doctors;
                  doctor.push(usersdata);
                  that.setState({
                      practice_doctors:doctor,
                  })
              }
              else{
                  let doctor=that.state.practice_staff;
                  doctor.push(usersdata);
                  that.setState({
                      practice_staff:doctor,
                  })
              }
          })

      }
      let errorFn = function(){
      };
      getAPI(interpolate(PRACTICESTAFF,[this.props.active_practiceId]), successFn, errorFn);

  }
    loadProcedureCategory(){
        let that = this;
        let successFn =function (data){
            that.setState({
                procedure_category:data
            })

        }
        let errorFn = function (){

        }
        getAPI(interpolate(PROCEDURE_CATEGORY,[this.props.active_practiceId]), successFn, errorFn)
    }
    loadTreatmentNotes(){
        let that = this;
        let successFn =function (data){
            that.setState({
                treatmentNotes:data
            })

        }
        let errorFn = function (){

        }
        getAPI(interpolate(EMR_TREATMENTNOTES,[this.props.active_practiceId]), successFn, errorFn)
    }

  changeRedirect(){
    var redirectVar=this.state.redirect;
      this.setState({
        redirect:  !redirectVar,
      })  ;
  }
  render(){
      console.log(this.state.practice_doctors)

      const procedureOption=[]
      if(this.state.procedure_category){
          this.state.procedure_category.forEach(function(drug){
              procedureOption.push({label:(drug.name), value:drug.id} );
          })
      }
      const doctorOption=[]
      if(this.state.practice_doctors.length)         {
          this.state.practice_doctors.forEach(function(drug){
              doctorOption.push({label:(drug.name+"("+drug.email+")"), value:drug.id} );
          })
      }
      const treatmentNotesOption=[];
      if(this.state.treatmentNotes){
          this.state.treatmentNotes.forEach(function(drug){
              treatmentNotesOption.push({label:(drug.name+"("+drug.email+")"), value:drug.id} );
          })
      }

      const fields= [ {
        label: "shedule_at",
        key: "shedule_at",
        type: DATE_PICKER,
        initialValue:this.props.startTime,
        format:"YYYY/MM/DD HH:mm"
    },{
        label: "Time Slot",
        key: "slot",
        follow: "mins",
        initialValue:10,
        type: NUMBER_FIELD,
    },{
        label: "Patient Name",
        key: "patient_name",
        required: true,
        type: INPUT_FIELD
    },{
        label: "Patient Id",
        key: "patient_id",
        required: true,
        type: INPUT_FIELD
    },{
        label: "Mobile Number",
        key: "patient_mobile",
        required: true,
        type: INPUT_FIELD
    },{
        label: "Email Address",
        key: "email",
        required: true,
        type: INPUT_FIELD
    },{
        label: "Notify Patient",
        key: "notify_via_sms",
        type: SINGLE_CHECKBOX_FIELD,
        follow: "Via SMS"
    }, {
        label: "Notify Patient",
        key: "notify_via_email",
        type: SINGLE_CHECKBOX_FIELD,
        follow: "Via Email"
    }, {
        label: "Doctor",
        key: "doctor",
        required: true,
        type: SELECT_FIELD,
        options: doctorOption
    },{
        label: "Category",
        key: "category",
        required: true,
        type: SELECT_FIELD,
        options: [{label: "Fast", value: "1"}, {label: "Full stomach", value: "2"}, {label: "No liquids", value: "3"}]
    },{
        label: "Procedures Planned",
        key: "procedure",
        required: true,
        type: SELECT_FIELD,
        options:procedureOption
    },{
        label: "Notes",
        key: "notes",
        required: true,
        type: SELECT_FIELD,
        options: treatmentNotesOption,
    },];
    const formProp={
      successFn:function(data){
        console.log(data);
        displayMessage(SUCCESS_MSG_TYPE, "success")

      },
      errorFn:function(){

      },
      action: ALL_APPOINTMENT_API,
      method: "post",
    };
    const defaultValues = [{"key":"practice", "value":this.props.active_practiceId}];
    const TestFormLayout = Form.create()(DynamicFieldsForm);
      return <Card>
   <TestFormLayout title="add Appointment" changeRedirect= {this.changeRedirect} defaultValues={defaultValues}  formProp= {formProp} fields={fields}/>
      </Card>
  }

}

export default CreateAppointment;
