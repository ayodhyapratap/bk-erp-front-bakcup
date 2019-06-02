import React from "react";
import {Card, Tabs} from 'antd';
import LabTest from "./LabTest";

const TabPane = Tabs.TabPane;
export default class LabTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return <div>
            <h2>Lab Tracking</h2>
            <Card>
                <Tabs>
                    <TabPane key={"tests"} tab={"Lab Tests"}>
                        <LabTest {...this.props}/>
                    </TabPane>
                    <TabPane key={"tests"} tab={"Lab Panels"}>
                        <LabTest {...this.props}/>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    }
}
