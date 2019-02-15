import {Form, Icon, Input, Button, Checkbox, Modal, Divider} from 'antd';
import React from 'react';
import 'antd/dist/antd.css';
import {Link} from "react-router-dom";
import {EMAIL, PASSWORD} from "../../../constants/formLabels";
import {Redirect} from 'react-router';
import {displayMessage, getAPI, interpolate, makeURL, postAPI, postOuterAPI} from "../../../utils/common";
import {RESET_PASSWORD_MAIL} from "../../../constants/api";

const FormItem = Form.Item;


class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            username: null,
            userMail: '',
            redirect: null,
            resetModalVisible: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showResetModal = this.showResetModal.bind(this);
        this.changeUserMail = this.changeUserMail.bind(this);
    }

    showResetModal() {
        this.setState({
            resetModalVisible: true
        });
    }

    handleOk = (e) => {
        var that = this;
        console.log(e);
        var successFn = function (data) {
            displayMessage('success', "Link to update your password have been sent to your mail.")
            that.setState({
                resetModalVisible: false,
            });
        }
        var errorFn = function () {

        }
        postOuterAPI(makeURL(RESET_PASSWORD_MAIL), {email: this.state.userMail}, successFn, errorFn);
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            resetModalVisible: false,
        });
    }

    changeUserMail(e) {
        this.setState({
            userMail: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        let that = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let data = {
                    [EMAIL]: values.email,
                    [PASSWORD]: values.password
                };
                that.props.login(data)
            }
        });
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        if (this.state.redirect)
            return <Redirect to={this.state.redirect}/>
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('email', {
                        rules: [{required: true, message: 'Please input your username!'}],
                    })(
                        <Input size="large" prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                               placeholder="Username or Email"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: 'Please input your Password!'}],
                    })(
                        <Input size="large" prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                               type="password"
                               placeholder="Password"/>
                    )}
                </FormItem>

                <FormItem>
                    <a style={{float: 'right'}} type="primary" onClick={this.showResetModal}>
                        Forgot Password ?
                    </a>
                    <Button size="large" loading={this.state.changePassLoading} type="primary" htmlType="submit"
                            className="login-form-button">
                        Log in
                    </Button>
                </FormItem>
                <Modal
                    title="Email to Reset Password"
                    visible={this.state.resetModalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="Reset Password"
                >
                    <Input
                        placeholder="Enter your Email"
                        prefix={<Icon type="message" style={{color: 'rgba(0,0,0,.25)'}}/>}
                        onChange={this.changeUserMail}
                    />
                </Modal>
                {this.props.redirect == true && <Redirect push to="/"/>}
            </Form>
        );
    }
}

export default LoginForm;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
