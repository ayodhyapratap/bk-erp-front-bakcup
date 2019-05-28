import React from "react";
import {
    Form,
    Input,
    Select,
    CheckBox,
    DatePicker,
    Button,
    InputNumber,
    Card,
    List,
    Avatar,
    AutoComplete, Spin
} from 'antd';
import {REQUIRED_FIELD_MESSAGE} from "../../constants/messages";
import moment from "moment/moment";
import {DOCTORS_ROLE, SUCCESS_MSG_TYPE} from "../../constants/dataKeys";
import {
    APPOINTMENT_API,
    APPOINTMENT_CATEGORIES,
    EMR_TREATMENTNOTES,
    PRACTICESTAFF, PROCEDURE_CATEGORY,
    SEARCH_PATIENT,
    ALL_APPOINTMENT_API,
    PATIENT_PROFILE,
    APPOINTMENT_PERPRACTICE_API

} from "../../constants/api";
import {Checkbox, Radio} from "antd/lib/index";
import {displayMessage, getAPI, interpolate, postAPI, putAPI} from "../../utils/common";
import {Redirect} from "react-router-dom";

const {TextArea} = Input;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const {Meta} = Card;
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
            patientDetails: null,
            appointmentDetail: null,
            saving: false
        }
        this.changeRedirect = this.changeRedirect.bind(this);
        this.loadDoctors = this.loadDoctors.bind(this);
        this.loadProcedureCategory = this.loadProcedureCategory.bind(this);
        this.loadTreatmentNotes = this.loadTreatmentNotes.bind(this);
        this.searchPatient = this.searchPatient.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadAppointment = this.loadAppointment.bind(this);
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
                patientDetails: data.patient,
                loading: false,
            });
            console.log("appointment list");
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
            // console.log("category",that.state.procedure_category);

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
                // console.log("list",that.state.patientListData);
            }
        };
        let errorFn = function () {
        };
        getAPI(interpolate(SEARCH_PATIENT, [value]), successFn, errorFn);
    }

    handleSubmit = (e) => {
        let that = this;
        let patient = {};
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                that.setState({
                    saving: true
                });
                let formData = {...values};
                formData.patient = {user: {}};
                if (!this.state.patientDetails) {
                    formData.patient.user.first_name = formData.patient_name;
                    formData.patient.user.email = formData.patient_email;
                    formData.patient.user.mobile = formData.patient_mobile;
                    formData.patient_email = undefined;
                    formData.patient_name = undefined;
                    formData.patient_mobile = undefined;
                } else {
                    formData.patient = this.state.patientDetails;
                }
                formData.practice = that.props.active_practiceId;
                console.log(formData);
                let successFn = function (data) {
                    that.setState({
                        saving: false
                    });
                    if (that.props.history)
                        that.props.history.goBack();
                    if (that.props.loadData)
                        that.props.loadData();
                    if (data) {
                        // console.log(data)
                        displayMessage(SUCCESS_MSG_TYPE, "Appointment Created Successfully");
                    }
                };
                let errorFn = function () {
                    that.setState({
                        saving: false
                    });
                };
                if (this.state.appointment) {
                    putAPI(interpolate(APPOINTMENT_API, [this.state.appointment.id]), formData, successFn, errorFn);
                } else {
                    postAPI(ALL_APPOINTMENT_API, formData, successFn, errorFn);
                }
            }
        });

    }
    handlePatientSelect = (event) => {
        console.log(event);
        if (event) {
            let that = this;
            let successFn = function (data) {
                that.setState({
                    patientDetails: data

                });
                // console.log("event",that.state.patientDetails);
            };
            let errorFn = function () {
            };
            getAPI(interpolate(PATIENT_PROFILE, [event]), successFn, errorFn);
        }
    }
    handleChange = (event) => {
        this.setState({})

        // this.setState({ value: event.target.value });
    };
    handleClick = (e) => {

        this.setState({
            patientDetails: null
        })

    }

    render() {
        const that = this;
        const formItemLayout = (this.props.formLayout ? this.props.formLayout : {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        });
        const formPatients = (this.props.formLayout ? this.props.formLayout : {
            wrapperCol: {offset: 6, span: 14},
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
                doctorOption.push({label: (drug.user.first_name + "(" + drug.user.email + ")"), value: drug.id});
            })
        }
        const treatmentNotesOption = [];
        if (this.state.treatmentNotes) {
            this.state.treatmentNotes.forEach(function (drug) {
                treatmentNotesOption.push({label: drug.name, value: drug.id});
            })
        }
        // console.log("doctor list",JSON.stringify(this.state.treatmentNotes));
        const categoryOptions = [];
        if (this.state.appointmentCategories) {
            this.state.appointmentCategories.forEach(function (category) {
                categoryOptions.push({label: category.name, value: category.id});
            })
        }
        let appointmentTime = this.state.appointment ? this.state.appointment.schedule_at : this.props.startTime;
        if (!appointmentTime) {
            appointmentTime = new moment(new Date()).format();
            console.log(appointmentTime);
        }
        const fields = [];
        return <Card loading={this.state.loading}>
            <Spin spinning={this.state.saving}>
                <Form onSubmit={this.handleSubmit}>
                    {this.props.title ? <h2>{this.props.title}</h2> : null}
                    <FormItem key="schedule_at" label="Appointment Schedule" {...formItemLayout}>
                        {getFieldDecorator("schedule_at",
                            {
                                initialValue: appointmentTime ? moment(appointmentTime) : null,
                                rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}],
                            })(
                            <DatePicker format="YYYY/MM/DD HH:mm" showTime/>
                        )}
                    </FormItem>
                    <FormItem key="slot"
                              {...formItemLayout}
                              label="Time Slot">
                        {getFieldDecorator("slot", {
                            initialValue: this.state.appointment ? this.state.appointment.slot : 10,
                            rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}],
                        })(
                            <InputNumber min={1}/>
                        )}
                        <span className="ant-form-text">mins</span>
                    </FormItem>


                    {this.state.patientDetails ?
                        <FormItem key="id" value={this.state.patientDetails.id} {...formPatients}>
                            <Card bordered={false} style={{background: '#ECECEC'}}>
                                <Meta
                                    avatar={<Avatar style={{backgroundColor: '#ffff'}}
                                                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                                    title={this.state.patientDetails.user.first_name}
                                    description={this.state.patientDetails.user.mobile}

                                />

                                <Button type="primary" style={{float: 'right'}} onClick={this.handleClick}>Add New
                                    Patient</Button>
                            </Card>
                        </FormItem>
                        : <div>
                            <FormItem key="patient_name" label="Patient Name"  {...formItemLayout}>
                                {getFieldDecorator("patient_name", {
                                    initialValue: this.state.appointment ? this.state.appointment.patient.user.first_name : null,
                                    rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}],
                                })(
                                    <AutoComplete placeholder="Patient Name"
                                                  showSearch
                                                  onSearch={this.searchPatient}
                                                  defaultActiveFirstOption={false}
                                                  showArrow={false}
                                                  filterOption={false}
                                        // onChange={this.handleChange}
                                                  onSelect={this.handlePatientSelect}>
                                        {this.state.patientListData.map((option) => <AutoComplete.Option
                                            value={option.id.toString()}>
                                            <List.Item style={{padding: 0}}>
                                                <List.Item.Meta
                                                    avatar={<Avatar
                                                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                                                    title={option.user.first_name + " (" + option.user.id + ")"}
                                                    description={option.user.mobile}
                                                />

                                            </List.Item>
                                        </AutoComplete.Option>)}
                                    </AutoComplete>
                                )}
                            </FormItem>
                            <FormItem key="patient_mobile" label="Mobile Number"   {...formItemLayout}>
                                {getFieldDecorator("patient_mobile", {
                                    initialValue: this.state.appointment ? this.state.appointment.patient.user.mobile : null,
                                    rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}],
                                })(
                                    <Input placeholder="Mobile Number"
                                    />
                                )}
                            </FormItem>
                            <FormItem key="patient_email" label="Email Address"  {...formItemLayout}>
                                {getFieldDecorator("patient_email", {
                                    initialValue: this.state.appointment ? this.state.appointment.patient.user.email : null,
                                    rules: [{type: 'email', message: 'The input is not valid E-mail!'},
                                        {required: true, message: REQUIRED_FIELD_MESSAGE}],
                                })(
                                    <Input placeholder="Email Address"/>
                                )}
                            </FormItem>

                        </div>}
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
                            <Select placeholder="Procedures Planned"  >
                                {procedureOption.map((option) => <Select.Option
                                    value={option.value}>{option.label}</Select.Option>)}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem key="notes" {...formItemLayout} label="Notes">
                        {getFieldDecorator("notes", {initialValue: this.state.appointment ? this.state.appointment.notes : null}, {
                            rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}],
                        })(
                            <Input placeholder="Notes"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}>
                        <Button loading={that.state.saving} type="primary" htmlType="submit" style={{margin: 5}}>
                            Submit
                        </Button>
                        {that.props.history ?
                            <Button style={{margin: 5}} onClick={() => that.props.history.goBack()}>
                                Cancel
                            </Button> : null}
                    </FormItem>
                </Form>
            </Spin>
        </Card>
    }
}
