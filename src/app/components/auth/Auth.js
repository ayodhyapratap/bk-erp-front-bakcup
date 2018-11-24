import React from "react";
import LoginForm from "./forms/LoginForm";
// import RegisterForm from "./forms/RegisterForm";
import {Col, Divider, Form, Layout, Row} from "antd";
import {Link, Route, Switch} from "react-router-dom";
import '../../assets/auth.css';
// import TermsCondition from "../common/TermsCondition";
// import PrivacyPolicy from "../common/PrivacyPolicy";
// import VerifyEmail from "./VerifyEmail";
// import ForgotPass from "./ForgotPass";

class Auth extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const LoginFormLayout = Form.create()(LoginForm);
  //  const RegisterFormLayout = Form.create()(RegisterForm);
    return <Layout className="loginLayout">
      <Switch>
      <Route exact path="/register" >
          <Row>
            <Col xs={{span: 20, offset: 2}} sm={{span: 16, offset: 4}} md={{span: 12, offset: 6}}
                 lg={{span: 8, offset: 8}} xl={{span: 8, offset: 8}} style={{padding: '35px'}}>
              </Col>
            <Col xs={{span: 20, offset: 2}} sm={{span: 16, offset: 4}} md={{span: 12, offset: 6}}
                 lg={{span: 8, offset: 8}} xl={{span: 8, offset: 8}}>
              <div className="loginFormWrapper">
{/*                <RegisterFormLayout {...this.props}/>*/}
                <Divider/>
                <h4>
                  <Link to="/terms">Terms & Conditions </Link>
                  <Divider type="vertical"/>
                  <Link to="/privacypolicy">Privacy Policy</Link></h4>
              </div>
            </Col>
          </Row>
        </Route>
        <Route>
          <Row>
            <Col xs={{span: 20, offset: 2}} sm={{span: 16, offset: 4}} md={{span: 12, offset: 6}}
                 lg={{span: 8, offset: 8}} xl={{span: 8, offset: 8}} style={{padding: '35px'}}>
            </Col>
            <Col xs={{span: 20, offset: 2}} sm={{span: 16, offset: 4}} md={{span: 12, offset: 6}}
                 lg={{span: 8, offset: 8}} xl={{span: 8, offset: 8}} style={{padding: '35px'}}>
              <div className="loginFormWrapper">
                <LoginFormLayout {...this.props} login={this.props.login}/>
                <Divider/>
                <h4>
                  <Link to="/terms">Terms & Conditions </Link>
                  <Divider type="vertical"/>
                  <Link to="/privacypolicy">Privacy Policy</Link></h4>
              </div>
            </Col>
          </Row>
        </Route>
      </Switch>
    </Layout>
  }
}


export default Auth;
