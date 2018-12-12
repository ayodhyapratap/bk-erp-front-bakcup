import React, { Component } from "react";
import Calendar from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import BigCalendar from 'react-big-calendar'
import {Card} from "antd"
import "./app.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {Route, Switch} from "react-router-dom";
import CreateAppointment from "./CreateAppointment";
import { Redirect } from 'react-router-dom';
import TimeGrid from 'react-big-calendar/lib/TimeGrid'
import dates from 'date-arithmetic'



// Calendar.setLocalizer(Calendar.momentLocalizer(moment));
const localizer = BigCalendar.momentLocalizer(moment)

const DnDCalendar = withDragAndDrop(Calendar);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime:null,
      events: [
        {
          start: new Date(),
          end: new Date(moment().add(1, "hour")),
          title: "Some title"
        }
      ]
    };
    this.onSelectSlot= this.onSelectSlot.bind(this);
  }
  onEventResize = ({ event, start, end, allDay }) => {

    this.setState(function(state) {
      state.events[0].start = start;
      state.events[0].end = end;
      return { events: state.events };
    });
  };

  onEventDrop = ({ event, start, end, allDay }) => {
    this.setState(function(state) {
      state.events[0].start = start;
      state.events[0].end = end;
      return { events: state.events };
    });
    console.log(start);
  };

  onSelectSlot(value){
   console.log(value);
   let time=  moment(value.start).format();

    console.log(time  );
    if(value.action=="doubleClick"){
      this.setState({
        startTime:time,
        redirect: true
      });
      this.props.history.push('/calendar/create-appointment')

    }

  }

  onSelectEvent(event, e){
   console.log("wokring");
   console.log(e);
   console.log(event);
  }

  render() {console.log(this.state.startTime);
    return (

      <Card>
      <Route exact path="/calendar/create-appointment" render={(route) => <CreateAppointment startTime={this.state.startTime}/>}/>
        <DnDCalendar
          defaultDate={new Date()}
          localizer={localizer}
          defaultView="week"
          step="10"
          timeslots="1"
          events={this.state.events}
          onEventDrop={this.onEventDrop}
          onEventResize={this.onEventResize}
          resizable
          selectable
          onSelectSlot={this.onSelectSlot}
          onSelectEvent={this.onSelectEvent}
          views={{ month: true, week: MyWeek, day: true, agenda:true }}
          style={{ height: "100vh" }}
        />


        </Card>
    );
  }
}

export default App;



class MyWeek extends React.Component {
  render() {
    let { date } = this.props
    let range = MyWeek.range(date)

    return <TimeGrid {...this.props} range={range} eventOffset={15} />
  }
}

MyWeek.range = date => {
  let start = dates.add(date,-1, 'day')
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
