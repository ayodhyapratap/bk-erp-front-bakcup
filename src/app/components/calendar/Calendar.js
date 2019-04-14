import React, {Component} from "react";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import BigCalendar from 'react-big-calendar'
import {Card, Row, Timeline, Col, Popover, Button, List, Divider, Layout, Badge, Spin} from "antd"
import {DOCTORS_ROLE, SUCCESS_MSG_TYPE,} from "../../constants/dataKeys";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./app.css";
import {Route, Link, Switch} from "react-router-dom";
import CreateAppointment from "./CreateAppointment";
import TimeGrid from 'react-big-calendar/lib/TimeGrid'
import dates from 'date-arithmetic'
import {getAPI, putAPI, interpolate, displayMessage} from "../../utils/common";
import {APPOINTMENT_PERPRACTICE_API, APPOINTMENT_API, PRACTICESTAFF, CALENDER_SETTINGS} from "../../constants/api";

const localizer = BigCalendar.momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(BigCalendar)
const {Content} = Layout;


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: null,
            visiblePopover: false,
            events: [],
            appointments: [],
            practice_doctors: [],
            practice_staff: [],
            doctors_object: null,
            calendarTimings: null,
            loading:true
        };
        this.onSelectSlot = this.onSelectSlot.bind(this);
        this.onSelectEvent = this.onSelectEvent.bind(this);
        this.moveEvent = this.moveEvent.bind(this)
        this.resizeEvent = this.resizeEvent.bind(this);
        this.loadDoctors = this.loadDoctors.bind(this);
        this.eventStyleGetter = this.eventStyleGetter.bind(this);
        this.loadCalendarTimings = this.loadCalendarTimings.bind(this);
        this.loadDoctors();
        this.appointmentList(moment().subtract(1, 'days'), moment().add(5, 'days'));
        this.loadCalendarTimings()
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
                } else {
                    let doctor = that.state.practice_staff;
                    doctor.push(usersdata);
                    that.setState({
                        practice_staff: doctor,
                    })
                }
            })
            let doctor_object = {}
            if (that.state.practice_doctors) {
                that.state.practice_doctors.forEach(function (drug) {
                    doctor_object[drug.id] = drug;
                })
            }
            console.log(doctor_object);
            that.setState({
                doctors_object: doctor_object,
            })
        }
        let errorFn = function () {
        };
        getAPI(interpolate(PRACTICESTAFF, [this.props.active_practiceId]), successFn, errorFn);
    }

    loadCalendarTimings() {
        var that = this;
        let successFn = function (data) {
            console.log("get table");
            that.setState({
                calendarTimings: data[0],
                loading:false
            })
        };
        let errorFn = function () {
            that.setState({
                loading:false
            })
        };
        getAPI(interpolate(CALENDER_SETTINGS, [this.props.active_practiceId]), successFn, errorFn);
    }

    /***
     * Calenders Functions
     * */


    moveEvent({event, start, end, isAllDay: droppedOnAllDaySlot}) {
        const {events} = this.state;
        const idx = events.indexOf(event)
        let allDay = event.allDay
        let that = this;
        if (!event.allDay && droppedOnAllDaySlot) {
            allDay = true
        } else if (event.allDay && !droppedOnAllDaySlot) {
            allDay = false
        }
        const updatedEvent = {...event, start, end, allDay}
        const nextEvents = [...events]
        let changedEvent = {
            // "id": event.id,
            "schedule_at": moment(start).format("YYYY-MM-DD HH:mm:ss"),
            "slot": parseInt((end - start) / 60000)
        };
        let successFn = function (data) {
            displayMessage(SUCCESS_MSG_TYPE, "time changed");
            nextEvents.splice(idx, 1, updatedEvent);
            that.setState({
                events: nextEvents,
            })
        }
        let errorFn = function () {
        }
        putAPI(interpolate(APPOINTMENT_API, [event.id]), changedEvent, successFn, errorFn);
    }

    resizeEvent = ({event, start, end}) => {
        const {events} = this.state
        let changedEvent = {};
        let that = this;
        const nextEvents = [];
        events.forEach((existingEvent) => {
            if (existingEvent.id == event.id) {
                changedEvent = {
                    // "id": event.id,
                    "schedule_at": moment(start).format("YYYY-MM-DD HH:mm:ss"),
                    "slot": parseInt((end - start) / 60000)
                };
            }
        })

        console.log(changedEvent);
        let successFn = function (data) {
            displayMessage(SUCCESS_MSG_TYPE, "time changed");
            events.forEach((existingEvent) => {
                nextEvents.push(existingEvent.id == event.id
                    ? {...existingEvent, start, end}
                    : existingEvent)
            });
            that.setState({
                events: nextEvents,
            })
        }
        let errorFn = function () {
        }
        putAPI(interpolate(APPOINTMENT_API, [event.id]), changedEvent, successFn, errorFn);
    }


    onSelectSlot(value) {
        console.log(value);
        let time = moment(value.start).format();

        console.log(time);
        if (value.action == "doubleClick") {
            this.setState({
                startTime: time,
                redirect: true
            });
            this.props.history.push('/calendar/create-appointment')
        }
    }


    onSelectEvent(event, e) {
        console.log("wokring");
        console.log(e);
        console.log(event);
        this.setState({
            visiblePopover: true
        })

        this.props.history.push("/patients/appointments/" + event.id)
    }


    /***
     * List and style settings
     * */

    appointmentList(start, end) {
        let that = this;
        let successFn = function (data) {
            that.setState(function (prevState) {
                let previousEvent = prevState.events;
                let newEvents = [];
                // newEvents.concat(previousEvent);
                data.forEach(function (appointment) {
                    let endtime = new moment(appointment.schedule_at).add(appointment.slot, 'minutes')
                    console.log(moment(appointment.schedule_at).format('LLL'));
                    console.log(endtime.format('LLL'));
                    // let event= that.state.events;
                    newEvents.push({
                        start: new Date(moment(appointment.schedule_at)),
                        end: new Date(endtime),
                        title: appointment.patient_name,
                        id: appointment.id,
                        doctor: appointment.doctor,
                        loading:false
                    })
                });
                return {events: newEvents}
            });
            that.setState({
                appointments: data,
                loading:false
            })
        }
        let errorFn = function () {
            that.setState({
                loading:false
            })
        }
        getAPI(interpolate(APPOINTMENT_PERPRACTICE_API, [this.props.active_practiceId]), successFn, errorFn, {
            start: start.format('YYYY-MM-DD'),
            end: end.format('YYYY-MM-DD')
        });
    }

    eventStyleGetter(event, start, end, isSelected) {
        console.log(event,this.state.doctors_object);
        let doctor = event.doctor;
        let doctor_object = null;
        if (this.state.doctors_object && this.state.doctors_object[doctor] && doctor) {
            console.log(this.state.doctors_object[doctor]);
            doctor_object = this.state.doctors_object[doctor].calender_colour;
        }
        // console.log("doctor object",doctor_object);
        var backgroundColor = doctor_object;
        var style = {
            backgroundColor: backgroundColor,
            borderRadius: '0px',
            opacity: 0.8,
            border: '5px',
            color: 'white',
            display: 'block'
        };
        return {
            style: style
        };
    }

    onRangeChange = (e) => {
        console.log(e)
        if (e.start && e.end) {
            this.appointmentList(moment(e.start), moment(e.end));
        } else if (e.length == 1) {
            this.appointmentList(moment(e[0]), moment(e[0]));
        } else if (e.length == 7) {
            this.appointmentList(moment(e[0]), moment(e[6]));
        }
    }

    render() {
        let startTime;
        let endTime;
        if (this.state.calendarTimings) {
            console.log(new Date(new moment(this.state.calendarTimings.start_time, 'HH:mm:ss')));
            startTime = new Date(new moment(this.state.calendarTimings.start_time, 'HH:mm:ss'));
            endTime = new Date(new moment(this.state.calendarTimings.end_time, 'HH:mm:ss'))
        }
        let counter = 0;
        this.state.events.forEach(function (event) {
            let today = new Date();
            console.log(today)
            if (moment(event.start).format("YYYY-MM-DD") == moment(today).format("YYYY-MM-DD")) {
                counter++;
            }
        });

        return (<Content className="main-container">
                <Switch>
                    <Route exact path="/calendar/create-appointment"
                           render={(route) => <CreateAppointment {...this.props} {...route}
                                                                 startTime={this.state.startTime}/>}/>
                    <Route exact path="/calendar/:appointmentid/edit-appointment"
                           render={(route) => <CreateAppointment {...this.props} {...route}
                                                                 startTime={this.state.startTime}/>}/>
                    <Route>
                        <div style={{backgroundColor: '#fff', margin: '10px', padding: '5px'}}>
                            <Row gutter={16} style={{margin: '5px'}}>
                                <Col span={3}>
                                    <Divider>Doctors</Divider>
                                    <List loading={this.state.loading} dataSource={this.state.practice_doctors}
                                          renderItem={item => (
                                              <List.Item style={{textOverflow: "ellipsis"}}><span style={{
                                                  width: '5px',
                                                  marginRight: '2px',
                                                  backgroundColor: item.calender_colour
                                              }}/>{item.user.first_name}</List.Item>)}
                                          size={"small"}/>

                                </Col>
                                <Col span={16}>
                                    <DragAndDropCalendar
                                        defaultDate={new Date()}
                                        localizer={localizer}
                                        defaultView="week"
                                        step={10}
                                        timeslots={1}
                                        events={this.state.events}
                                        onEventDrop={this.moveEvent}
                                        onEventResize={this.resizeEvent}
                                        resizable
                                        selectable
                                        popup={this.onSelectEvent}
                                        onSelectSlot={this.onSelectSlot}
                                        onSelectEvent={this.onSelectEvent}
                                        views={{month: true, week: MyWeek, day: true, agenda: true}}
                                        style={{height: "calc(100vh - 85px)"}}
                                        eventPropGetter={(this.eventStyleGetter)}
                                        min={startTime}
                                        max={endTime}
                                        onRangeChange={this.onRangeChange}/>
                                </Col>
                                <Col span={5}>
                                    <Link to='/calendar/create-appointment'>
                                        <Button block type="primary"> Walkin Appointment</Button>
                                    </Link>
                                    <Divider>Appointments</Divider>
                                    <Spin spinning={this.state.loading}>
                                        <Timeline>
                                            {this.state.appointments.length ?
                                                this.state.appointments.map((apppointment) =>
                                                    <Timeline.Item style={{padding: 0}}><AppointmentCard {...apppointment}/></Timeline.Item>) :
                                                <p style={{textAlign: 'center'}}>No Data Found</p>}
                                        </Timeline>
                                    </Spin>
                                    <h3>Today's Apointment <Badge>{counter}</Badge></h3>
                                </Col>
                            </Row>
                        </div>
                    </Route>
                </Switch>
            </Content>
        );
    }
}

export default App;


function AppointmentCard(appointment) {
    return <div style={{width: '100%'}}>
        <p>
            <span
                style={{width: 'calc(100% - 60px)'}}>{moment(appointment.schedule_at).format("HH:mm")} &nbsp;{appointment.patient_name}</span>
            <span style={{width: '60px', float: 'right'}}><a> Check In</a></span>
        </p>
    </div>;
}


class MyWeek extends React.Component {
    render() {
        let {date} = this.props
        let range = MyWeek.range(date)

        return <TimeGrid {...this.props} range={range} eventOffset={15}/>
    }
}

MyWeek.range = date => {
    let start = dates.add(date, -1, 'day')
    let end = dates.add(start, 6, 'day')
    let current = start
    let range = []
    while (dates.lte(current, end, 'day')) {
        range.push(current)
        current = dates.add(current, 1, 'day')
    }
    return range
}

MyWeek.navigate = (date, action) => {
    switch (action) {
        case BigCalendar.Navigate.PREVIOUS:
            return dates.add(date, -3, 'day')

        case BigCalendar.Navigate.NEXT:
            return dates.add(date, 3, 'day')

        default:
            return date
    }
}

MyWeek.title = date => {
    return ` ${date.toLocaleDateString()}`
}
