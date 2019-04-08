import React from "react";
import {Form, Input, Select, CheckBox, DatePicker,Button, Icon, TimePicker, InputNumber, Card, List, Avatar,AutoComplete} from 'antd';
import {REQUIRED_FIELD_MESSAGE} from "../../constants/messages";
import moment from "moment/moment";
import {DOCTORS_ROLE} from "../../constants/dataKeys";
import {
    APPOINTMENT_API,
    APPOINTMENT_CATEGORIES,
    EMR_TREATMENTNOTES,
    FILE_UPLOAD_API,
    PRACTICESTAFF, PROCEDURE_CATEGORY,
    SEARCH_PATIENT,
    ALL_APPOINTMENT_API,
    PATIENT_PROFILE

} from "../../constants/api";
import {Checkbox, message, Radio} from "antd/lib/index";
import {getAPI, interpolate, makeURL, postAPI} from "../../utils/common";
import {Redirect} from "react-router-dom";

const {TextArea} = Input;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { Meta } = Card;
export default class CreateAppointmentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            practice_doctors: [],
            appointmentCategories: null,
            procedure_category: null,
            treatmentNotes: null,
            practice_staff: [],
            appointment: null,
            loading: false,
            patientListData: [],
            patientDetails : null,
            appointmentDetail:null
        }
        this.changeRedirect = this.changeRedirect.bind(this);
        this.loadDoctors = this.loadDoctors.bind(this);
        this.loadProcedureCategory = this.loadProcedureCategory.bind(this);
        this.loadTreatmentNotes = this.loadTreatmentNotes.bind(this);
        this.searchPatient = this.searchPatient.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.loadDoctors();
        this.loadProcedureCategory();
        this.loadTreatmentNotes();
        this.loadAppointmentCategories();
        if (this.props.match.params.appointmentid) {
            this.loadAppointment();
        }
    }

    loadAppointment() {
        let that = this;
        this.setState({
            loading: true,
        })
        let successFn = function (data) {
            that.setState({
                appointment: data,
                loading: false,
            });
        }

        let errorFn = function () {
            that.setState({
                loading: false,
            })
        }
        getAPI(interpolate(APPOINTMENT_API, [this.props.match.params.appointmentid]), successFn, errorFn);

    }

    loadDoctors() {
        let that = this;
        let successFn = function (data) {
            data.staff.forEach(function (usersdata) {
                if (usersdata.role == DOCTORS_ROLE) {
                    let doctor = that.state.practice_doctors;
                    doctor.push(usersdata);
                    that.setState({
                        practice_doctors: doctor,
                    })
                }
                else {
                    let doctor = that.state.practice_staff;
                    doctor.push(usersdata);
                    that.setState({
                        practice_staff: doctor,
                    })
                }
            })

        }
        let errorFn = function () {
        };
        getAPI(interpolate(PRACTICESTAFF, [this.props.active_practiceId]), successFn, errorFn);

    }

    loadProcedureCategory() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                procedure_category: data
            })

        }
        let errorFn = function () {

        }
        getAPI(interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]), successFn, errorFn)
    }

    loadTreatmentNotes() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                treatmentNotes: data
            })

        }
        let errorFn = function () {

        }
        getAPI(interpolate(EMR_TREATMENTNOTES, [this.props.active_practiceId]), successFn, errorFn)
    }

    loadAppointmentCategories() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                appointmentCategories: data
            })

        }
        let errorFn = function () {

        }
        getAPI(interpolate(APPOINTMENT_CATEGORIES, [this.props.active_practiceId]), successFn, errorFn)
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    searchPatient(value) {
        // console.log(e.target.value);
        let that = this;
        let successFn = function (data) {
            if (data) {
                that.setState({
                    patientListData: data
                })
            }
        };
        let errorFn = function () {
        };
        getAPI(interpolate(SEARCH_PATIENT, [value]), successFn, errorFn);
    }

    handleSubmit = (e) => {
        let that =this;
        let patient={};
        e.preventDefault();
        this.props.form.validateFields((err,formData) => {
            if (!err) {
              formData.patient = patient
                let successFn = function (data) {
                    if (data) {
                       console.log(data)
                    }
                };
                let errorFn = function () {

                };
                // console.log("appointment",that.state.formData);

                postAPI(ALL_APPOINTMENT_API,formData ,successFn,errorFn);
            }
        });

    }
    handleChange = (event) => {
        let that =this;
        let successFn = function(data){
            that.setState({
                patientDetails: data

            });
            // console.log("event",that.state.patientDetails);
        };
        let errorFn = function () {
        };
        getAPI(interpolate(PATIENT_PROFILE, [event]), successFn, errorFn);

        // this.setState({ value: event.target.value });
    };
    handleClick = (e)=>{

        this.setState({
            patientDetails:null
        })

    }
     
    render() {
        const that = this;
        const formItemLayout = (this.props.formLayout ? this.props.formLayout : {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        });
        const formPatients =(this.props.formLayout? this.props.formLayout:{
            wrapperCol: {offset:6 ,span: 14},
        });
        const {getFieldDecorator} = this.props.form;
        console.log(this.state.practice_doctors)

        const procedureOption = []
        if (this.state.procedure_category) {
            this.state.procedure_category.forEach(function (drug) {
                procedureOption.push({label: (drug.name), value: drug.id});
            })
        }
        const doctorOption = []
        if (this.state.practice_doctors.length) {
            this.state.practice_doctors.forEach(function (drug) {
                doctorOption.push({label: (drug.name + "(" + drug.email + ")"), value: drug.id});
            })
        }
        const treatmentNotesOption = [];
        if (this.state.treatmentNotes) {
            this.state.treatmentNotes.forEach(function (drug) {
                treatmentNotesOption.push({label: (drug.name + "(" + drug.email + ")"), value: drug.id});
            })
        }
        const categoryOptions = [];
        if (this.state.appointmentCategories) {
            this.state.appointmentCategories.forEach(function (category) {
                categoryOptions.push({label: category.name, value: category.id});
            })
        }
        let appointmentTime = this.state.appointment ? this.state.appointment.shedule_at : this.props.startTime;
        if (!appointmentTime) {
            appointmentTime = new moment(new Date()).format();
            console.log(appointmentTime);
        }
        const fields = [];
        return <Card loading={this.state.loading}>
            <Form onSubmit={this.handleSubmit}>
                {this.props.title ? <h2>{this.props.title}</h2> : null}
                <FormItem key="shedule_at" label="Appointment Schedule" {...formItemLayout}>
                    {getFieldDecorator("shedule_at",
                        {initialValue: appointmentTime ? moment(appointmentTime) : null},
                        {
                            rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}],
                        })(
                        <DatePicker format="YYYY/MM/DD HH:mm"/>
                    )}
                </FormItem>
                <FormItem key="slot"
                          {...formItemLayout}
                          label="Time Slot">
                    {getFieldDecorator("slot", {initialValue: this.state.appointment ? this.state.appointment.slot : 10}, {
                        rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}],
                    })(
                        <InputNumber min={1}/>
                    )}
                    <span className="ant-form-text">mins</span>
                </FormItem>
            
               
                     
                
                {this.state.patientDetails?
                        <FormItem key="patient_name" {...formPatients}>
                           <Card bordered={false} style={{ background: '#ECECEC'}}>
                                <Meta
                                  avatar={<Avatar   style={{ backgroundColor: '#ffff' }} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                  title={this.state.patientDetails.name}
                                  description={this.state.patientDetails.email}

                                />

                                <Button type="primary" style={{float: 'right'}}  onClick={this.handleClick}>Add New Patient</Button>
                            </Card>
                        </FormItem>
                      :<div>
                          <FormItem key="patient_name" label="Patient Name"  {...formItemLayout}>
                             {getFieldDecorator("patient_name", {initialValue: this.state.appointment ? this.state.appointment.patient_name : null}, {
                        rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}],
                    })(
                        <AutoComplete placeholder="Patient Name"
                                showSearch
                                onSearch={this.searchPatient}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                onChange={this.handleChange.bind(this)}>
                            {this.state.patientListData.map((option) => <AutoComplete.Option
                                value={option.id.toString()}>
                                <List.Item style={{padding:0}}>
                                    <List.Item.Meta
                                        avatar={<Avatar
                                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                                        title={option.name + " ("+option.id+")"}
                                        // description={option.mobile}
                                    />

                                </List.Item>
                            </AutoComplete.Option>)}
                        </AutoComplete>
                    )}
                </FormItem>
                          <FormItem key="patient_mobile" label="Mobile Number"   {...formItemLayout}>
                                {getFieldDecorator("patient_mobile", {initialValue: this.state.appointment ? this.state.appointment.patient_mobile : null}, {
                                    rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}],
                                })(
                                    <Input placeholder="Mobile Number"
                                    />
                                )}
                            </FormItem>
                            <FormItem key="email" label="Email Address"  {...formItemLayout}>
                                {getFieldDecorator("email", {initialValue: this.state.appointment ? this.state.appointment.email : null}, {
                                    rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}],
                                })(
                                    <Input placeholder="Email Address"/>
                                )}
                            </FormItem>

                        </div>}
                {/*// {*/}

                {/*//     label: "Patient Id",*/}
                {/*//     key: "patient_id",*/}
                {/*//     required: true,*/}
                {/*//     initialValue: this.state.appointment ? this.state.appointment.patient_id : null,*/}
                {/*//     type: INPUT_FIELD*/}
                {/*// },*/}
                
                {/*{*/}
                {/*label: "Notify Patient",
                {/*key: "notify_via_sms",
                {/*type: SINGLE_CHECKBOX_FIELD,*/}
                {/*initialValue: this.state.appointment ? this.state.appointment.notify_via_sms : false,*/}
                {/*follow: "Via SMS"*/}
                {/*}, {*/}
                {/*label: "Notify Patient",*/}
                {/*key: "notify_via_email",*/}
                {/*type: SINGLE_CHECKBOX_FIELD,*/}
                {/*initialValue: this.state.appointment ? this.state.appointment.notify_via_email : false,*/}
                {/*follow: "Via Email"*/}
                {/*}, */}
                <FormItem key="doctor" {...formItemLayout} label="Doctor">
                    {getFieldDecorator("doctor", {initialValue: this.state.appointment ? this.state.appointment.doctor : null}, {
                        rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}],
                    })(
                        <Select placeholder="Doctor">
                            {doctorOption.map((option) => <Select.Option
                                value={option.value}>{option.label}</Select.Option>)}
                        </Select>
                    )}
                </FormItem>
                <FormItem key="category" {...formItemLayout} label="Category">
                    {getFieldDecorator("category", {initialValue: this.state.appointment ? this.state.appointment.category : null}, {
                        rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}],
                    })(
                        <Select placeholder="Category">
                            {categoryOptions.map((option) => <Select.Option
                                value={option.value}>{option.label}</Select.Option>)}
                        </Select>
                    )}
                </FormItem>
                <FormItem key="procedure" {...formItemLayout} label="Procedures Planned">
                    {getFieldDecorator("procedure", {initialValue: this.state.appointment ? this.state.appointment.procedure : null}, {
                        rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}],
                    })(
                        <Select placeholder="Procedures Planned">
                            {procedureOption.map((option) => <Select.Option
                                value={option.value}>{option.label}</Select.Option>)}
                        </Select>
                    )}
                </FormItem>
                <FormItem key="notes" {...formItemLayout} label="Notes">
                    {getFieldDecorator("notes", {initialValue: this.state.appointment ? this.state.appointment.notes : null}, {
                        rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}],
                    })(
                        <Select placeholder="Notes">
                            {treatmentNotesOption.map((option) => <Select.Option
                                value={option.value}>{option.label}</Select.Option>)}
                        </Select>
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" >Submit</Button>
                </FormItem>
            </Form>
        </Card>
    }
}
