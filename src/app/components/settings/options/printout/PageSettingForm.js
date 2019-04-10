import React from 'react';
import {Form, Select, Input, Radio ,InputNumber,Avatar, Button } from 'antd';
import {postAPI, interpolate, getAPI} from "../../../../utils/common";
import {PRACTICE_PRINT_SETTING_API} from "../../../../constants/api";


const Option = Select.Option;
const RadioGroup = Radio.Group;
const PaperSize =['A2','A3','A4','A5'];
const OptionList=PaperSize.map((PaperSize)=><Select.Option value={PaperSize}>{PaperSize}</Select.Option>)

class PageSettingForm extends React.Component {
	constructor(props){
    super(props);
    this.state={
      type: this.props.type,
      sub_type:this.props.sub_type,
      print_setting:{
        page_size:'A4'
      }
       // active_practiceId: this.props.active_practiceId,
     }
    this.loadData = this.loadData.bind(this);

  }

  componentDidMount(){
    this.loadData();
  }


  handleSubmit = (e) => {
    e.preventDefault();
    let that = this;
    let data={};
    this.props.form.validateFields((err, formData) => {
      if(!err){
        let reqData = {type:this.state.type, sub_type:this.state.sub_type, id: this.state.print_setting.id, ...formData}
        let successFn = function (data) {
            if (data) {
               console.log(data)
            }
        };
        let errorFn = function () {
        };
        console.log("test",reqData);
        console.log("id",this.state.print_setting.id);
        postAPI(interpolate(PRACTICE_PRINT_SETTING_API, [this.props.active_practiceId]), reqData, successFn, errorFn);
      }
    });
  }

  loadData(){
    var that = this;
      let successFn = function (data) {
        if(data.length)
        that.setState({
          print_setting:data[0],
        })
        // console.log("all retrive",JSON.stringify(that.state.print_setting));
      };
      let errorFn = function () {
      };
     getAPI(interpolate(PRACTICE_PRINT_SETTING_API, [this.props.active_practiceId,that.state.type,that.state.sub_type]), successFn, errorFn);
  }

  
  onChanged = (name ,value) => {
    this.setState({
      [name]:value,
    });

  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
        md: { span: 8 },
          lg: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
        md: { span: 16 },
          lg: { span: 16 },
      },
    };
   


    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}   key={this.state.print_setting.id}>
      	<h2>Page Setup</h2>
        <Form.Item key={'page_size'} {...formItemLayout} label={"Paper Size"} >
          {getFieldDecorator('page_size', { initialValue: this.state.print_setting.page_size
            })  (<Select style={{ width: '100%' }}>
                  {OptionList}
                </Select>
              )
          }
        </Form.Item>

      	<Form.Item label={"Orientation"} {...formItemLayout} >
          {getFieldDecorator('page_orientation', {  initialValue: this.state.print_setting.page_orientation
             })  ( <RadioGroup onChange={(e)=>this.onChanged('orientation',e.target.value)}>
                  		<Radio value="PORTRAIT">Portrait</Radio>
                  		<Radio value="LANDSCAPE">Landscape</Radio>
                    </RadioGroup>
                   )
           }
      	</Form.Item>

        <Form.Item label={(<span>Printer Type&nbsp;</span>)} {...formItemLayout}>
          {getFieldDecorator('page_print_type',{ initialValue: this.state.print_setting.page_print_type
          })( <RadioGroup onChange={(e)=>this.onChanged('printerType',e.target.value)}>
               <Radio value="COLOR">Color <span className="lightColor" >Inkjet/Laser</span></Radio>
                <Radio value="BLACK">Black <span className="lightColor">Dot Matrix/Thermal Printers</span></Radio>
              </RadioGroup>
          )}
       	
        </Form.Item>
       
        <Form.Item key={'page_margin_top'} label={(<span>Top Margin</span>)} {...formItemLayout}>
            {getFieldDecorator('page_margin_top',{initialValue: this.state.print_setting.page_margin_top
            })(
              <InputNumber  min={0} max={10}/> 
          )}
        </Form.Item>

        <Form.Item key={'page_margin_left'} label={(<span>Left Margin</span>)} {...formItemLayout}>
            {getFieldDecorator('page_margin_left',{
            })(
              <InputNumber  min={0} max={10}/> 
          )}
        </Form.Item>

        <Form.Item key={'page_margin_bottom'} label={(<span>Bottom Margin</span>)} {...formItemLayout}>
            {getFieldDecorator('page_margin_bottom',{
            })(
              <InputNumber  min={0} max={10}/> 
          )}
        </Form.Item>

        <Form.Item key={'page_margin_right'} label={(<span>Right Margin</span>)} {...formItemLayout}>
            {getFieldDecorator('page_margin_right',{
            })(
              <InputNumber  min={0} max={10}/> 
          )}
        </Form.Item>

     
        <Form.Item {...formItemLayout}>
          <Button  type="primary" htmlType="submit">Submit</Button>
        </Form.Item>

      </Form>
    );
  }
}
export default PageSettingForm;	