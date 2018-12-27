import React from "react";
import {Card, Table} from "antd";
import {getAPI} from "../../../utils/common";
import {ACTIVITY_API} from "../../../constants/api";

export default class ActivityList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activity: null
        }
        this.loadActivityLog = this.loadActivityLog.bind(this)
    }

    componentWillMount() {
        this.loadActivityLog();
    }

    loadActivityLog() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                activity: data
            })
        }
        let errorFn = function () {

        }
        getAPI(ACTIVITY_API, successFn, errorFn);
    }

    render() {
        return <Card title="Activity Log">
            <Table dataSource={this.state.activity}/>
        </Card>
    }
}
