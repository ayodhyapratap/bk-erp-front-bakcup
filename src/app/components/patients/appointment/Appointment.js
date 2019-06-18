import React from "react";
import {Route} from "react-router";
import {} from "react-router-dom";

import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Button, Card, Checkbox, Divider, Form, Icon, Row, Table, Tag, Popconfirm} from "antd";
import {
    CHECKBOX_FIELD,
    DATE_PICKER,
    NUMBER_FIELD,
    SUCCESS_MSG_TYPE,
    INPUT_FIELD,
    RADIO_FIELD,
    SELECT_FIELD,
    DOCTORS_ROLE
} from "../../../constants/dataKeys";
import {
    PATIENTS_LIST,
    PATIENT_PROFILE,
    APPOINTMENT_PERPRACTICE_API,
    PROCEDURE_CATEGORY,
    PRACTICESTAFF, EMR_TREATMENTNOTES, APPOINTMENT_API, APPOINTMENT_REPORTS, SINGLE_APPOINTMENT_PERPRACTICE_API
} from "../../../constants/api";
import {getAPI, interpolate, displayMessage, putAPI, postAPI} from "../../../utils/common";
import {Redirect, Link} from 'react-router-dom'
import moment from 'moment';


class Appointment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
            appointments: null,
            practice_doctors: [],
            procedure_category: null,
            treatmentNotes: null,
            practice_staff: [],
            loading: false

        }
        this.changeRedirect = this.changeRedirect.bind(this);
        this.editAppointment = this.editAppointment.bind(this);
        this.deleteAppointment = this.deleteAppointment.bind(this);
        this.loadProcedureCategory = this.loadProcedureCategory.bind(this);
        this.loadDoctors = this.loadDoctors.bind(this);

    }

    componentDidMount() {
        this.loadProcedureCategory();
        this.loadDoctors();
        this.loadTreatmentNotes();
        if (this.props.match.params.appointmentid) {
            this.loadAppointment(this.props.match.params.appointmentid);
        }
        else {
            this.loadAllAppointments();
        }

        console.log("id", this.props.match.params.id);
    }

    loadAppointment(id) {
        let that = this;
        this.setState({
            loading: true,
        })
        let successFn = function (data) {

            that.setState({
                appointments: [data],
                loading: false,

            });
            console.log("log", that.state.appointments)

        }

        let errorFn = function () {
            that.setState({
                loading: false,

            })

        }
        getAPI(interpolate(APPOINTMENT_API, [id]), successFn, errorFn);

    }

    loadAllAppointments() {
        let that = this;
        this.setState({
            loading: true,
        })
        let successFn = function (data) {
            // console.log("DataKya h",data);
            let appointmentArray = data;
            // appointmentArray.push(data);
            // console.log("AppointmentArray",JSON.stringify(appointmentArray));
            that.setState({
                appointments: appointmentArray.data,
                loading: false,

            });
            // console.log("appointment", JSON.stringify(that.state.appointments));

        }

        let errorFn = function () {
            that.setState({
                loading: false,

            })


        }
        getAPI(interpolate(APPOINTMENT_REPORTS, [this.props.active_practiceId]), successFn, errorFn, this.props.match.params.id ? {"patient": this.props.match.params.id} : {});

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
        getAPI(interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]), successFn, errorFn);
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

    loadTreatmentNotes() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                treatmentNotes: data,
                loading: false
            })

        }
        let errorFn = function () {
            that.setState({
                loading: false
            })

        }
        getAPI(interpolate(EMR_TREATMENTNOTES, [this.props.active_practiceId]), successFn, errorFn)
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    editAppointment(record) {

        let id = record.id;
        this.props.history.push("/calendar/" + id + "/edit-appointment")

    }

    deleteAppointment(record) {
        let that = this;
        let reqData = {'is_active': false, 'status': "Cancelled"}
        let successFn = function (data) {
            that.setState({})

        }
        let errorFn = function () {
        }
        putAPI(interpolate(APPOINTMENT_API, [record.id]), reqData, successFn, errorFn);
    }

    render() {
        const procedures = {}
        if (this.state.procedure_category) {
            this.state.procedure_category.forEach(function (procedure) {
                procedures[procedure.id] = procedure.name;
            })
        }
        const doctors = []
        if (this.state.practice_doctors.length) {
            this.state.practice_doctors.forEach(function (doctor) {
                doctors[doctor.id] = doctor.user.first_name
            })
        }
        const treatmentNotes = [];
        if (this.state.treatmentNotes) {
            this.state.treatmentNotes.forEach(function (treatmentNote) {
                treatmentNotes[treatmentNote.id] = treatmentNote.name
            })
        }
        const categories = {1: "fast", 2: "Full Stomach", 3: "No Liquids"}
        const columns = [{
            title: 'Schedule Time',
            key: 'name',
            render: (text, record) => (<span>{moment(record.schedule_at).format('LLL')},{record.slot}mins</span>
            )
        }, {
            title: 'Patient ID',
            dataIndex: 'patient.id',
            key: 'patient_id',
        }, {
            title: 'Patient Name',
            dataIndex: 'patient.user.first_name',
            key: 'patient_name',
        }, {
            title: 'Patient Mobile',
            dataIndex: 'patient.user.mobile',
            key: 'patient_mobile',
        }, {
            title: 'Email',
            dataIndex: 'patient.user.email',
            key: 'email',
        }, {
            title: 'Doctor',
            key: 'doctor',
            render: (text, record) => (
                <span> {doctors[record.doctor]}</span>
            )
        }, {
            title: 'Procedure',
            key: 'procedure',
            render: (text, record) => (
                <span> {procedures[record.procedure]}</span>
            )
        }, {
            title: 'Treatment Notes',
            key: 'notes',
            render: (text, record) => (
                <span> {treatmentNotes[record.notes]}</span>
            )
        }, {
            title: 'Category',
            key: 'category',
            render: (text, record) => (
                <span> {categories[record.category]}</span>
            )
        }, {
            title: 'NotifyByEmail',
            key: 'notify_via_email',
            render: (text, record) => (
                <Checkbox disabled checked={record.notify_via_email}/>
            )
        }, {
            title: 'NotifyBySMS',
            key: 'notify_via_sms',
            render: (text, record) => (
                <Checkbox disabled checked={record.notify_via_sms}/>
            )
        },

            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <span>
                <a onClick={() => this.editAppointment(record)}>Edit</a>
                <Divider type="vertical"/>
                <Popconfirm title="Are you sure delete this item?"
                            onConfirm={() => this.deleteAppointment(record)} okText="Yes" cancelText="No">
                    <a>Delete</a>
                </Popconfirm>


              </span>
                ),
            }];
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        if (this.props.match.params.id) {
            return <Card extra={<Link to={"/calendar/create-appointment?patient=" + this.props.match.params.id}>
                <Button type="primary">
                    <Icon type="plus"/>&nbsp;Add Appointment</Button>
            </Link>}>
                <Table loading={this.state.loading} columns={columns} scroll={{x: 1300}}
                       dataSource={this.state.appointments}/>


            </Card>
        }
        return <Card extra={<Link to="/calendar/create-appointment">
            <Button type="primary">
                <Icon type="plus"/>&nbsp;Add Appointment</Button>
        </Link>}>
            <Table loading={this.state.loading} columns={columns} scroll={{x: 1300}}
                   dataSource={this.state.appointments}/>


        </Card>
    }

}

export default Appointment;
