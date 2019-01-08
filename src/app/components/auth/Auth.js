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
import AppLogo from '../../assets/img/app_logo.png';
import DynamicFieldsForm from "../common/DynamicFieldsForm";
import {PASSWORD_FIELD, SUCCESS_MSG_TYPE} from "../../constants/dataKeys";
import {PATIENT_CLINIC_NOTES_API, RESET_PASSWORD} from "../../constants/api";
import {displayMessage, interpolate} from "../../utils/common";

class Auth extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const LoginFormLayout = Form.create()(LoginForm);
        const PasswordResetForm = Form.create()(DynamicFieldsForm);

        let tokenDefaultValues = [{
            key: 'code',
            value: (this.props.match && this.props.match.params.token ? this.props.match.params.token : null)
        }];
        let resetPasswordFields = [{
            label: 'Password',
            key: 'password',
            type: PASSWORD_FIELD,
            required: true
        }, {
            label: 'Retype Password',
            key: 're-password',
            type: PASSWORD_FIELD,
            required: true
        }];
        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success")

            },
            errorFn: function () {

            },
            action: RESET_PASSWORD,
            method: "post",
        }
        return <Layout className="loginLayout">

            <Switch>
                <Route path="/password-reset/">
                    <Row>
                        <Col xs={{span: 20, offset: 2}} sm={{span: 16, offset: 4}} md={{span: 12, offset: 6}}
                             lg={{span: 8, offset: 8}} xl={{span: 8, offset: 8}} style={{padding: '35px'}}>
                        </Col>
                        <Col xs={{span: 20, offset: 2}} sm={{span: 16, offset: 4}} md={{span: 12, offset: 6}}
                             lg={{span: 8, offset: 8}} xl={{span: 8, offset: 8}}>
                            <div className="loginFormWrapper">
                                <PasswordResetForm {...this.props}
                                                   formProp={formProp}
                                                   fields={resetPasswordFields}
                                                   defaultValues={tokenDefaultValues}/>
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
                                <img src={AppLogo} alt="" style={{maxWidth: '100%'}}/>
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
