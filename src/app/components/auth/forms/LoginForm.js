import {Form, Icon, Input, Button, Checkbox, Modal, Divider} from 'antd';
import React from 'react';
import 'antd/dist/antd.css';
import {Link} from "react-router-dom";
import {EMAIL, PASSWORD} from "../../../constants/formLabels";
import {Redirect} from 'react-router';
import {displayMessage, getAPI, interpolate, postAPI} from "../../../utils/common";
const FormItem = Form.Item;


class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      username: null,
      userMail: '',
      redirect : null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
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
    if(this.state.redirect)
      return <Redirect to={this.state.redirect}/>
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{required: true, message: 'Please input your username!'}],
          })(
            <Input size="large" prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Username or Email"/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{required: true, message: 'Please input your Password!'}],
          })(
            <Input size="large" prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                   placeholder="Password"/>
          )}
        </FormItem>

        <FormItem>

          <Button size="large" loading={this.state.changePassLoading} type="primary" htmlType="submit"
                  className="login-form-button">
            Log in
          </Button>
        </FormItem>
        {this.props.redirect == true && <Redirect push to="/"/>}
      </Form>
    );
  }
}

export default LoginForm;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
