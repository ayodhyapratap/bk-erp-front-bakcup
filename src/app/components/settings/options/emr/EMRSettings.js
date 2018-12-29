import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form, Button, Card, Icon, Tabs, Divider, Tag, Row, Table} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import TableData from "./TableData";
import {
    EMR_DIAGNOSES,
    EMR_FILETAGS,
    EMR_COMPLAINTS,
    EMR_OBSERVATIONS,
    EMR_INVESTIGATIONS,
    EMR_TREATMENTNOTES
} from "../../../../constants/api"

const TabPane = Tabs.TabPane;


class EMRSettings extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            <Row>
                <h2>EMR Settings</h2>
                <Card>
                    <Tabs defaultActiveKey="Complaints">
                        <TabPane tab={<span><Icon type="android"/>Complaints</span>} key="Complaints">
                            <TableData {...this.props} id={EMR_COMPLAINTS} name="Complaints"/>
                        </TabPane>
                        <TabPane tab={<span><Icon type="android"/>Observations</span>} key="observations">
                            <TableData {...this.props} id={EMR_OBSERVATIONS} name="Observations"/>
                        </TabPane>
                        <TabPane tab={<span><Icon type="android"/>Diagnoses</span>} key="diagnoses">
                            <TableData {...this.props} id={EMR_DIAGNOSES} name="Diagnoses"/>
                        </TabPane>
                        <TabPane tab={<span><Icon type="android"/>Investigations</span>} key="investigations">
                            <TableData {...this.props} id={EMR_INVESTIGATIONS} name="Investigations"/>
                        </TabPane>
                        <TabPane tab={<span><Icon type="android"/>Notes</span>} key="treatmentnotes">
                            <TableData {...this.props} id={EMR_TREATMENTNOTES} name="treatment notes"/>
                        </TabPane>
                        <TabPane tab={<span><Icon type="android"/>FIle Labels</span>} key="filetags">
                            <TableData {...this.props} id={EMR_FILETAGS} name="File Labels"/>
                        </TabPane>
                    </Tabs>

                </Card>
            </Row>
        </div>
    }
}

export default EMRSettings;
