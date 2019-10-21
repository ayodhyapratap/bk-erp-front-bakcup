import React from "react";
import {Button, Card, Icon, Spin, Table} from "antd";
import {Route, Switch} from "react-router";
import AddOrEditMeeting from "./AddOrEditMeeting";
import {Link} from "react-router-dom";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {Calendar as BigCalendar, momentLocalizer, Navigate} from "react-big-calendar";
import moment from "moment";
import TimeGrid from "react-big-calendar/lib/TimeGrid";
import * as dates from "date-arithmetic";

const DragAndDropCalendar = withDragAndDrop(BigCalendar);
const localizer = momentLocalizer(moment);
export default class MeetingBooking extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loading:false,
            selectedDate: moment(),
        }
    }
    onSelectSlot=(value)=> {
       let  that=this;
        let time = moment(value.start).format();
        if (value.action == "doubleClick") {
            that.setState({
                startTime: time,
                redirect: true
            });
            this.props.history.push('/meeting-booking/add')
        }

    }
    render() {
        const events=[  {
            'title': 'All Day Event very long title',
            'allDay': true,
            'start': new Date(2015, 3, 0),
            'end': new Date(2015, 3, 1)
        },
            {
                'title': 'Long Event',
                'start': new Date(2015, 3, 7),
                'end': new Date(2015, 3, 10)
            },

            {
                'title': 'DTS STARTS',
                'start': new Date(2016, 2, 13, 0, 0, 0),
                'end': new Date(2016, 2, 20, 0, 0, 0)
            }]
        return(
            <div>
                <Switch>
                    <Route exact path='/meeting-booking/add'
                           render={(route) => <AddOrEditMeeting {...this.state} {...route} {...this.props} loadData={this.loadData}/>}/>

                    <Route exact path={"/meeting-booking/edit/:id"} render={(route)=><AddOrEditMeeting  {...route} {...this.props} {...this.state}/>}/>

                    <Card title="Meeting Booking" extra={<Link to="/meeting-booking/add" ><Button type="primary"><Icon type="plus"/> Add Booking</Button></Link>}>
                        <Spin size="large" spinning={this.state.loading}>
                            <DragAndDropCalendar
                                localizer={localizer}
                                startAccessor="start"
                                events={events}
                                selectable
                                date={new Date(this.state.selectedDate.format())}
                                endAccessor="end"
                                defaultDate={new Date()}
                                views={{month: true, week: MyWeek, day: true}}
                                onSelectSlot={this.onSelectSlot}
                                style={{height: "calc(100vh - 85px)"}}
                            >

                            </DragAndDropCalendar>
                        </Spin>

                        {/*<Table title={"xyz"}/>*/}
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
