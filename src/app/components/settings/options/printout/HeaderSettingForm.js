import React from 'react';
import {  Form, Input, Radio ,Avatar, Button } from 'antd';
import {postAPI, interpolate, getAPI} from "../../../../utils/common";
import {PRACTICE_PRINT_SETTING_API} from "../../../../constants/api";

const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

class HeaderSettingForm extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      user: UserList[0],
	      color: colorList[0],
        isHeaderNot:'1',
        islogoNot:'1',
        shrinkType:'1',
        alignType:'rgt',
	    };
	  }
	  changeImage = () => {
	    const index = UserList.indexOf(this.state.user);
	    this.setState({
	      user: index < UserList.length - 1 ? UserList[index + 1] : UserList[0],
	      color: index < colorList.length - 1 ? colorList[index + 1] : colorList[0],
	    });
	  }

    handleSubmit = (e) => {
      e.preventDefault();
      let that = this;
      let data={};
      this.props.form.validateFields((err, formData) => {
        if(!err){
          let reqData = {type:this.state.type, sub_type:this.state.sub_type,...formData}
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



    onChanged = (name,value)=>{
      this.setState({
      [name]:value
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
      <Form onSubmit={this.handleSubmit} >
      	<h2>Customize Header</h2>
      	<Form.Item  {...formItemLayout} label={( <span>Include Header&nbsp;</span>)} >
          <Radio.Group onChange={(e)=>this.onChanged('isHeaderNot',e.target.value)}>
        		<Radio value={1}>Yes</Radio>
        		<Radio value={0}>No , I already have a letter head.</Radio>
          </Radio.Group>
      	</Form.Item>
       
        <Form.Item key={'header_text'} {...formItemLayout} label={( <span>Header&nbsp;</span>)} >
           {getFieldDecorator('header_text',{ initialValue: this.state.print_setting.header_text})
            (<Input /> )
          }
        </Form.Item>
       
       
        <Form.Item {...formItemLayout} label={( <span>Left Text&nbsp;</span>)} >
          {(
            <Input />
          )}
        </Form.Item>

         <Form.Item {...formItemLayout} label={( <span>Right Text&nbsp;</span>)} >
          {(
            <Input />
          )}
        </Form.Item>

         <Form.Item >
         	<lebel> Include Logo&nbsp;
         		<span><Button size="small" style={{ marginLeft: 16,marginRight: 20}} onClick={this.changeImage}>
          			Change
     				</Button>
        		</span>
            <Radio.Group onChange={(e)=>this.onChanged('islogoNot',e.target.value)} value={this.state.islogoNot}>
              <Radio value={1}>Yes</Radio>
              <Radio value={0}>No</Radio>
            </Radio.Group>
            </lebel>
        </Form.Item>

        <Form.Item>
        	<lebel>Logo&nbsp;
        		<Avatar style={{ backgroundColor: this.state.color}} size="large">
	          		{this.state.user}
	       		</Avatar>
        	</lebel>
        	 
        </Form.Item>

        <Form.Item label={(<span>Type&nbsp;</span>)}>
          <Radio.Group onChange={(e)=>this.onChanged('shrinkType',e.target.value)} value={this.state.shrinkType}>
            <Radio value={1}>Square</Radio>
            <Radio value={2}>Narrow</Radio>
            <Radio value={3}>Wide</Radio>
          </Radio.Group>  
        </Form.Item>

        <Form.Item label={(<span>Alignment&nbsp;</span>)}>
          <Radio.Group onChange={(e)=>this.onChanged('alignType',e.target.value)} value={this.state.alignType}>
            <Radio value={'rgt'}>Right</Radio>
            <Radio value={'lgt'}>Left</Radio>
            <Radio value={'ctr'}>Centre</Radio>
          </Radio.Group>  
        </Form.Item>
         <Form.Item>
          <Button  type="primary" htmlType="submit">Submit</Button>
        </Form.Item>

      </Form>
    );
  }
}
export default HeaderSettingForm;	