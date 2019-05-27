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
import {
    APPOINTMENT_PERPRACTICE_API,
    APPOINTMENT_API,
    PRACTICESTAFF,
    CALENDER_SETTINGS,
    BLOCK_CALENDAR
} from "../../constants/api";
import EventComponent from "./EventComponent";
import {calendarSettingMenu, loadAppointmentCategories} from "./calendarUtils";
import CalendarRightPanel from "./CalendarRightPanel";
import BlockCalendar from "./BlockCalendar";

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
            blockedCalendar: []
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
            that.setState({
                calendarTimings: {
                    ...data[0],
                    startTime: new moment(data[0].start_time, 'HH:mm:ss'),
                    endTime: new moment(data[0].end_time, 'HH:mm:ss')
                },
                loading: false
            });
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
        let time = moment(value.start).format();
        if (value.action == "doubleClick") {
            this.setState({
                startTime: time,
                redirect: true
            });
            this.props.history.push('/calendar/create-appointment')
        }
    }


    onSelectEvent(event, e) {
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
        this.blockedCalendarTiming(start, end)
    }

    blockedCalendarTiming = (start, end) => {
        let that = this;
        let successFn = function (data) {
            that.setState({
                blockedCalendar: data
            })
        }
        let errorFn = function () {

        }
        getAPI(BLOCK_CALENDAR, successFn, errorFn, {
            practice: this.props.active_practiceId,
            cal_fdate: start.format(),
            cal_tdate: end.format()
        })
    };

    eventStyleGetter(event, start, end, isSelected) {
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


    render() {
        let that = this;
        return (<Content className="main-container">
                <div style={{margin: '10px', padding: '5px'}}>
                    <Switch>
                        <Route exact path="/calendar/create-appointment"
                               render={(route) => <CreateAppointment {...this.props} {...route}
                                                                     startTime={this.state.startTime}/>}/>
                        <Route exact path="/calendar/:appointmentid/edit-appointment"
                               render={(route) => <CreateAppointment {...this.props} {...route}
                                                                     startTime={this.state.startTime}/>}/>
                        <Route exact path="/calendar/blockcalendar"
                               render={(route) => <BlockCalendar {...this.props} {...route}/>}/>
                        <Route>
                            <div style={{backgroundColor: '#fff', padding: '5px 10px'}}>
                                <Row gutter={16}>
                                    <Col span={3}>

                                        <DatePicker onChange={this.onSelectedDateChange}
                                                    value={this.state.selectedDate}
                                                    format={"DD-MM-YYYY"} style={{margin: 5}}/>
                                        <Button block style={{margin: 5}}>
                                            <Link to={"/calendar/blockcalendar"}>
                                                <Icon type="stop"/> Block Calendar
                                            </Link>
                                        </Button>
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
                                                truncateEvents={false}
                                                events={this.state.filteredEvent}
                                                onEventDrop={this.moveEvent}
                                                onEventResize={this.resizeEvent}
                                                resizable
                                                selectable
                                                popup={this.onSelectEvent}
                                                onSelectSlot={this.onSelectSlot}
                                                // onSelectEvent={this.onSelectEvent}
                                                views={{month: true, week: MyWeek, day: true, agenda: true}}
                                                style={{height: "calc(100vh - 85px)"}}
                                                eventPropGetter={(this.eventStyleGetter)}
                                                date={new Date(this.state.selectedDate.format())}
                                                // min={startTime}
                                                // max={endTime}
                                                onRangeChange={this.onRangeChange}
                                                components={{
                                                    event: EventComponent,
                                                    timeSlotWrapper: function (options) {
                                                        return <TimeSlotWrapper {...options}
                                                                                key={options.value.toString()}
                                                                                blockedCalendar={that.state.blockedCalendar}
                                                                                calendarTimings={that.state.calendarTimings}
                                                                                filterType={that.state.filterType}
                                                                                selectedDoctor={that.state.selectedDoctor}/>
                                                    },

                                                }}/>
                                        </Spin>
                                    </Col>
                                    <Col span={5}>
                                        <CalendarRightPanel {...this.props} {...this.state}
                                                            key={moment(this.state.selectedDate).toISOString()}/>
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

function TimeSlotWrapper(props) {
    if (props.calendarTimings && moment(props.value, 'HH:mm:ss').format('HH:mm:ss') >= props.calendarTimings.startTime.format('HH:mm:ss') && moment(props.value, 'HH:mm:ss').format('HH:mm:ss') < props.calendarTimings.endTime.format('HH:mm:ss')) {
        let flag = true;
        for (let i = 0; i < props.blockedCalendar.length; i++) {
            if (props.blockedCalendar[i].doctor && props.filterType == 'DOCTOR') {
                if (props.blockedCalendar[i].doctor == props.selectedDoctor && moment(props.value).isBetween(moment(props.blockedCalendar[i].block_from), moment(props.blockedCalendar[i].block_to))) {
                    flag = false;
                    break;
                }
            } else {
                if (moment(props.value).isBetween(moment(props.blockedCalendar[i].block_from), moment(props.blockedCalendar[i].block_to))) {
                    flag = false;
                    break;
                }
            }
        }
        if (flag)
            return props.children;
    }

    const child = React.Children.only(props.children);
    return React.cloneElement(child, {className: child.props.className + ' rbc-off-range-bg'});
}

function MonthEventWrapper(props) {
    console.log(props);
    return props.children;
}
