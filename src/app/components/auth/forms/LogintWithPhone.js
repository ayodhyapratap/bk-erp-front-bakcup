import React from 'react';
import {Form, Icon, Input, Button, Divider, Modal} from 'antd';
import{Link, Route, Switch} from "react-router-dom";
import {PHONE, OTP} from "../../../constants/formLabels";
import {displayMessage } from "../../../utils/common";

const FormItem = Form.Item;
class LoginWithPhone extends React.Component{
	constructor(props){
		super(props);
	    this.state = {

	    	
	    }
	 this.handleSubmit = this.handleSubmit.bind(this);

	}



    handleSubmit = (e) => {
	    e.preventDefault();
	    this.props.form.validateFields((err, values) => {
	      if (!err) {
	        console.log('Received values of form: ', values);
	      }
  		});
  	}
	


	render(){
		const {getFieldDecorator} = this.props.form;
		return(
			<Form onSubmit={this.handleSubmit}  className="login-form">
				<FormItem>
					{getFieldDecorator('email', {
                        rules: [{required: true, message: 'Please input your phone!'}],
                    })(
                    	<Input size="large" prefix={<Icon type="phone" style={{color: 'rgba(0,0,0,.25)'}}/>}
                               type="text"
                               placeholder="Phone"/>
                    )}

                    
                </FormItem>

                <FormItem>
                    <Input  size="large" prefix={<Icon type="key" style={{color: 'rgba(0,0,0,.25)'}}/>}
                               type="text"
                               placeholder="otp"/>
                </FormItem>
                <FormItem>
                    <a style={{float: 'right'}} type="primary">
                        Resend Otp ?
                    </a>
                    <Button size="large"  type="primary" htmlType="submit"
                            className="login-form-button">
                        Log in
                    </Button>
                </FormItem>

                <Divider>OR</Divider>
	                <h4>
	                    <Link to={"/"}> <Button size="large"  type="primary" htmlType="submit"
	                            className="login-form-button">Log in with username </Button>
	                        
	                    </Link>
	                </h4>
                <Divider/>

                



			</Form>
			);
	}

}
export default LoginWithPhone;