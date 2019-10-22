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
        let that = this;
        that.setState({
            loading: true
        })
        let successFn = function (data) {
            that.setState({
                loading: false,
                meeting: data
            })
        }
        let errorFn = function () {
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
        let text = meeting.registration_url +"\nPassword: "+meeting.password
        navigator.clipboard.writeText(text);
        displayMessage(SUCCESS_MSG_TYPE,"Meeting URL & Password copied to clipboard")
    }
    render() {
        let that = this;
        return <div style={{width: '300px', minHeight: '200px',overflowY:'scroll',overflowX:'hidden'}}>
            <Spin spinning={this.state.loading}>
                {this.state.meeting ?
                    <div>
                        <h4>{this.state.meeting.name}</h4>
                        <Popconfirm
                            title="Are you sure to start this meeting?"
                            onConfirm={() => that.openWindowLink(that.state.meeting.start_url)}
                            okText="Yes"
                            cancelText="No">
                            <a>Admin Meeting Start Link</a>
                        </Popconfirm>
                        <Divider style={{margin: 0}}>Invite Link</Divider>
                        <p>{this.state.meeting.registration_url}<br/>Password: {this.state.meeting.password}</p>

                        <Button size="small" onClick={()=>this.copyToClipBoard(this.state.meeting)} block shape={"round"}>Copy Invite Link</Button>
                        <p>{this.state.meeting.purpose}</p>
                    </div> : <Result
                        status="warning"
                        title="Meeting Not Found"

                    />}
            </Spin>
        </div>
    }
}