import React from "react";
import {
    CANCELLED_STATUS,
    CHECKOUT_STATUS,
    ENGAGED_STATUS,
    SCHEDULE_STATUS,
    WAITING_STATUS
} from "../../constants/hardData";
import {calendarSettingMenu} from "../../utils/calendarUtils";
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
            todaysAppointmentFilter: 'ALL',
            selectedDate: moment()
        }
        this.todaysAppointments = this.todaysAppointments.bind(this);
    }

    componentDidMount() {
        this.todaysAppointments()
    }

    changeDate = (option) => {
        let that = this;
        this.setState(function (prevState) {
            if (option)
                return {selectedDate: prevState.selectedDate.add(1, 'days')};
            return {selectedDate: prevState.selectedDate.subtract(1, 'days')};

        }, function () {
            that.todaysAppointments();
        })

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
                    if (appointment.status == CANCELLED_STATUS) {
                        return true;
                    }
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
            start: that.state.selectedDate.format('YYYY-MM-DD'),
            end: that.state.selectedDate.format('YYYY-MM-DD')
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
        };
        if(targetStatus==WAITING_STATUS){
            reqData.waiting=moment().format()
        }else if(targetStatus==ENGAGED_STATUS){
            reqData.engaged=moment().format()
        }else if(targetStatus==CHECKOUT_STATUS){
            reqData.checkout=moment().format()
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
            <Dropdown trigger={'click'} overlay={calendarSettingMenu}>
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
            <Divider>
                <a type="primary" onClick={() => this.changeDate(false)}><Icon type="left"/></a>&nbsp;
                {this.state.selectedDate.format("MMM Do") == moment().format("MMM Do") ? 'Today' : this.state.selectedDate.format("MMM Do")}'s
                Schedule ({this.state.todaysFilteredAppointments.length})
                &nbsp;<a type="primary" onClick={() => this.changeDate(true)}><Icon type="right"/></a>
            </Divider>
            <Spin spinning={this.state.loading}>
                <List
                    size={'small'}
                    dataSource={this.state.todaysFilteredAppointments}
                    renderItem={(apppointment) => (apppointment.status == CANCELLED_STATUS ? <div/> : <List.Item
                        color={'transparent'}
                        style={{padding: 0}}>
                        <div
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                textDecoration: (apppointment.status == CANCELLED_STATUS ? 'line-through' : 'inherit'),
                                backgroundColor: (apppointment.status == CANCELLED_STATUS ? '#aaa' : '#eee'),
                                width: '100%',
                                marginTop: '2px',
                                borderLeft: '5px solid' + (apppointment.doctor && that.props.doctors_object && that.props.doctors_object[apppointment.doctor] ? that.props.doctors_object[apppointment.doctor].calendar_colour : 'transparent')
                            }}>
                            <AppointmentCard {...apppointment}
                                             changeAppointmentStatus={this.changeAppointmentStatus}/>
                        </div>
                    </List.Item>)
                    }/>
            </Spin>
        </div>
    }
}

function AppointmentCard(appointment) {
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
