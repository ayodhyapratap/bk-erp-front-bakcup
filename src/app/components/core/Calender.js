import React, { Component } from "react";
import Calendar from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import BigCalendar from 'react-big-calendar'
import {Card} from "antd"
import "./app.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Calendar.setLocalizer(Calendar.momentLocalizer(moment));
const localizer = BigCalendar.momentLocalizer(moment)

const DnDCalendar = withDragAndDrop(Calendar);

class App extends Component {
  state = {
    events: [
      {
        start: new Date(),
        end: new Date(moment().add(1, "hour")),
        title: "Some title"
      }
    ]
  };

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

  render() {
    return (
      <Card>
        <DnDCalendar
          defaultDate={new Date()}
          localizer={localizer}
          defaultView="week"
          events={this.state.events}
          onEventDrop={this.onEventDrop}
          onEventResize={this.onEventResize}
          resizable
          style={{ height: "100vh" }}
        />
        </Card>
    );
  }
}

export default App;
