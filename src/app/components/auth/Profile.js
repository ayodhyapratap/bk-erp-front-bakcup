import {Card, Col, Form, Row} from "antd";
import React from "react";
import ChangePasswordForm from "./forms/ChangePasswordForm";
import {Layout} from "antd";

const {Content} = Layout;
export default class Profile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
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
            </Row>
        </Content>
    }
}
