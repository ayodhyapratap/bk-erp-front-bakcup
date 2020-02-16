import {Button, Divider, Popconfirm, Result, Spin} from "antd";
import React from "react";
import {SINGLE_MEETING} from "../../../constants/api";
import {displayMessage, getAPI, interpolate} from "../../../utils/common";
import {SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";

export default class EventMeetingPopover extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            meeting: null
        }
    }

    componentDidMount() {
        this.loadMeetingDetails();
    }

    loadMeetingDetails = () => {
        const that = this;
        that.setState({
            loading: true
        })
        const successFn = function (data) {
            that.setState({
                loading: false,
                meeting: data
            })
        }
        const errorFn = function () {
            that.setState({
                loading: false,
            })
        }
        getAPI(interpolate(SINGLE_MEETING, [that.props.meetingId]), successFn, errorFn);
    }

    openWindowLink = (link) => {
        window.open(link)
    }

    copyToClipBoard(meeting) {

        navigator.clipboard.writeText(meeting);
        displayMessage(SUCCESS_MSG_TYPE, "Meeting URL & Password copied to clipboard")
    }

    render() {
        if (!this.state.meeting) {
            return (
<Result
  status="warning"
  title="Meeting Not Found"
/>
)
        }
        const that = this;
        return (
<div style={{width: '300px', minHeight: '200px', overflowY: 'scroll', overflowX: 'hidden'}}>
            <Spin spinning={this.state.loading}>
                <div>
                    <h4>{this.state.meeting.name}</h4>
                    <Popconfirm
                      title="Are you sure to start this meeting?"
                      onConfirm={() => that.openWindowLink(`https://clinic.bkarogyam.com/webcall/${this.state.meeting.id}`)}
                      okText="Yes"
                      cancelText="No"
                    >
                        <a>Meeting Link</a>
                    </Popconfirm>
                    {/* <Divider style={{margin: 0}}>Invite Link</Divider> */}
                    {/* <p>{directMeetingLink}<br/>Password: {this.state.meeting.password}</p> */}
                    <Button
                      size="small"
                      onClick={() => this.copyToClipBoard(`https://clinic.bkarogyam.com/webcall/${this.state.meeting.id}`)}
                      block
                      shape="round"
                    >Copy Link
                    </Button>
                    <p>{this.state.meeting.purpose}</p>
                </div>
            </Spin>
</div>
)
    }
}
