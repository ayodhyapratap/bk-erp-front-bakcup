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
    EMR_TREATMENTNOTES, APPOINTMENT_API, SINGLE_PRACTICE_STAFF_API
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
          appointment: null,


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
      if(this.props.match.params.appointmentid){
          this.loadAppointment();
      }
  }
    loadAppointment(){
        let that=this;
        let successFn = function (data) {

            that.setState({
                appointment:data,
            });

        }

        let errorFn = function (){

        }
        getAPI (interpolate(APPOINTMENT_API,[this.props.match.params.appointmentid])  , successFn,errorFn);

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
      const categoryOptions= [{label: "Fast", value: 1}, {label: "Full stomach", value: 2}, {label: "No liquids", value: 3}]

      const fields= [ {
        label: "shedule_at",
        key: "shedule_at",
        type: DATE_PICKER,
        initialValue:this.state.appointment?this.state.appointment.shedule_at:this.props.startTime,
        format:"YYYY/MM/DD HH:mm"
    },{
        label: "Time Slot",
        key: "slot",
        follow: "mins",
        initialValue:this.state.appointment?this.state.appointment.slot:10,
        type: NUMBER_FIELD,
    },{
        label: "Patient Name",
        key: "patient_name",
        required: true,
        initialValue:this.state.appointment?this.state.appointment.patient_name:null,
        type: INPUT_FIELD
    },{
        label: "Patient Id",
        key: "patient_id",
        required: true,
        initialValue:this.state.appointment?this.state.appointment.patient_id:null,
        type: INPUT_FIELD
    },{
        label: "Mobile Number",
        key: "patient_mobile",
        required: true,
        initialValue:this.state.appointment?this.state.appointment.patient_mobile:null,
        type: INPUT_FIELD
    },{
        label: "Email Address",
        key: "email",
        initialValue:this.state.appointment?this.state.appointment.email:null,
        required: true,
        type: INPUT_FIELD
    },{
        label: "Notify Patient",
        key: "notify_via_sms",
        type: SINGLE_CHECKBOX_FIELD,
        initialValue:this.state.appointment?this.state.appointment.notify_via_sms:false,
        follow: "Via SMS"
    }, {
        label: "Notify Patient",
        key: "notify_via_email",
        type: SINGLE_CHECKBOX_FIELD,
        initialValue:this.state.appointment?this.state.appointment.notify_via_email:false,
        follow: "Via Email"
    }, {
        label: "Doctor",
        key: "doctor",
        required: true,
        initialValue:this.state.appointment?this.state.appointment.doctor:null,
        type: SELECT_FIELD,
        options: doctorOption
    },{
        label: "Category",
        key: "category",
        required: true,
        type: SELECT_FIELD,
        initialValue:this.state.appointment?this.state.appointment.category:null,
        options: categoryOptions
    },{
        label: "Procedures Planned",
        key: "procedure",
        required: true,
        type: SELECT_FIELD,
        initialValue:this.state.appointment?this.state.appointment.procedure:null,
        options:procedureOption
    },{
        label: "Notes",
        key: "notes",
        required: true,
        type: SELECT_FIELD,
        initialValue:this.state.appointment?this.state.appointment.notes:null,
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
      let defaultValues = [{"key":"practice", "value":this.props.active_practiceId}];

      let editformProp;
      if (this.state.appointment) {
          editformProp = {
              successFn: function (data) {
                  displayMessage(SUCCESS_MSG_TYPE, "success");
                  console.log(data);
              },
              errorFn: function () {

              },
              action: interpolate(APPOINTMENT_API, [this.state.appointment.id]),
              method: "put",
          }
           defaultValues = [{"key":"practice", "value":this.state.appointment.practice}];

      }
    const TestFormLayout = Form.create()(DynamicFieldsForm);
      return <Row><Card>
          <Route exact path='/calendar/:appointmentid/edit-appointment'
                 render={() => (this.props.match.params.appointmentid?<TestFormLayout defaultValues={defaultValues} title="Edit Appointment" changeRedirect= {this.changeRedirect} formProp= {editformProp} fields={fields}/>: <Redirect to={'/patients/appointments/'} />)}/>

          <Route exact path='/calendar/create-appointment'
                 render={() => <TestFormLayout defaultValues={defaultValues}  changeRedirect= {this.changeRedirect} title="ADD Appointmnt "  formProp ={formProp} fields={fields}/>}/>
      </Card>
          {this.state.redirect&&    <Redirect to='/patients/appointments/' />}
      </Row>
  }

}

export default CreateAppointment;
