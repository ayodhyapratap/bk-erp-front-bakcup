import React from "react";
import {Card, Table} from "antd";
import {getAPI} from "../../../utils/common";
import {ACTIVITY_API} from "../../../constants/api";

export default class ActivityList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activity: null,
            loading:true
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
                activity: data,
                loading:false
            })
        }
        let errorFn = function () {
            that.setState({
                loading:false
            })

        }
        getAPI(ACTIVITY_API, successFn, errorFn);
    }

    render() {
        return <Card title="Activity Log">
            <Table loading={this.state.loading} dataSource={this.state.activity}/>
        </Card>
    }
}
