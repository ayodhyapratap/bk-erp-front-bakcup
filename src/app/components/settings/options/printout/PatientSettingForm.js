import React from 'react';
import {  Form, Checkbox ,} from 'antd';

class PatientSettingForm extends React.Component {
	constructor(props){
		super(props);
		this.state={}
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
      <Form {...formItemLayout}>
      	<h2>Customize Patient Details</h2>
          <Form.Item>
            <Checkbox >Show Patient Details</Checkbox>
            <ul className="subLists">
              <li><Checkbox >Exclude Mediacal History</Checkbox></li>
              <li><Checkbox >Exclude Patient Number</Checkbox></li>
              <li><Checkbox >Exclude address</Checkbox></li>
              <li><Checkbox >Exclude Blood Group</Checkbox></li>
            </ul>
          </Form.Item>
        <Form.Item>
      		<Checkbox >Exclude Patient Gender & DOB</Checkbox>
      	</Form.Item>

      </Form>
    );
  }
}
export default PatientSettingForm;