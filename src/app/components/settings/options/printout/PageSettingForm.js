import React from 'react';
import {  Form, Select, Input, Radio ,InputNumber,Avatar, Button } from 'antd';
import {postAPI, interpolate} from "../../../../utils/common";
import {PRACTICE_PRINT_SETTING_API} from "../../../../constants/api";


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
      type: this.props.type,
      subType:this.props.subType,
      active_practiceId: this.props.active_practiceId,
    } 
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let that = this;
    let data={};
    this.props.form.validateFields((err, formData) => {
      if(!err){
        let reqData = {type:this.state.type, subType:this.state.subType,...formData}
        console.log("test",reqData);
        let successFn = function (data) {
            if (data) {
               console.log(data)
            }
        };
        let errorFn = function () {
            };
        // console.log("id--",this.props.active_practiceId);
        postAPI(interpolate(PRACTICE_PRINT_SETTING_API, [this.state.active_practiceId]), reqData, successFn, errorFn);
      }
    });
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
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}  {...formItemLayout} >
      	<h2>Page Setup</h2>
        <Form.Item key={'page_size'} label={(<span>Paper Size&nbsp;</span>)} >
          {getFieldDecorator('page_size', {
            })  (<Select style={{ width: 120 }}>
                  {OptionList}
                </Select>
              )
          }
        </Form.Item>

      	<Form.Item key={'page_orientation'} label={(<span>Orientation&nbsp;</span>)} >
          {getFieldDecorator('page_orientation', {
             })  ( <RadioGroup onChange={(e)=>this.onChanged('orientation',e.target.value)} >
                  		<Radio >Portrait</Radio>
                  		<Radio >Landscape</Radio>
                    </RadioGroup>
                   )
           }
      	</Form.Item>

        <Form.Item key={'page_print_type'} label={(<span>Printer Type&nbsp;</span>)}>
          {getFieldDecorator('page_print_type',{
          })( <RadioGroup onChange={(e)=>this.onChanged('printerType',e.target.value)}>
               <Radio>Color <span className="lightColor" >Inkjet/Laser</span></Radio>
                <Radio>Black <span className="lightColor">Dot Matrix/Thermal Printers</span></Radio>
              </RadioGroup>
          )}
       	
        </Form.Item>
       
        <Form.Item key={'page_margin_top'} label={(<span>Top Margin</span>)}>
            {getFieldDecorator('page_margin_top',{
            })(
              <InputNumber  min={0} max={10}/> 
          )}
        </Form.Item>

        <Form.Item key={'page_margin_left'} label={(<span>Left Margin</span>)}>
            {getFieldDecorator('page_margin_left',{
            })(
              <InputNumber  min={0} max={10}/> 
          )}
        </Form.Item>

        <Form.Item key={'page_margin_bottom'} label={(<span>Bottom Margin</span>)}>
            {getFieldDecorator('page_margin_bottom',{
            })(
              <InputNumber  min={0} max={10}/> 
          )}
        </Form.Item>

        <Form.Item key={'page_margin_right'} label={(<span>Right Margin</span>)}>
            {getFieldDecorator('page_margin_right',{
            })(
              <InputNumber  min={0} max={10}/> 
          )}
        </Form.Item>

     
        <Form.Item>
          <Button  type="primary" htmlType="submit">Submit</Button>
        </Form.Item>

      </Form>
    );
  }
}
export default PageSettingForm;	