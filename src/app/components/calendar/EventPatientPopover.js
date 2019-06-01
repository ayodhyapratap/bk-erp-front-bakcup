import React from "react";
import {Spin, Row, Col, Avatar, Icon, Button, Divider} from "antd";
import {getAPI, interpolate} from "../../utils/common";
import {APPOINTMENT_API, PATIENT_PROFILE} from "../../constants/api";
import {Link} from "react-router-dom";
import moment from "moment";

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
        } else {
            this.setState({
                loading: false
            });
        }
    }

    render() {
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
                        <Row style={{height: '100px', overflow: 'scroll', backgroundColor: '#eee', padding: 5}}>

                        </Row>
                        <Divider style={{margin: 0}}/>
                        <Row style={{textAlign: 'right'}}>
                            <Button.Group size={"small"}>
                                <Button>
                                    <Link to={"/calendar/" + this.state.appointment.id + "/edit-appointment"}>
                                        <Icon type={"edit"}/> Edit
                                    </Link>
                                </Button>

                                <Button>
                                    <Icon type={"cross"}/> Cancel
                                </Button>
                            </Button.Group>
                        </Row>
                    </div> :
                    <h4>No Patient Found</h4>}
            </Spin>
        </div>
    }
}
