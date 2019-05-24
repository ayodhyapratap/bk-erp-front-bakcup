import React from "react";
import {CHECKOUT_STATUS, ENGAGED_STATUS, SCHEDULE_STATUS, WAITING_STATUS} from "../../constants/hardData";
import {calendarSettingMenu} from "./calendarUtils";
import {Button, Icon, Dropdown, Row, Col, Divider, Spin, List, Popover} from "antd";
import {Link} from "react-router-dom";
import moment from "moment/moment";
import {APPOINTMENT_API, APPOINTMENT_PERPRACTICE_API} from "../../constants/api";
import {displayMessage, getAPI, interpolate, putAPI} from "../../utils/common";
import EventPatientPopover from "./EventPatientPopover";
import {ERROR_MSG_TYPE, SUCCESS_MSG_TYPE} from "../../constants/dataKeys";

export default class CalendarRightPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todaysAppointments: [],
            todaysFilteredAppointments: [],
            todaysAppointmentOverview: {},
            todaysAppointmentFilter: 'ALL'
        }
        this.todaysAppointments = this.todaysAppointments.bind(this);
    }

    componentDidMount() {
        this.todaysAppointments()
    }

    todaysAppointments = () => {
        let that = this;
        that.setState({
            loading: true
        });
        let successFn = function (data) {
            that.setState(function (prevState) {
                let appointmentOverview = {};
                let filteredAppointment = [];
                data.forEach(function (appointment) {
                    if (appointmentOverview[appointment.status]) {
                        appointmentOverview[appointment.status] += 1
                    } else {
                        appointmentOverview[appointment.status] = 1;
                    }
                    if (prevState.todaysAppointmentFilter == 'ALL') {
                        filteredAppointment.push(appointment)
                    } else if (prevState.todaysAppointmentFilter == appointment.status) {
                        filteredAppointment.push(appointment)
                    }
                });
                return {
                    todaysAppointments: data,
                    todaysAppointmentOverview: appointmentOverview,
                    todaysFilteredAppointments: filteredAppointment,
                    loading: false
                }
            });
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })
        }
        getAPI(interpolate(APPOINTMENT_PERPRACTICE_API, [this.props.active_practiceId]), successFn, errorFn, {
            start: moment().format('YYYY-MM-DD'),
            end: moment().format('YYYY-MM-DD')
        });
    }

    filterTodaysAppointment = (filterType) => {
        this.setState(function (prevState) {
            let filteredAppointment = [];
            prevState.todaysAppointments.forEach(function (appointment) {
                if (filterType == 'ALL') {
                    filteredAppointment.push(appointment)
                } else if (filterType == appointment.status) {
                    filteredAppointment.push(appointment)
                }
            });
            return {
                todaysFilteredAppointments: filteredAppointment,
                todaysAppointmentFilter: filterType
            }
        });
    }
    changeAppointmentStatus = (id, currentStatus, targetStatus) => {
        let that = this;
        let successFn = function (data) {
            if (data.status == currentStatus) {
                that.updateAppointmentStatus(id, currentStatus, targetStatus)
            } else {
                displayMessage(ERROR_MSG_TYPE, "Appointment status has already changed. Updating Appointments...")
                that.todaysAppointments();
            }
        }
        let errorFn = function () {

        }
        getAPI(interpolate(APPOINTMENT_API, [id]), successFn, errorFn);
    }
    updateAppointmentStatus = (id, currentStatus, targetStatus) => {
        let that = this;
        let reqData = {
            status: targetStatus
        }
        let successFn = function (data) {
            displayMessage(SUCCESS_MSG_TYPE, "Appointment Status Changed Successfully!!");
            that.todaysAppointments()
        }
        let errorFn = function () {

        }
        putAPI(interpolate(APPOINTMENT_API, [id]), reqData, successFn, errorFn
        )
    }

    render() {
        let that = this;
        return <div>
            <Dropdown overlay={calendarSettingMenu}>
                <Button block style={{margin: 5}}>
                    <Icon type="setting"/> Settings <Icon type="down"/>
                </Button>
            </Dropdown>
            <Link to='/calendar/create-appointment'>
                <Button block type="primary" style={{margin: 5}}> Walkin
                    Appointment</Button>
            </Link>
            <Row gutter={8}>
                <Col span={6}
                     onClick={() => this.filterTodaysAppointment(this.state.todaysAppointmentFilter == SCHEDULE_STATUS ? 'ALL' : SCHEDULE_STATUS)}
                     style={{
                         textAlign: 'center',
                         border: '1px solid #ccc',
                         borderRadius: '3px',
                         backgroundColor: (this.state.todaysAppointmentFilter == SCHEDULE_STATUS ? '#FF6600' : null),
                         color: (this.state.todaysAppointmentFilter == SCHEDULE_STATUS ? 'white' : '#FF6600'),
                         boxShadow: '0 2px 4px #111 inset'
                     }}>
                    <small>{SCHEDULE_STATUS}</small>
                    <h2 style={{color: (this.state.todaysAppointmentFilter == SCHEDULE_STATUS ? 'white' : '#FF6600')}}>{this.state.todaysAppointmentOverview[SCHEDULE_STATUS] ? this.state.todaysAppointmentOverview[SCHEDULE_STATUS] : 0}</h2>
                </Col>
                <Col span={6}
                     onClick={() => this.filterTodaysAppointment(this.state.todaysAppointmentFilter == WAITING_STATUS ? 'ALL' : WAITING_STATUS)}
                     style={{
                         textAlign: 'center',
                         border: '1px solid #ccc',
                         borderRadius: '3px',
                         backgroundColor: (this.state.todaysAppointmentFilter == WAITING_STATUS ? '#FC0000' : null),
                         color: (this.state.todaysAppointmentFilter == WAITING_STATUS ? 'white' : '#FC0000'),
                         boxShadow: '0 2px 4px #111 inset'
                     }}>
                    <small>{WAITING_STATUS}</small>
                    <h2 style={{color: (this.state.todaysAppointmentFilter == WAITING_STATUS ? 'white' : '#FC0000')}}>{this.state.todaysAppointmentOverview[WAITING_STATUS] ? this.state.todaysAppointmentOverview[WAITING_STATUS] : 0}</h2>
                </Col>
                <Col span={6}
                     onClick={() => this.filterTodaysAppointment(this.state.todaysAppointmentFilter == ENGAGED_STATUS ? 'ALL' : ENGAGED_STATUS)}
                     style={{
                         textAlign: 'center',
                         border: '1px solid #ccc',
                         borderRadius: '3px',
                         backgroundColor: (this.state.todaysAppointmentFilter == ENGAGED_STATUS ? '#598C01' : null),
                         color: (this.state.todaysAppointmentFilter == ENGAGED_STATUS ? 'white' : '#598C01'),
                         boxShadow: '0 2px 4px #111 inset'
                     }}>
                    <small>{ENGAGED_STATUS}</small>
                    <h2 style={{color: (this.state.todaysAppointmentFilter == ENGAGED_STATUS ? 'white' : '#598C01')}}>{this.state.todaysAppointmentOverview[ENGAGED_STATUS] ? this.state.todaysAppointmentOverview[ENGAGED_STATUS] : 0}</h2>
                </Col>
                <Col span={6}
                     onClick={() => this.filterTodaysAppointment(this.state.todaysAppointmentFilter == CHECKOUT_STATUS ? 'ALL' : CHECKOUT_STATUS)}
                     style={{
                         textAlign: 'center',
                         border: '1px solid #ccc',
                         borderRadius: '3px',
                         backgroundColor: (this.state.todaysAppointmentFilter == CHECKOUT_STATUS ? '#0094DE' : null),
                         color: (this.state.todaysAppointmentFilter == CHECKOUT_STATUS ? 'white' : '#0094DE'),
                         boxShadow: '0 2px 4px #111 inset'
                     }}>
                    <small>{CHECKOUT_STATUS}</small>
                    <h2 style={{color: (this.state.todaysAppointmentFilter == CHECKOUT_STATUS ? 'white' : '#0094DE')}}>{this.state.todaysAppointmentOverview[CHECKOUT_STATUS] ? this.state.todaysAppointmentOverview[CHECKOUT_STATUS] : 0}</h2>
                </Col>
            </Row>
            <Divider>Today's Apointment ({this.state.todaysFilteredAppointments.length})
            </Divider>
            <Spin spinning={this.state.loading}>
                <List
                    size={'small'}
                    dataSource={this.state.todaysFilteredAppointments}
                    renderItem={(apppointment) => <List.Item
                        color={'transparent'}
                        style={{padding: 0}}>
                        <div
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                backgroundColor: '#eee',
                                width: '100%',
                                marginTop: '2px',
                                borderLeft: '5px solid' + (apppointment.doctor && that.props.doctors_object && that.props.doctors_object[apppointment.doctor] ? that.props.doctors_object[apppointment.doctor].calendar_colour : 'transparent')
                            }}>
                            <AppointmentCard {...apppointment}
                                             changeAppointmentStatus={this.changeAppointmentStatus}/>
                        </div>
                    </List.Item>
                    }/>
            </Spin>
            <h3></h3>
        </div>
    }
}

function

AppointmentCard(appointment) {
    return <div style={{width: '100%'}}>

        <p style={{marginBottom: 0}}>
            <Popover placement="right"
                     content={<EventPatientPopover appointmentId={appointment.id}
                                                   key={appointment.id}/>}>
            <span
                style={{width: 'calc(100% - 60px)'}}><b>{moment(appointment.schedule_at).format("LT")}</b>&nbsp;
                {appointment.patient.user.first_name}</span>
            </Popover>
            {appointment.status == SCHEDULE_STATUS ?
                <span style={{width: '70px', float: 'right'}}>
                    <a onClick={() => appointment.changeAppointmentStatus(appointment.id, SCHEDULE_STATUS, WAITING_STATUS)}> Check In</a></span> : null}
            {appointment.status == WAITING_STATUS ?
                <span style={{width: '70px', float: 'right'}}>
                    <a onClick={() => appointment.changeAppointmentStatus(appointment.id, WAITING_STATUS, ENGAGED_STATUS)}> Engage</a></span> : null}
            {appointment.status == ENGAGED_STATUS ?
                <span style={{width: '70px', float: 'right'}}>
                    <a onClick={() => appointment.changeAppointmentStatus(appointment.id, ENGAGED_STATUS, CHECKOUT_STATUS)}> Check Out</a></span> : null}
            {appointment.status == CHECKOUT_STATUS ?
                <span style={{width: '70px', float: 'right'}}>
                    <small>Checked Out</small></span> : null}

        </p>
    </div>;
}
