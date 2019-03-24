import React from 'react';
import {  Form, Input, Radio ,Avatar, Button } from 'antd';

const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

class HeaderSettingForm extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      user: UserList[0],
	      color: colorList[0],
	    };
	  }
	 changeImage = () => {
	    const index = UserList.indexOf(this.state.user);
	    this.setState({
	      user: index < UserList.length - 1 ? UserList[index + 1] : UserList[0],
	      color: index < colorList.length - 1 ? colorList[index + 1] : colorList[0],
	    });
	  }


  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    
    return (
      <Form {...formItemLayout} >
      	<h2>Custome Header</h2>
      	<Form.Item label={( <span>Include Haeder&nbsp;</span>)} >
      		<Radio>Yes</Radio>
      		<Radio className="float_right">No , I already have a letter head.</Radio>
      	</Form.Item>
       
        <Form.Item label={( <span>Header&nbsp;</span>)} >
          {(
            <Input />
          )}
        </Form.Item>
       
       
        <Form.Item label={( <span>Left Text&nbsp;</span>)} >
          {(
            <Input />
          )}
        </Form.Item>

         <Form.Item label={( <span>Right Text&nbsp;</span>)} >
          {(
            <Input />
          )}
        </Form.Item>

         <Form.Item >
         	<lebe> Include Lebel&nbsp;
         		<span><Button size="small" style={{ marginLeft: 16,marginRight: 20}} onClick={this.changeImage}>
          			Change
     				</Button>
        		</span>
            <Radio>Yes</Radio>
            <Radio className="float_right">No</Radio>
            </lebe>
        </Form.Item>

        <Form.Item>
        	<lebel>Logo&nbsp;
        		<Avatar style={{ backgroundColor: this.state.color}} size="large">
	          		{this.state.user}
	       		</Avatar>
        	</lebel>
        	 
        </Form.Item>

      </Form>
    );
  }
}

export default HeaderSettingForm;	