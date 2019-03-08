import {Card, Col, Form, List, Row} from "antd";
import React from "react";
import ChangePasswordForm from "./forms/ChangePasswordForm";
import {Layout} from "antd";

const {Content} = Layout;
export default class Profile extends React.Component {

    render() {
        let that = this;
        const ChangePasswordLayout = Form.create()(ChangePasswordForm);
        return <Content className="main-container" style={{
            margin: '24px 16px',
            // padding: 24,
            minHeight: 280,
            // marginLeft: '200px'
        }}>
            <Row>
                <Col span={12}>
                    <Card title="Change Password">
                        <ChangePasswordLayout/>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="My Permissions">
                        <List size="small"
                            dataSource={that.props.activePracticeData ? that.props.activePracticeData.permissions_data : []}
                            renderItem={item => <List.Item>{item.name}</List.Item>}/>
                    </Card>
                </Col>
            </Row>
        </Content>
    }
}
