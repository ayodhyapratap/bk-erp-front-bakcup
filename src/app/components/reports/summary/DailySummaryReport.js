import React from "react";
import {Button, Card, Icon, Table} from "antd";

export default class DailySummaryReport extends React.Component {
    constructor(props){
        super()
        this.state={
            // loading:true,
        }
    }
    render() {
        return <div><h2>Daily Summary Report
        </h2>
            <Card>
                <Table loading={this.state.loading} dataSource={[]}/>
            </Card>
        </div>
    }
}
