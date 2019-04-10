import React from 'react';
import {Form, Input,InputNumber ,Button} from 'antd';
import {postAPI, interpolate, getAPI} from "../../../../utils/common";
import {PRACTICE_PRINT_SETTING_API} from "../../../../constants/api";

const {TextArea} =Input;
class FooterSetting extends React.Component{
  constructor(props){
  		super(props)
      this.state={
          type: this.props.type,
          sub_type:this.props.sub_type,
        
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
      console.log("formdta",formData);
      if(!err){
        let reqData = {type:this.state.type, sub_type:this.state.sub_type, id: this.state.print_setting.id, ...formData}
        console.log("test",reqData);
        let successFn = function (data) {
            if (data) {
               console.log(data)
            }
        };
        let errorFn = function () {
            };
        // console.log("id--",this.props.active_practiceId);
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
        console.log("all retrive",JSON.stringify(that.state.print_setting));
      };
      let errorFn = function () {
      };
     getAPI(interpolate(PRACTICE_PRINT_SETTING_API, [this.props.active_practiceId,that.state.type,that.state.sub_type]), successFn, errorFn);
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
        <Form onSubmit={this.handleSubmit}>
        	<h2>Footer Setup</h2>
        	<Form.Item key={'footer_margin_top'} {...formItemLayout} label={(<span>Top Margin&nbsp;</span>)}>
            {getFieldDecorator('footer_margin_top',{
              })(
                <InputNumber  min={0} max={10}/> 
            )}
        	</Form.Item>

        	<Form.Item label={(<span>Full Width Content&nbsp;</span>)}>
        		<TextArea rows={3} />
        	</Form.Item>

        	<Form.Item {...formItemLayout} label={(<span>Left Signature&nbsp;</span>)}>
        		<TextArea rows={2} />
        	</Form.Item>

    		<Form.Item {...formItemLayout} label={(<span>Right Signature&nbsp;</span>)}>
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