import React from "react";
import {Button, Card, Col, Icon, Row, Spin} from "antd";
import {Route, Switch} from "react-router";
import AddOrEditMeeting from "./AddOrEditMeeting";
import {Link} from "react-router-dom";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {Calendar as BigCalendar, momentLocalizer, Navigate} from "react-big-calendar";
import moment from "moment";
import TimeGrid from "react-big-calendar/lib/TimeGrid";
import * as dates from "date-arithmetic";
import {getAPI} from "../../../utils/common";
import {MEETING_DETAILS} from "../../../constants/api";
import MeetingEventComponent from "./MeetingEventComponent";
import MeetingRightPanel from "./MeetingRightPanel";

const DragAndDropCalendar = withDragAndDrop(BigCalendar);
const localizer = momentLocalizer(moment);
export default class MeetingBooking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            selectedDate: moment(),
            selectedStartDate: moment().subtract(1, 'days'),
            selectedEndDate: moment().add(5, 'days'),
            meetingList: []
        }
    }

    componentDidMount() {
        this.loadMeetingList();
    }

    onSelectSlot = (value) => {
        let that = this;
        let time = moment(value.start);
        if (value.action == "doubleClick") {
            that.setState({
                startTime: time,
                redirect: true
            });
            this.props.history.push('/meeting-booking/add');
        }

    }
    onRangeChange = (e) => {
        let that = this;
        console.log(e);
        if (e.start && e.end) {

            if (moment(e.start).date() == 1) {
                this.setState({
                    selectedDate: moment(e.start),
                    selectedStartDate: moment(e.start),
                    selectedEndDate: moment(e.end),
                }, function () {
                    that.loadMeetingList();
                })
            } else {
                let newDate = moment(e.start);
                this.setState({
                    selectedDate: newDate.month(newDate.month() + 1).date(1),
                    selectedStartDate: newDate.month(newDate.month() + 1).date(1),
                    selectedEndDate: moment(e.end),
                }, function () {
                    that.loadMeetingList();
                })
            }
        } else if (e.length) {
            if (e.length == 7) {
                this.setState({
                    selectedDate: moment(e[0]),
                    selectedStartDate: moment(e[0]).subtract(1, 'day'),
                    selectedEndDate: moment(e[e.length - 1]).subtract(1, 'day')
                }, function () {
                    that.loadMeetingList();
                });
            } else {
                // this.loadMeetingList(moment(e[0]), moment(e[e.length - 1]));
                this.setState({
                    selectedDate: moment(e[0]),
                    selectedStartDate: moment(e[0]),
                    selectedEndDate: moment(e[e.length - 1])
                }, function () {
                    that.loadMeetingList();
                });
            }

        }
    }
    loadMeetingList = () => {
        let that = this;
        that.setState({
            loading: true
        })
        let successFn = function (data) {
            let eventList = [];
            data.forEach(function (meeting) {
                eventList.push({
                    ...meeting,
                    title: meeting.agenda,
                    start: new Date(meeting.start),
                    end: new Date(meeting.end),
                });
            })
            that.setState({
                meetingList: eventList,
                loading: false
            })
        }
        let errorFn = function () {

        }
        let params = {
            start: moment(this.state.selectedStartDate).startOf('day').format(),
            end: moment(this.state.selectedEndDate).endOf('day').format()
        }
        getAPI(MEETING_DETAILS, successFn, errorFn, params)
    }

    render() {
        let that = this;
        return (
            <div style={{margin: 20}}>
                <Switch>
                    <Route exact path='/meeting-booking/add'
                           render={(route) => <AddOrEditMeeting {...this.state} {...route} {...this.props}
                                                                loadData={this.loadMeetingList}/>}/>

                    <Route exact path={"/meeting-booking/edit/:id"}
                           render={(route) => <AddOrEditMeeting  {...route} {...this.props} {...this.state}
                                                                 loadData={this.loadMeetingList}/>}/>

                    <Card title="Meeting Booking"
                          extra={<Link to="/meeting-booking/add"><Button type="primary"><Icon type="plus"/> Add Booking</Button></Link>}>
                        <Spin size="large" spinning={this.state.loading}>
                            <Row gutter={16}>
                                <Col span={19}>
                                    <DragAndDropCalendar
                                        localizer={localizer}
                                        startAccessor="start"
                                        defaultView="week"
                                        step={10}
                                        timeslots={1}
                                        events={this.state.meetingList}
                                        selectable
                                        date={new Date(this.state.selectedDate.format())}
                                        endAccessor="end"
                                        defaultDate={new Date()}
                                        views={{month: true, week: MyWeek, day: true}}
                                        onSelectSlot={this.onSelectSlot}
                                        style={{height: "calc(100vh - 85px)"}}
                                        onRangeChange={this.onRangeChange}
                                        components={{
                                            event: function (option) {
                                                return <MeetingEventComponent {...option} {...that.props}/>
                                            }
                                        }}
                                    />
                                </Col>
                                <Col span={5}>
                                    <MeetingRightPanel {...this.props} {...this.state}/>
                                </Col>
                            </Row>
                        </Spin>
                    </Card>
                </Switch>
            </div>
        )
    }
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
        case Navigate.PREVIOUS:
            return dates.add(date, -3, 'day')

        case Navigate.NEXT:
            return dates.add(date, 3, 'day')

        default:
            return date
    }
}

MyWeek.title = date => {
    return ` ${date.toLocaleDateString()}`
}


function MonthEventWrapper(props) {
    return props.children;
}
