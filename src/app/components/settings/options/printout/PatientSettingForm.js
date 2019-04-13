import React from 'react';
import {  Form, Checkbox ,} from 'antd';
import {PATIENT_DETAILS_LIST,  EXCLUDE_PATIENT_DOB} from "../../../../constants/hardData";

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
    
    const patientDetailsList = PATIENT_DETAILS_LIST.map((patient_details)=> <li><Checkbox>{patient_details.value}</Checkbox></li>) 
    return (
      <Form {...formItemLayout}>
      	<h2>Customize Patient Details</h2>
          <Form.Item>
            <Checkbox >Show Patient Details</Checkbox>
            <ul className="subLists">
             {patientDetailsList}
            </ul>
          </Form.Item>
        <Form.Item>
      		<Checkbox >{EXCLUDE_PATIENT_DOB}</Checkbox>
      	</Form.Item>

      </Form>
    );
  }
}
export default PatientSettingForm;