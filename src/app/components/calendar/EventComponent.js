import React from "react";
import {Icon, Popover} from "antd";
import EventPatientPopover from "./EventPatientPopover";

export default class EventComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        let that=this;
        return <Popover placement="right"
                        content={<EventPatientPopover appointmentId={this.props.event.appointment.id}
                                                      key={this.props.event.appointment.id} {...that.props}/>}
                        trigger="hover">
            <div style={{color: 'white'}}>
                <h1 style={{color: 'white'}}><Icon type={'user'}/>{this.props.title}</h1>
            </div>
        </Popover>
    }
}
