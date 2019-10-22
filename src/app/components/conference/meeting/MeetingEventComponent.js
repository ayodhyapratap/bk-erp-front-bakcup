import React from "react";
import {Icon, Popover} from "antd";
import EventMeetingPopover from "./EventMeetingPopover";

export default class MeetingEventComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        let that=this;
        return <Popover placement="right"
                        content={<EventMeetingPopover meetingId={this.props.event.id}
                                                      key={this.props.event.id} {...that.props}/>}
                        trigger="hover">
            <div style={{color: 'white',height:'100%'}}>
                <h1 style={{color: 'white'}}><Icon type={'user'}/>{this.props.event.name}</h1>
            </div>
        </Popover>
    }
}

