import React from "react";
import {
    Form,
    Input,
    Select,
    CheckBox,
    Alert,
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
    APPOINTMENT_PERPRACTICE_API, BLOCK_CALENDAR, CALENDER_SETTINGS, DOCTOR_VISIT_TIMING_API

} from "../../constants/api";
import {Checkbox, Radio} from "antd/lib/index";
import {displayMessage, getAPI, interpolate, postAPI, putAPI} from "../../utils/common";
import {Redirect} from "react-router-dom";
import {DAY_KEYS} from "../../constants/hardData";

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
            saving: false,
            doctorBlock: false,
            doctorOutsideAvailableTiming: false,
            practiceBlock: false,
            practiceOutsideAvailableTiming: false,
            timeToCheckBlock: {
                schedule_at: moment(),
                slot: 10,
            },
            procedureObjectsById: {}

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
        let that = this;
        this.loadDoctors();
        this.loadProcedureCategory();
        this.loadTreatmentNotes();
        this.loadAppointmentCategories();
        this.loadPracticeTiming()
        if (this.props.match.params.appointmentid) {
            this.loadAppointment();
        } else if (this.props.history && this.props.history.location.search) {
            let pairValueArray = this.props.history.location.search.substr(1).split('&');
            if (pairValueArray.length) {
                pairValueArray.forEach(function (item) {
                    let keyValue = item.split('=');
                    if (keyValue && keyValue.length == 2) {
                        if (keyValue[0] == 'patient' && keyValue[1]) {
                            that.handlePatientSelect(keyValue[1])
                        }
                    }
                });
            }
        }
    }

    loadPracticeTiming = () => {
        var that = this;
        let successFn = function (data) {
            let dataObject = {};
            if (data.length)
                dataObject = data[0];
            let timing = {};
            DAY_KEYS.forEach(function (dayKey) {
                timing[dayKey] = {};
                if (dataObject.visting_hour_same_week) {
                    timing[dayKey].startTime = moment(dataObject.first_start_time, 'HH:mm:ss');
                    timing[dayKey].endTime = moment(dataObject.second_end_time, 'HH:mm:ss');
                    if (dataObject.is_two_sessions) {
                        timing[dayKey].lunch = true;
                        timing[dayKey].lunchStartTime = moment(dataObject.first_end_time, 'HH:mm:ss');
                        timing[dayKey].lunchEndTime = moment(dataObject.second_start_time, 'HH:mm:ss');
                    } else {
                        timing[dayKey].lunch = false
                    }
                } else if (dataObject[dayKey]) {
                    timing[dayKey].startTime = moment(dataObject[`first_start_time_${dayKey}`], 'HH:mm:ss');
                    timing[dayKey].endTime = moment(dataObject[`second_end_time_${dayKey}`], 'HH:mm:ss');
                    if (dataObject[`is_two_sessions_${dayKey}`]) {
                        timing[dayKey].lunch = true;
                        timing[dayKey].lunchStartTime = moment(dataObject[`first_end_time_${dayKey}`], 'HH:mm:ss');
                        timing[dayKey].lunchEndTime = moment(dataObject[`second_start_time_${dayKey}`], 'HH:mm:ss');
                    } else {
                        timing[dayKey].lunch = false
                    }
                } else {
                    timing[dayKey] = null
                }
            });
            that.setState({
                calendarTimings: {...timing},
            }, function () {
                that.findOutsidePracticeTiming();
            });
        };
        let errorFn = function () {
            that.setState({
                calendarTimings: {}
            })
        };
        getAPI(interpolate(CALENDER_SETTINGS, [this.props.active_practiceId]), successFn, errorFn);
    }
    loadDoctorsTiming = () => {
        let that = this;
        let successFn = function (data) {
            let dataObject = {};
            if (data.length)
                dataObject = data[0];
            let timing = {};
            DAY_KEYS.forEach(function (dayKey) {
                timing[dayKey] = {};
                if (dataObject.visting_hour_same_week) {
                    timing[dayKey].startTime = moment(dataObject.first_start_time, 'HH:mm:ss');
                    timing[dayKey].endTime = moment(dataObject.second_end_time, 'HH:mm:ss');
                    if (dataObject.is_two_sessions) {
                        timing[dayKey].lunch = true;
                        timing[dayKey].lunchStartTime = moment(dataObject.first_end_time, 'HH:mm:ss');
                        timing[dayKey].lunchEndTime = moment(dataObject.second_start_time, 'HH:mm:ss');
                    } else {
                        timing[dayKey].lunch = false
                    }
                } else if (dataObject[dayKey]) {
                    timing[dayKey].startTime = moment(dataObject[`first_start_time_${dayKey}`], 'HH:mm:ss');
                    timing[dayKey].endTime = moment(dataObject[`second_end_time_${dayKey}`], 'HH:mm:ss');
                    if (dataObject[`is_two_sessions_${dayKey}`]) {
                        timing[dayKey].lunch = true;
                        timing[dayKey].lunchStartTime = moment(dataObject[`first_end_time_${dayKey}`], 'HH:mm:ss');
                        timing[dayKey].lunchEndTime = moment(dataObject[`second_start_time_${dayKey}`], 'HH:mm:ss');
                    } else {
                        timing[dayKey].lunch = false
                    }
                } else {
                    timing[dayKey] = null
                }
            });
            that.setState({
                doctorTimings: {...timing},
            }, function () {
                that.findOutsideDoctorTiming();
            });
        }
        let errorFn = function () {

        };
        if (that.state.timeToCheckBlock.doctor)
            getAPI(interpolate(DOCTOR_VISIT_TIMING_API, [this.props.active_practiceId]), successFn, errorFn, {
                doctor: that.state.timeToCheckBlock.doctor
            });
    }
    setBlockedTiming = (type, value) => {
        let that = this;
        if (type) {
            this.setState(function (prevState) {
                return {
                    timeToCheckBlock: {...prevState.timeToCheckBlock, [type]: value}
                }
            }, function () {
                that.findBlockedTiming();
                that.findOutsidePracticeTiming();
                if (type == 'doctor') {
                    that.loadDoctorsTiming();
                } else {
                    that.findOutsideDoctorTiming();
                }

            })
        }
    }
    findBlockedTiming = () => {
        let that = this;
        let successFn = function (data) {
            data.forEach(function (blockRow) {
                if (blockRow.doctor == null) {
                    that.setState({
                        practiceBlock: true
                    });
                } else if (blockRow.doctor == that.props.timeToCheckBlock.doctor) {
                    that.setState({
                        doctorBlock: true
                    });
                }
            });
        }
        let errorFn = function () {

        }
        getAPI(BLOCK_CALENDAR, successFn, errorFn, {
            practice: this.props.active_practiceId,
            cal_fdate: moment(that.state.timeToCheckBlock.schedule_at).format(),
            cal_tdate: moment(that.state.timeToCheckBlock.schedule_at).add(that.state.timeToCheckBlock.slot, 'minutes').format()
        })
    }
    findOutsidePracticeTiming = () => {
        let that = this;
        let flag = true;
        if (that.state.timeToCheckBlock.schedule_at && that.state.timeToCheckBlock.slot) {
            let schedule_at = that.state.timeToCheckBlock.schedule_at;
            let calendarTimings = that.state.calendarTimings;
            let dayValue = moment(schedule_at).isValid() ? moment(schedule_at).format('dddd').toLowerCase() : null;
            /**
             * Checking for Calendar Clinic Timings
             * */
            if (calendarTimings && dayValue && calendarTimings[dayValue]) {
                let daysTimings = calendarTimings[dayValue];
                if (daysTimings.lunch) {
                    if (
                        (moment(schedule_at, 'HH:mm:ss').format('HH:mm:ss') <= daysTimings.startTime.format('HH:mm:ss')
                            || moment(schedule_at, 'HH:mm:ss').format('HH:mm:ss') > daysTimings.endTime.format('HH:mm:ss')
                        ) || (
                            moment(schedule_at, 'HH:mm:ss').format('HH:mm:ss') < daysTimings.lunchEndTime.format('HH:mm:ss')
                            && moment(schedule_at, 'HH:mm:ss').format('HH:mm:ss') >= daysTimings.lunchStartTime.format('HH:mm:ss')
                        )
                    ) {
                        flag = false;
                    }
                } else {
                    if (moment(schedule_at, 'HH:mm:ss').format('HH:mm:ss') <= daysTimings.startTime.format('HH:mm:ss') || moment(schedule_at, 'HH:mm:ss').format('HH:mm:ss') > daysTimings.endTime.format('HH:mm:ss')) {
                        flag = false;
                    }
                }
            } else if (dayValue && !calendarTimings[dayValue]) {
                /**
                 * If the practice isnot opening for the day
                 * */
                flag = false;
            }

        }
        that.setState({
            practiceOutsideAvailableTiming: !flag
        })
    }
    findOutsideDoctorTiming = () => {
        let that = this;
        let flag = true;
        if (that.state.timeToCheckBlock.schedule_at && that.state.timeToCheckBlock.slot) {
            let schedule_at = that.state.timeToCheckBlock.schedule_at;
            let calendarTimings = that.state.doctorTimings;
            let dayValue = moment(schedule_at).isValid() ? moment(schedule_at).format('dddd').toLowerCase() : null;
            /**
             * Checking for Calendar Clinic Timings
             * */
            if (calendarTimings && dayValue && calendarTimings[dayValue]) {
                let daysTimings = calendarTimings[dayValue];
                if (daysTimings.lunch) {
                    if (
                        (moment(schedule_at, 'HH:mm:ss').format('HH:mm:ss') <= daysTimings.startTime.format('HH:mm:ss')
                            || moment(schedule_at, 'HH:mm:ss').format('HH:mm:ss') > daysTimings.endTime.format('HH:mm:ss')
                        ) || (
                            moment(schedule_at, 'HH:mm:ss').format('HH:mm:ss') < daysTimings.lunchEndTime.format('HH:mm:ss')
                            && moment(schedule_at, 'HH:mm:ss').format('HH:mm:ss') >= daysTimings.lunchStartTime.format('HH:mm:ss')
                        )
                    ) {
                        flag = false;
                    }
                } else {
                    if (moment(schedule_at, 'HH:mm:ss').format('HH:mm:ss') <= daysTimings.startTime.format('HH:mm:ss') || moment(schedule_at, 'HH:mm:ss').format('HH:mm:ss') > daysTimings.endTime.format('HH:mm:ss')) {
                        flag = false;
                    }
                }
            } else if (dayValue && calendarTimings && !calendarTimings[dayValue]) {
                /**
                 * If the practice isnot opening for the day
                 * */
                flag = false;
            }
        }
        that.setState({
            doctorOutsideAvailableTiming: !flag
        })
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
                timeToCheckBlock: data,
                loading: false,
            }, function () {
                that.findBlockedTiming();
                that.findOutsideDoctorTiming();
                that.loadDoctorsTiming();
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
            let doctor = [];
            data.staff.forEach(function (usersdata) {
                if (usersdata.role == DOCTORS_ROLE) {
                    doctor.push(usersdata);

                }
            });
            that.setState(function (prevState) {
                let selectedDoctor = null
                if (doctor.length) {
                    selectedDoctor = doctor[0].id
                }
                return {
                    practice_doctors: doctor,
                    timeToCheckBlock: {...prevState.timeToCheckBlock, doctor: selectedDoctor}
                }
            }, function () {
                that.findBlockedTiming();
                that.loadDoctorsTiming();
            });
        }
        let errorFn = function () {
        };
        getAPI(interpolate(PRACTICESTAFF, [this.props.active_practiceId]), successFn, errorFn);
    }

    loadProcedureCategory() {
        let that = this;
        let successFn = function (data) {
            let obj = {};
            data.forEach(function (item) {
                obj[item.id] = item
            })
            that.setState({
                procedure_category: data,
                procedureObjectsById: {...obj}
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
                formData.treatment_plans = []
                values.procedure.forEach(function (id) {
                    let item = that.state.procedureObjectsById[id];
                    formData.treatment_plans.push({
                        "procedure": item.id,
                        "cost": item.cost,
                        "quantity": 1,
                        "margin": item.margin,
                        "default_notes": item.default_notes,
                        "is_active": true,
                        "is_completed": false,
                        "discount": item.discount,
                        "discount_type": "%",
                    })
                });
                delete formData.procedure;
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
        if (event) {
            let that = this;
            let successFn = function (data) {
                that.setState({
                    patientDetails: data
                });
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
                            <DatePicker format="YYYY/MM/DD HH:mm" showTime
                                        onChange={(value) => this.setBlockedTiming("schedule_at", value)}/>
                        )}
                        {this.state.practiceOutsideAvailableTiming ?
                            <Alert message="Selected time is outside available clinic time!!" type="warning"
                                   showIcon/> : null}
                        {this.state.practiceBlock ?
                            <Alert message="Selected time is blocked in this clinic !!" type="warning"
                                   showIcon/> : null}
                    </FormItem>
                    <FormItem key="slot"
                              {...formItemLayout}
                              label="Time Slot">
                        {getFieldDecorator("slot", {
                            initialValue: this.state.appointment ? this.state.appointment.slot : 10,
                            rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}],
                        })(
                            <InputNumber min={1} onChange={(value) => this.setBlockedTiming("slot", value)}/>
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
                            <Select placeholder="Doctor"
                                    onChange={(value) => this.setBlockedTiming("doctor", value)}>
                                {doctorOption.map((option) => <Select.Option
                                    value={option.value}>{option.label}</Select.Option>)}
                            </Select>
                        )}
                        {this.state.doctorBlock ?
                            <Alert message="Selected time is blocked for selected doctor in this clinic!!"
                                   type="warning"
                                   showIcon/> : null}
                        {this.state.doctorOutsideAvailableTiming ?
                            <Alert message="Selected time is out of doctor's visit time in this clinic!!"
                                   type="warning"
                                   showIcon/> : null}
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
                        {getFieldDecorator("procedure", {initialValue: this.state.appointment ? this.state.appointment.procedure : []}, {
                            rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}],
                        })(
                            <Select placeholder="Procedures Planned" mode={"multiple"}>
                                {this.state.procedure_category && this.state.procedure_category.map((drug) =>
                                    <Select.Option
                                        value={drug.id}>{drug.name}</Select.Option>
                                )}
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
