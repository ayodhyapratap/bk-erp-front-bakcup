import React, {Component} from "react";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import BigCalendar from 'react-big-calendar'
import {
    Card,
    Row,
    Timeline,
    Col,
    Popover,
    Button,
    List,
    Divider,
    Layout,
    Badge,
    Spin,
    Menu,
    Dropdown,
    Icon,
    DatePicker,
} from "antd"
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
import EventComponent from "./EventComponent";
import {calendarSettingMenu, loadAppointmentCategories} from "./calendarUtils";
import {CHECKOUT_STATUS, ENGAGED_STATUS, SCHEDULE_STATUS, WAITING_STATUS} from "../../constants/hardData";

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
            filteredEvent: [],
            appointments: [],
            practice_doctors: [],
            practice_categories: [],
            practice_staff: [],
            doctors_object: null,
            categories_object: null,
            calendarTimings: null,
            loading: true,
            selectedDoctor: 'ALL',
            selectedCategory: 'ALL',
            selectedDate: moment(),
            filterType: 'DOCTOR',
            doctorsAppointmentCount: {},
            categoriesAppointmentCount: {},
            todaysAppointments: [],
            todaysFilteredAppointments: [],
            todaysAppointmentOverview: {},
            todaysAppointmentFilter: 'ALL'
        };
        this.onSelectSlot = this.onSelectSlot.bind(this);
        this.onSelectEvent = this.onSelectEvent.bind(this);
        this.moveEvent = this.moveEvent.bind(this)
        this.resizeEvent = this.resizeEvent.bind(this);
        this.loadDoctors = this.loadDoctors.bind(this);
        this.eventStyleGetter = this.eventStyleGetter.bind(this);
        this.loadCalendarTimings = this.loadCalendarTimings.bind(this);
        this.loadCalendarTimings()
    }

    componentDidMount() {
        this.loadDoctors();
        loadAppointmentCategories(this);
        this.appointmentList(moment().subtract(1, 'days'), moment().add(5, 'days'));
        // this.todaysAppointments(moment(), moment());
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
            // console.log(doctor_object);
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
            // console.log("get table");
            that.setState({
                calendarTimings: data[0],
                loading: false
            })
        };
        let errorFn = function () {
            that.setState({
                loading: false
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

        // console.log(changedEvent);
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
        // console.log(value);
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
        // console.log("wokring");
        // console.log(e);
        // console.log(event);
        this.setState({
            visiblePopover: true
        })

        this.props.history.push("/patients/appointments/" + event.id)
    }


    /***
     * List and style settings
     * */
    todaysAppointments() {
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
                    todaysFilteredAppointments: filteredAppointment
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

    appointmentList(start, end) {
        let that = this;
        that.setState({
            loading: true
        });
        let successFn = function (data) {
            that.setState(function (prevState) {
                let previousEvent = prevState.events;
                let newEvents = [];
                let filteredEvent = [];
                let doctorsAppointmentCount = {};
                let categoriesAppointmentCount = {};
                // newEvents.concat(previousEvent);
                data.forEach(function (appointment) {
                    let endtime = new moment(appointment.schedule_at).add(appointment.slot, 'minutes')
                    // console.log(moment(appointment.schedule_at).format('LLL'));
                    // console.log(endtime.format('LLL'));
                    // let event= that.state.events;
                    let event = {
                        appointment: appointment,
                        start: new Date(moment(appointment.schedule_at)),
                        end: new Date(endtime),
                        title: appointment.patient.user.first_name,
                        id: appointment.id,
                        doctor: appointment.doctor,
                        loading: false
                    };
                    if (appointment.doctor && doctorsAppointmentCount[appointment.doctor]) {
                        doctorsAppointmentCount[appointment.doctor] += 1
                    } else {
                        doctorsAppointmentCount[appointment.doctor] = 1;
                    }
                    if (appointment.category && doctorsAppointmentCount[appointment.category]) {
                        categoriesAppointmentCount[appointment.category] += 1
                    } else {
                        categoriesAppointmentCount[appointment.category] = 1;
                    }
                    if ((prevState.filterType == 'DOCTOR' && prevState.selectedDoctor == 'ALL') || (prevState.filterType == 'CATEGORY' && prevState.selectedCategory == 'ALL')) {
                        filteredEvent.push(event)
                    } else if (prevState.filterType == 'DOCTOR' && event.doctor == prevState.selectedDoctor) {
                        filteredEvent.push(event)
                    } else if (prevState.filterType == 'CATEGORY' && event.appointment.category == prevState.selectedCategory) {
                        filteredEvent.push(event)
                    }
                    newEvents.push(event);
                });
                return {
                    events: newEvents,
                    filteredEvent: filteredEvent,
                    doctorsAppointmentCount: {...doctorsAppointmentCount, 'ALL': data.length},
                    categoriesAppointmentCount: {...categoriesAppointmentCount, 'ALL': data.length},
                    appointments: data,
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
            start: start.format('YYYY-MM-DD'),
            end: end.format('YYYY-MM-DD')
        });
        this.todaysAppointments();
    }

    eventStyleGetter(event, start, end, isSelected) {
        console.log(event, this.state.categories_object);
        let doctor = event.doctor;
        let category = event.appointment.category;
        let color_object = null;
        if (this.state.filterType == 'DOCTOR') {
            if (doctor && this.state.doctors_object && this.state.doctors_object[doctor]) {
                color_object = this.state.doctors_object[doctor].calendar_colour;
            } else {
                color_object = 'black';
            }
        } else if (this.state.filterType == 'CATEGORY') {
            if (category && this.state.categories_object && this.state.categories_object[category]) {
                color_object = '#' + this.state.categories_object[category].calendar_colour;
            } else {
                color_object = 'black';
            }
        }
        var backgroundColor = color_object;
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
        console.log(e);
        if (e.start && e.end) {
            this.appointmentList(moment(e.start), moment(e.end));
            if (moment(e.start).date() == 1) {
                this.setState({
                    selectedDate: moment(e.start)
                })
            } else {
                let newDate = moment(e.start);
                this.setState({
                    selectedDate: newDate.month(newDate.month() + 1).date(1)
                })
            }
        } else if (e.length) {
            this.appointmentList(moment(e[0]), moment(e[e.length - 1]));
            this.setState({
                selectedDate: moment(e[0])
            });
        }
    }
    onSelectedDateChange = (e) => {
        this.setState({
            selectedDate: moment(e)
        });
    }
    setFilterType = (e) => {
        let that = this;
        this.setState({
            filterType: e.key,
            selectedDoctor: 'ALL',
            selectedCategory: 'ALL'
        }, function () {
            if (e.key == 'DOCTOR') {
                that.changeFilter('selectedDoctor', 'ALL')
            } else if (e.key == 'CATEGORY') {
                that.changeFilter('selectedCategory', 'ALL')
            }
        })
    }
    changeFilter = (type, value) => {
        this.setState(function (prevState) {
            let filteredEvent = [];
            prevState.events.forEach(function (event) {
                if (value == 'ALL') {
                    filteredEvent.push(event)
                } else if (type == "selectedDoctor" && event.doctor == value) {
                    filteredEvent.push(event)
                } else if (type == "selectedCategory" && event.appointment.category == value) {
                    filteredEvent.push(event)
                }
            })
            return {
                [type]: value,
                filteredEvent: filteredEvent
            }
        })
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

    render() {
        let that = this;
        let startTime;
        let endTime;
        if (this.state.calendarTimings) {
            // console.log(new Date(new moment(this.state.calendarTimings.start_time, 'HH:mm:ss')));
            startTime = new Date(new moment(this.state.calendarTimings.start_time, 'HH:mm:ss'));
            endTime = new Date(new moment(this.state.calendarTimings.end_time, 'HH:mm:ss'))

        }
        return (<Content className="main-container">
                <div style={{margin: '10px', padding: '5px'}}>
                    <Switch>
                        <Route exact path="/calendar/create-appointment"
                               render={(route) => <CreateAppointment {...this.props} {...route}
                                                                     startTime={this.state.startTime}/>}/>
                        <Route exact path="/calendar/:appointmentid/edit-appointment"
                               render={(route) => <CreateAppointment {...this.props} {...route}
                                                                     startTime={this.state.startTime}/>}/>
                        <Route>
                            <div style={{backgroundColor: '#fff', padding: '5px 10px'}}>
                                <Row gutter={16}>
                                    <Col span={3}>
                                        <DatePicker onChange={this.onSelectedDateChange}
                                                    value={this.state.selectedDate}
                                                    format={"DD-MM-YYYY"} style={{margin: 5}}/>
                                        <Dropdown overlay={
                                            <Menu onClick={this.setFilterType}>
                                                <Menu.Item key={"DOCTOR"}>
                                                    DOCTOR
                                                </Menu.Item>
                                                <Menu.Item key={"CATEGORY"}>
                                                    CATEGORY
                                                </Menu.Item>
                                            </Menu>
                                        }>
                                            <Button block style={{margin: 5}}>
                                                {this.state.filterType} <Icon type={"caret-down"}/>
                                            </Button>
                                        </Dropdown>

                                        <Spin spinning={this.state.loading}>
                                            {this.state.filterType == 'DOCTOR' ?
                                                <Menu selectedKeys={[this.state.selectedDoctor]}
                                                      size={'small'}
                                                      onClick={(e) => this.changeFilter('selectedDoctor', e.key)}>
                                                    <Menu.Item key={"ALL"} style={{
                                                        marginBottom: 2,
                                                        textOverflow: "ellipsis",
                                                        borderLeft: '5px solid black',
                                                        borderRight: 'none'
                                                    }}>
                                                        <span>({this.state.doctorsAppointmentCount['ALL'] ? this.state.doctorsAppointmentCount['ALL'] : 0}) All Doctors</span>
                                                    </Menu.Item>
                                                    {this.state.practice_doctors.map(item =>
                                                        <Menu.Item key={item.id} style={{
                                                            textOverflow: "ellipsis",
                                                            borderRight: 'none',
                                                            borderLeft: '5px solid ' + item.calendar_colour,
                                                            backgroundColor: this.state.selectedDoctor == item.id ? item.calendar_colour : 'inherit',
                                                            color: this.state.selectedDoctor == item.id ? 'white' : 'inherit',
                                                            fontWeight: this.state.selectedDoctor == item.id ? 'bold' : 'inherit',
                                                        }}>
                                                            <span>({this.state.doctorsAppointmentCount[item.id] ? this.state.doctorsAppointmentCount[item.id] : 0}) {item.user.first_name}</span>
                                                        </Menu.Item>
                                                    )}
                                                </Menu>
                                                : <Menu selectedKeys={[this.state.selectedCategory]}
                                                        size={'small'}
                                                        onClick={(e) => this.changeFilter('selectedCategory', e.key)}>
                                                    <Menu.Item key={"ALL"} style={{
                                                        marginBottom: 2,
                                                        textOverflow: "ellipsis",
                                                        borderLeft: '5px solid black',
                                                        borderRight: 'none'
                                                    }}>
                                                        <span>({this.state.categoriesAppointmentCount['ALL'] ? this.state.categoriesAppointmentCount['ALL'] : 0}) All Categories</span>
                                                    </Menu.Item>
                                                    {this.state.practice_categories.map(item =>
                                                        <Menu.Item key={item.id} style={{
                                                            textOverflow: "ellipsis",
                                                            borderRight: 'none',
                                                            borderLeft: '5px solid #' + item.calendar_colour,
                                                            backgroundColor: this.state.selectedCategory == item.id ? '#' + item.calendar_colour : 'inherit',
                                                            color: this.state.selectedCategory == item.id ? 'white' : 'inherit',
                                                            fontWeight: this.state.selectedCategory == item.id ? 'bold' : 'inherit',
                                                        }}>
                                                            <span>({this.state.categoriesAppointmentCount[item.id] ? this.state.categoriesAppointmentCount[item.id] : 0}) {item.name}</span>
                                                        </Menu.Item>
                                                    )}
                                                </Menu>}
                                        </Spin>
                                    </Col>
                                    <Col span={16}>
                                        <Spin size="large" spinning={this.state.loading}>
                                            <DragAndDropCalendar
                                                defaultDate={new Date()}
                                                localizer={localizer}
                                                defaultView="week"
                                                step={10}
                                                timeslots={1}
                                                events={this.state.filteredEvent}
                                                onEventDrop={this.moveEvent}
                                                onEventResize={this.resizeEvent}
                                                resizable
                                                selectable
                                                popup={this.onSelectEvent}
                                                onSelectSlot={this.onSelectSlot}
                                                // onSelectEvent={this.onSelectEvent}
                                                views={{month: true, week: MyWeek, day: true, agenda: true}}
                                                style={{minHeight: "calc(100vh - 85px)"}}
                                                eventPropGetter={(this.eventStyleGetter)}
                                                date={new Date(this.state.selectedDate.format())}
                                                min={startTime}
                                                max={endTime}
                                                onRangeChange={this.onRangeChange}
                                                components={{
                                                    event: EventComponent
                                                }}/>
                                        </Spin>
                                    </Col>
                                    <Col span={5}>
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
                                                     backgroundColor: (this.state.todaysAppointmentFilter == SCHEDULE_STATUS ? '#ddd' : null)
                                                 }}>
                                                <small>{SCHEDULE_STATUS}</small>
                                                <h2>{this.state.todaysAppointmentOverview[SCHEDULE_STATUS] ? this.state.todaysAppointmentOverview[SCHEDULE_STATUS] : 0}</h2>
                                            </Col>
                                            <Col span={6}
                                                 onClick={() => this.filterTodaysAppointment(this.state.todaysAppointmentFilter == WAITING_STATUS ? 'ALL' : WAITING_STATUS)}
                                                 style={{
                                                     textAlign: 'center',
                                                     border: '1px solid #ccc',
                                                     borderRadius: '3px',
                                                     backgroundColor: (this.state.todaysAppointmentFilter == WAITING_STATUS ? '#ddd' : null)
                                                 }}>
                                                <small>{WAITING_STATUS}</small>
                                                <h2>{this.state.todaysAppointmentOverview[WAITING_STATUS] ? this.state.todaysAppointmentOverview[WAITING_STATUS] : 0}</h2>
                                            </Col>
                                            <Col span={6}
                                                 onClick={() => this.filterTodaysAppointment(this.state.todaysAppointmentFilter == ENGAGED_STATUS ? 'ALL' : ENGAGED_STATUS)}
                                                 style={{
                                                     textAlign: 'center',
                                                     border: '1px solid #ccc',
                                                     borderRadius: '3px',
                                                     backgroundColor: (this.state.todaysAppointmentFilter == ENGAGED_STATUS ? '#ddd' : null)
                                                 }}>
                                                <small>{ENGAGED_STATUS}</small>
                                                <h2>{this.state.todaysAppointmentOverview[ENGAGED_STATUS] ? this.state.todaysAppointmentOverview[ENGAGED_STATUS] : 0}</h2>
                                            </Col>
                                            <Col span={6}
                                                 onClick={() => this.filterTodaysAppointment(this.state.todaysAppointmentFilter == CHECKOUT_STATUS ? 'ALL' : CHECKOUT_STATUS)}
                                                 style={{
                                                     textAlign: 'center',
                                                     border: '1px solid #ccc',
                                                     borderRadius: '3px',
                                                     backgroundColor: (this.state.todaysAppointmentFilter == CHECKOUT_STATUS ? '#ddd' : null)
                                                 }}>
                                                <small>{CHECKOUT_STATUS}</small>
                                                <h2>{this.state.todaysAppointmentOverview[CHECKOUT_STATUS] ? this.state.todaysAppointmentOverview[CHECKOUT_STATUS] : 0}</h2>
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
                                                            borderLeft: '5px solid' + (apppointment.doctor && that.state.doctors_object && that.state.doctors_object[apppointment.doctor] ? that.state.doctors_object[apppointment.doctor].calendar_colour : 'transparent')
                                                        }}>
                                                        <AppointmentCard {...apppointment}/>
                                                    </div>
                                                </List.Item>
                                                }/>
                                        </Spin>
                                        <h3></h3>
                                    </Col>
                                </Row>
                            </div>
                        </Route>
                    </Switch>
                </div>
            </Content>
        );
    }
}

export default App;


function

AppointmentCard(appointment) {
    return <div style={{width: '100%'}}>
        <p style={{marginBottom: 0}}>
        <span
            style={{width: 'calc(100% - 60px)'}}><b>{moment(appointment.schedule_at).format("LT")}</b>&nbsp;
            {appointment.patient.user.first_name}</span>
            <span style={{width: '60px', float: 'right'}}><a> Check In</a></span>
        </p>
    </div>;
}


class MyWeek
    extends React
        .Component {
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
