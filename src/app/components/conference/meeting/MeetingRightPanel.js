import React from "react";
import {Icon, Divider, Spin, List, Avatar, Popover} from "antd";
import moment from "moment";
import EventMeetingPopover from "./EventMeetingPopover";

export default class MeetingRightPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }

    }



    render() {
        let that = this;
        return <div>
            {!that.props.conflictList?
            <Divider>
                <a type="primary"><Icon type="left"/></a> Meeting's Schedule <a type="primary"><Icon type="right"/></a>

            </Divider>:null}

            <Spin spinning={this.props.loading}>
                <List dataSource={that.props.filterMeetingList}
                      bordered
                      renderItem={meeting => (
                          <List.Item>

                              <MeetingCard {...meeting}/>
                          </List.Item>
                      )}
                />
            </Spin>
        </div>
    }
}

function MeetingCard(meeting) {

    return <div style={{width: '100%'}}>
        <p style={{marginBottom: 0}}>
            <Popover placement="right" content={<EventMeetingPopover meetingId={meeting.id}
                                                                     key={meeting.id} />}>
            <span style={{width: 'calc(100% - 60px)'}}><b>{moment(meeting.start).format("LLL")}</b>&nbsp;
                {meeting.name}</span>
            </Popover>


        </p>
    </div>;
}


