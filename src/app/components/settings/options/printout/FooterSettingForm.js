import React from 'react';
import {Form, Input,InputNumber ,Button} from 'antd';

const {TextArea} =Input;
class FooterSetting extends React.Component{
  constructor(props){
  		super(props);
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
        	<h2>Footer Setup</h2>
        	<Form.Item label={(<span>Top Margin&nbsp;</span>)}>
        		  <InputNumber min={0} max={10}/><span>Inches</span>
        	</Form.Item>

        	<Form.Item label={(<span>Full Width Content&nbsp;</span>)}>
        		<TextArea rows={3} />
        	</Form.Item>

        	<Form.Item label={(<span>Left Signature&nbsp;</span>)}>
        		<TextArea rows={2} />
        	</Form.Item>

    		<Form.Item label={(<span>Right Signature&nbsp;</span>)}>
    			<TextArea rows={2} />
        	</Form.Item>
         <Form.Item>
          <Button  type="primary" htmlType="submit">Submit</Button>
        </Form.Item>

        </Form>
      );
    }
}
export default FooterSetting;	