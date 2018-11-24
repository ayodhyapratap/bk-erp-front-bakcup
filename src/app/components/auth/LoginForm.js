import React from "react";
import {Col, Divider, Form, Layout, Card, Row} from "antd";
import {Link, Route, Switch} from "react-router-dom";
import DynamicFieldsForm from "../common/DynamicFieldsForm";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../constants/dataKeys";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        fields: [{
            label: "Username",
            key: "username",
            required: true,
          //  initialValue: "My Name",
            type: INPUT_FIELD
        },{
            label: "Password",
            key: "password",
            required: true,
          //  initialValue: "My Name",
            type: INPUT_FIELD
        },]
      }
  }

  render() {
      const TestFormLayout = Form.create()(DynamicFieldsForm);
      return <Card>  <Row>
          <Col xs={{span: 20, offset: 2}} sm={{span: 16, offset: 4}} md={{span: 12, offset: 6}}
               lg={{span: 8, offset: 8}} xl={{span: 8, offset: 8}} style={{padding: '35px'}}>
            <img src="/assets/img/logo.png" alt="Whisttler Logo" style={{maxWidth: '100%'}}/>
          </Col>
          <Col xs={{span: 20, offset: 2}} sm={{span: 16, offset: 4}} md={{span: 12, offset: 6}}
               lg={{span: 8, offset: 8}} xl={{span: 8, offset: 8}} style={{padding: '35px'}}>
            <div className="loginFormWrapper">
            <TestFormLayout title="Login Form" fields={this.state.fields}/>
              <Divider/>
              <h4>
                <Link to="/terms">Terms & Conditions </Link>
                <Divider type="vertical"/>
                <Link to="/privacypolicy">Privacy Policy</Link></h4>
            </div>
          </Col>
        </Row>
      </Card>
  }
}
export default LoginForm;
