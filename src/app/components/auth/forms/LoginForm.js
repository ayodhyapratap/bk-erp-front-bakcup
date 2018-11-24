import {Form, Icon, Input, Button, Checkbox, Modal, Divider} from 'antd';
import React from 'react';
import 'antd/dist/antd.css';
import {Link} from "react-router-dom";
import {USERNAME, PASSWORD, SOCIAL_TOKEN} from "../../../constants/formLabels";
import {Redirect} from 'react-router';
import {displayMessage, getAPI, interpolate, postAPI} from "../../../utils/common";
const FormItem = Form.Item;


class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      username: null,
      resetModalVisible: false,
      userMail: '',
      redirect : null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showResetModal = this.showResetModal.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    let that = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = {
          [USERNAME]: values.userName,
          [PASSWORD]: values.password
        };
        that.props.login(data)
      }
    });
  }

  showResetModal() {
    this.setState({
      resetModalVisible: true
    });
  }

  render() {
    const username = this.state.username;
    const {getFieldDecorator} = this.props.form;
    if(this.state.redirect)
      return <Redirect to={this.state.redirect}/>
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{required: true, message: 'Please input your username!'}],
          })(
            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Username or Email"/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{required: true, message: 'Please input your Password!'}],
          })(
            <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                   placeholder="Password"/>
          )}
        </FormItem>

        <FormItem>
          {/*{getFieldDecorator('remember', {*/}
          {/*valuePropName: 'checked',*/}
          {/*initialValue: true,*/}
          {/*})(*/}
          {/*<Checkbox>Remember me</Checkbox>*/}
          {/*)}*/}
          {/*<a className="login-form-forgot" href="">Forgot password</a>*/}
          <a style={{float: 'right'}} type="primary" onClick={this.showResetModal}>
            Forgot Password ?
          </a>
          <Button loading={this.state.changePassLoading} type="primary" htmlType="submit"
                  className="login-form-button">
            Log in
          </Button>

          <h4> Dont have an account?<Link to="/register"> Register Now! </Link>

          </h4>
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
