import React from "react";
import {Spin, Row, Col, Avatar, Icon, Button, Divider, Tag, Popconfirm} from "antd";
import {displayMessage, getAPI, interpolate, putAPI} from "../../utils/common";
import {APPOINTMENT_API} from "../../constants/api";
import {Link} from "react-router-dom";
import moment from "moment";
import {
    CANCELLED_STATUS,
    CHECKOUT_STATUS,
    ENGAGED_STATUS,
    SCHEDULE_STATUS,
    WAITING_STATUS
} from "../../constants/hardData";
import {ERROR_MSG_TYPE, SUCCESS_MSG_TYPE} from "../../constants/dataKeys";

export default class EventPatientPopover extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            appointment: null
        }
    }

    componentDidMount() {
        console.log(this.props);
        if (this.props.appointmentId) {
            this.loadAppointmentDetails();
        } else {
            this.setState({
                loading: false
            });
        }
    }

    loadAppointmentDetails = () => {
        this.setState({
            loading: true
        })
        let that = this;
        let successFn = function (data) {
            that.setState({
                appointment: data,
                loading: false
            });
            console.log("event", data)
        };
        let errorFn = function () {
            that.setState({
                loading: false
            });
        };
        getAPI(interpolate(APPOINTMENT_API, [this.props.appointmentId]), successFn, errorFn);


    }
    updateAppointmentStatus = (id, currentStatus, targetStatus) => {
        let that = this;
        let reqData = {
            status: targetStatus
        };
        if (targetStatus == WAITING_STATUS) {
            reqData.waiting = moment().format()
        } else if (targetStatus == ENGAGED_STATUS) {
            reqData.engaged = moment().format()
        } else if (targetStatus == CHECKOUT_STATUS) {
            reqData.checkout = moment().format()
        }
        let successFn = function (data) {
            displayMessage(SUCCESS_MSG_TYPE, "Appointment Status Changed Successfully!!");
            that.loadAppointmentDetails()
        }
        let errorFn = function () {

        }
        putAPI(interpolate(APPOINTMENT_API, [id]), reqData, successFn, errorFn
        )
    }

    changeAppointmentStatus = (id, currentStatus, targetStatus) => {
        let that = this;
        let successFn = function (data) {
            if (data.status == currentStatus) {
                that.updateAppointmentStatus(id, currentStatus, targetStatus)
            } else {
                displayMessage(ERROR_MSG_TYPE, "Appointment status has already changed. Updating Appointments...")
                that.loadAppointmentDetails();
            }
        }
        let errorFn = function () {

        }
        getAPI(interpolate(APPOINTMENT_API, [id]), successFn, errorFn);
    }

    render() {
        let that = this;
        let appointment = this.state.appointment;
        return <div style={{width: '300px', minHeight: '200px'}}>
            <Spin spinning={this.state.loading}>
                {this.state.appointment ? <div>
                        <Row>
                            <Col span={8}>
                                <Avatar src={this.state.appointment.patient.image} size={80}/>
                            </Col>
                            <Col span={16}>
                                <Link to={"/patient/" + this.state.appointment.patient.id + "/profile"}>
                                    <h3>{this.state.appointment.patient.user.first_name}
                                        <br/>
                                        <small>
                                            Patient
                                            ID: {this.state.appointment.patient.id} , {this.state.appointment.patient.gender}
                                            <br/>{this.state.appointment.patient.user.mobile}
                                        </small>
                                    </h3>
                                </Link>
                            </Col>
                        </Row>
                        <Divider style={{margin: 0}}/>
                        <small>Status: {this.state.appointment.status}</small>
                        <br/>
                        <small>
                            <Icon
                                type="clock-circle"/> {moment(this.state.appointment.schedule_at).format('HH:mm A on MMMM Do')} for {this.state.appointment.slot} mins.
                        </small>
                        {showStatusTimeline(appointment)}
                        <Row style={{height: '100px', overflow: 'scroll', backgroundColor: '#eee', padding: 5}}>
                            <div>
                                {appointment.status == SCHEDULE_STATUS ?
                                    <span style={{width: '70px', float: 'right'}}>
                    <a onClick={() => that.changeAppointmentStatus(appointment.id, SCHEDULE_STATUS, WAITING_STATUS)} disabled={that.props.activePracticePermissions.ChangeAppointmentStatus}> Check In</a></span> : null}
                                {appointment.status == WAITING_STATUS ?
                                    <span style={{width: '70px', float: 'right'}}>
                    <a onClick={() => that.changeAppointmentStatus(appointment.id, WAITING_STATUS, ENGAGED_STATUS)} disabled={that.props.activePracticePermissions.ChangeAppointmentStatus}> Engage</a></span> : null}
                                {appointment.status == ENGAGED_STATUS ?
                                    <span style={{width: '70px', float: 'right'}}>
                    <a onClick={() => that.changeAppointmentStatus(appointment.id, ENGAGED_STATUS, CHECKOUT_STATUS)} disabled={that.props.activePracticePermissions.ChangeAppointmentStatus}> Check Out</a></span> : null}
                                {appointment.status == CHECKOUT_STATUS ?
                                    <span style={{width: '70px', float: 'right'}}>
                    <small>Checked Out</small></span> : null}
                                {this.state.appointment.doctor_data ? <Tag
                                    color={this.state.appointment.doctor_data ? this.state.appointment.doctor_data.calendar_colour : null}>
                                    <b>{"With " + this.state.appointment.doctor_data.user.first_name} </b>
                                </Tag> : null}
                            </div>
                            <Divider style={{margin: 0}}/>
                            <b>Category:</b>{this.state.appointment.category_data ? this.state.appointment.category_data.name : null}
                        </Row>
                        <Divider style={{margin: 0}}/>
                        <Row style={{textAlign: 'right'}}>
                            <Button.Group size={"small"}>
                                {that.props.activePracticePermissions.EditAppointment || that.props.allowAllPermissions ?
                                <Button>
                                    <Link to={"/calendar/" + this.state.appointment.id + "/edit-appointment"}>
                                        <Icon type={"edit"}/> Edit
                                    </Link>
                                </Button>:null}
                                {that.props.activePracticePermissions.ChangeAppointmentStatus || that.props.allowAllPermissions?
                                <Popconfirm title="Are you sure delete this?"
                                            onConfirm={() => that.changeAppointmentStatus(appointment.id, appointment.status, CANCELLED_STATUS)}
                                            okText="Yes" cancelText="No">
                                    <Button type={"danger"}>
                                        <Icon type={"cross"}/> Cancel
                                    </Button>
                                </Popconfirm>:null}
                            </Button.Group>
                        </Row>
                    </div> :
                    <h4>No Patient Found</h4>}
            </Spin>
        </div>
    }
}

function showStatusTimeline(appointment) {
    switch (appointment.status) {
        case WAITING_STATUS:
            return <div>
                <br/><small>Checked in At {moment(appointment.waiting).format('lll')}</small>
            </div>
        case ENGAGED_STATUS:
            return <div>
                <small>Waiting Time {moment(appointment.engaged).from(moment(appointment.waiting))}</small>
                <br/><small>Engaged At {moment(appointment.engaged).format('lll')}</small>
            </div>
        case CHECKOUT_STATUS:
            return <div>
                <small>Waiting Time {moment(appointment.engaged).from(moment(appointment.waiting))}</small>
                <br/><small>Engaged Time {moment(appointment.checkout).from(moment(appointment.engaged))}</small>
                <br/><small>Total Stay Time {moment(appointment.checkout).from(moment(appointment.waiting))}</small>
            </div>
    }
    return null
}
