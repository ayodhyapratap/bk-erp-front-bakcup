import React from 'react';
import {  Form, Select, Input, Radio ,InputNumber,Avatar, Button } from 'antd';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const PaperSize =['A2','A3','A4','A5'];
const OptionList=PaperSize.map((PaperSize)=><Select.Option value={PaperSize}>{PaperSize}</Select.Option>)

class PageSettingForm extends React.Component {
	constructor(props){
    super(props);
    this.state={
      orientation:'p',
      printerType:'1',
    }  
  }

  onChanged = (name ,value) => {
    this.setState({
      [name]:value,
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
      	<h2>Page Setup</h2>
      	<Form.Item label={(<span>Paper Size&nbsp;</span>)}>
      	   <Select labelInValue defaultValue={{ key: 'A4' }} style={{ width: 120 }}>
		          {OptionList}
  		      </Select>
        	</Form.Item>

      	<Form.Item label={(<span>Orientation&nbsp;</span>)} >
          <RadioGroup onChange={(e)=>this.onChanged('orientation',e.target.value)} value={this.state.orientation}>
        		<Radio value={'p'}>Portrait</Radio>
        		<Radio value={'l'}>Landscape</Radio>
           </RadioGroup>
      	</Form.Item>

       <Form.Item label={(<span>Printer Type&nbsp;</span>)}>
       		<RadioGroup onChange={(e)=>this.onChanged('printerType',e.target.value)} value={this.state.printerType}>
	       		<Radio value={1}>Color <span className="lightColor" >Inkjet/Laser</span></Radio>
	       		<Radio value={0}>Black <span className="lightColor">Dot Matrix/Thermal Printers</span></Radio>
	       	</RadioGroup>
       </Form.Item>
       
       <Form.Item label={(<span>Top Margin</span>)}>
          <InputNumber  min={0} max={10} /><span>Inches</span>
       </Form.Item>

       <Form.Item label={(<span>Left Margin</span>)}>
          <InputNumber  min={0} max={10} /><span>Inches</span>
       </Form.Item>

       <Form.Item label={(<span>Bottom Margin</span>)}>
          <InputNumber  min={0} max={10} /><span>Inches</span>
       </Form.Item>

       <Form.Item label={(<span>Right Margin</span>)}>
          <InputNumber  min={0} max={10} /><span>Inches</span>
       </Form.Item>

      </Form>
    );
  }
}
export default PageSettingForm;	