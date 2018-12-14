import React, { Component } from "react";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import BigCalendar from 'react-big-calendar'
import {Card, Popover,Button} from "antd"

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./app.css";
import {Route, Switch} from "react-router-dom";
import CreateAppointment from "./CreateAppointment";
import { Redirect } from 'react-router-dom';
import TimeGrid from 'react-big-calendar/lib/TimeGrid'
import dates from 'date-arithmetic'
import {getAPI,interpolate, displayMessage} from "../../utils/common";
import { APPOINTMENT_PERPRACTICE_API} from "../../constants/api";




// Calendar.setLocalizer(Calendar.momentLocalizer(moment));
const localizer = BigCalendar.momentLocalizer(moment)

const DragAndDropCalendar = withDragAndDrop(BigCalendar)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime:null,
      visiblePopover: false,
      events: [
        {
          start: new Date(),
          end: new Date(moment().add(1, "hour")),
          title: "Some title"
        }
      ]
    };
    this.onSelectSlot= this.onSelectSlot.bind(this);
    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.moveEvent = this.moveEvent.bind(this)
   this.newEvent = this.newEvent.bind(this)
    this.appointmentList();
  }

  onEventResize = ({ event, start, end }) => {
    const { events } = this.state

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    this.setState({
      events: nextEvents,
    })

    //alert(`${event.title} was resized to ${start}-${end}`)

  }

  onEventDrop = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const { events } = this.state

     const idx = events.indexOf(event)
     let allDay = event.allDay

     if (!event.allDay && droppedOnAllDaySlot) {
       allDay = true
     } else if (event.allDay && !droppedOnAllDaySlot) {
       allDay = false
  };
}

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


  moveEvent({ event, start, end, isAllDay: droppedOnAllDaySlot }) {
      const { events } = this.state

      const idx = events.indexOf(event)
      let allDay = event.allDay

      if (!event.allDay && droppedOnAllDaySlot) {
        allDay = true
      } else if (event.allDay && !droppedOnAllDaySlot) {
        allDay = false
      }

      const updatedEvent = { ...event, start, end, allDay }

      const nextEvents = [...events]
      nextEvents.splice(idx, 1, updatedEvent)

      this.setState({
        events: nextEvents,
      })

      // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
    }

    resizeEvent = ({ event, start, end }) => {
      const { events } = this.state

      const nextEvents = events.map(existingEvent => {
        return existingEvent.id == event.id
          ? { ...existingEvent, start, end }
          : existingEvent
      })

      this.setState({
        events: nextEvents,
      })

      //alert(`${event.title} was resized to ${start}-${end}`)
    }

    newEvent(event) {
      // let idList = this.state.events.map(a => a.id)
      // let newId = Math.max(...idList) + 1
      // let hour = {
      //   id: newId,
      //   title: 'New Event',
      //   allDay: event.slots.length == 1,
      //   start: event.start,
      //   end: event.end,
      // }
      // this.setState({
      //   events: this.state.events.concat([hour]),
      // })
    }









  onSelectEvent(event, e){
   console.log("wokring");
   console.log(e);
   console.log(event);
   this.setState({
     visiblePopover:true
   })
  }

  appointmentList(){
   let that = this;
   let successFn = function(data){
     that.setState(function(prevState){
       let previousEvent = prevState.events;
       let newEvents = [];
       newEvents.concat(previousEvent);
       data.forEach(function (appointment){
         let endtime=new moment(appointment.shedule_at).add( appointment.slot, 'minutes')
         console.log(moment(appointment.shedule_at).format('LLL'));
         console.log(endtime.format('LLL'));
         // let event= that.state.events;
         newEvents.push({
           start:new Date(moment(appointment.shedule_at)),
           end:  new Date(endtime),
           title: appointment.patient_name
         })
       });
       return {events:newEvents}
     })
    // data.forEach(function (appointment){
    //   let endtime=new moment(appointment.shedule_at).add( appointment.slot, 'minutes')
    //   console.log(moment(appointment.shedule_at).format('LLL'));
    //   console.log(endtime.format('LLL'));
      // let event= that.state.events;
      // event.push({
      //   start:moment(appointment.shedule_at),
      //   end:  endtime,
      //   title: appointment.patient_name
      // })
      // that.setState({
      //   events:event,
      //
      // })

    }

   let errorFn = function (){

   }
   getAPI (interpolate(APPOINTMENT_PERPRACTICE_API,[this.props.active_practiceId])  , successFn,errorFn);
  }


  render() {console.log(this.state.events);
    return (

      <Card>
      <Route exact path="/calendar/create-appointment" render={(route) => <CreateAppointment {...this.props} startTime={this.state.startTime}/>}/>

      <Popover
      content={<a onClick={this.hide}>Close</a>}
      title="Title"
      trigger="click"
      visible={this.state.visiblePopover}
      onVisibleChange={this.handleVisibleChange}
      >

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
          views={{ month: true, week: MyWeek, day: true, agenda:true }}
          style={{ height: "100vh" }}
        />
      </Popover>

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
