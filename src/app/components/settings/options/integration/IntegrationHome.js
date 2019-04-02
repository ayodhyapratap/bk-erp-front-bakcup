import React from "react";
import {Card, Icon, Row, Tabs} from "antd";
import {INPUT_FIELD, PASSWORD_FIELD} from "../../../../constants/dataKeys";
import {Form} from "antd/lib/index";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";

const TabPane = Tabs.TabPane;
export default class IntegrationHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            integrateData: {}
        }
    }
    loadData(){

    }
    render() {
        let that = this;
        const taskIntegrateFormFields = [{
            key: 'task_user',
            type: INPUT_FIELD,
            initialValue: this.state.integrateData.task_user,
            required: true,
            label: "Username"
        }, {
            key: 'task_pass',
            type: PASSWORD_FIELD,
            initialValue: this.state.integrateData.task_pass,
            required: true,
            label: "Password"
        }];
        const taskIntegrateFormProp = {
            method : 'post',
            successFn : function(data){
                that.loadData();
            },
            errorFn : function (){

            }
        }
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <Row>
            <Card>
                <h2>My Integrations</h2>
                <Tabs>
                    <TabPane tab={<span><Icon type="check-circle"/>Task Tracker</span>} key="Complaints">
                        <TestFormLayout fields={taskIntegrateFormFields} formProp={taskIntegrateFormProp}/>
                    </TabPane>
                    <TabPane tab={<span><Icon type="phone"/>Calling</span>} key="observations">
                        {/*<TableData {...this.props} id={EMR_OBSERVATIONS} name="Observations"/>*/}
                    </TabPane>
                </Tabs>

            </Card>
        </Row>
    }
}
