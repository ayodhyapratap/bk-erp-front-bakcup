import React from 'react';
import {  Form, Input, Radio ,Avatar, Button, Upload, Icon, message} from 'antd';
import {postAPI, interpolate, getAPI, makeURL} from "../../../../utils/common";
import {PRACTICE_PRINT_SETTING_API, FILE_UPLOAD_API} from "../../../../constants/api";

const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

class HeaderSettingForm extends React.Component {

  	constructor(props) {
      super(props);
      this.state = {
        user: UserList[0],
        color: colorList[0],
        type: this.props.type,
        sub_type:this.props.sub_type,
        isHeaderNot:'1',
        islogoNot:'1',
        shrinkType:'1',
        alignType:'rgt',
      };

      this.loadData = this.loadData.bind(this);
    }

    componentDidMount(){
      this.loadData();
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
          let reqData = {type:this.state.type, sub_type:this.state.sub_type, id:this.state.print_setting.id,...formData}
          // console.log("test",reqData);
          let successFn = function (data) {
              if (data) {
                 console.log(data)
              }
          };
          let errorFn = function () {
              };
          console.log("id--",reqData);
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
    const props = {
    name: 'file',
    action: makeURL(FILE_UPLOAD_API),
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
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
           {getFieldDecorator('header_text')
            (<Input /> )
          }
        </Form.Item>
       
       
        <Form.Item key ={'header_left_text'} {...formItemLayout} label={( <span>Left Text&nbsp;</span>)} >
          {getFieldDecorator('header_left_text')
            (<Input />)
          }
        </Form.Item>

         <Form.Item key={'header_right_text'} {...formItemLayout} label={( <span>Right Text&nbsp;</span>)} >
          {getFieldDecorator('header_right_text')
            (<Input />)
          }
        </Form.Item>

       <Form.Item >
       	<lebel> Include Logo&nbsp;
       		<span><Button size="small" style={{ marginLeft: 16,marginRight: 20}} onClick={this.changeImage}>
        			Change
   				</Button>
      		</span>
          <Radio.Group onChange={(e)=>this.onChanged('islogoNot',e.target.value)}>
            <Radio value={1}>Yes</Radio>
            <Radio value={0}>No</Radio>
          </Radio.Group>
          </lebel>
        </Form.Item>

        <Form.Item key={'logo_path'} label={(<span>Logo&nbsp;</span>)}>
          <span> 
            <Upload >
              <Button>
                <Icon type="upload" /> Click to Upload
              </Button>
            </Upload>
          </span>
      		<Avatar style={{ backgroundColor: this.state.color}} size="large">
          		{this.state.user}
       		</Avatar>
        	 
        </Form.Item>

        <Form.Item key={'logo_type'} label={(<span>Type&nbsp;</span>)}>
          {getFieldDecorator('logo_type')
            (
            <Radio.Group onChange={(e)=>this.onChanged('shrinkType',e.target.value)}>
              <Radio value={1}>Square</Radio>
              <Radio value={2}>Narrow</Radio>
              <Radio value={3}>Wide</Radio>
            </Radio.Group>  
            )}
        </Form.Item>

        <Form.Item key={'logo_alignment'} label={(<span>Alignment&nbsp;</span>)}>
          {getFieldDecorator('logo_alignment')
            (
            <Radio.Group onChange={(e)=>this.onChanged('alignType',e.target.value)}>
              <Radio value="">Right</Radio>
              <Radio value={'lgt'}>Left</Radio>
              <Radio value={'ctr'}>Centre</Radio>
            </Radio.Group>  
            )
          }
        </Form.Item>
         <Form.Item>
          <Button  type="primary" htmlType="submit">Submit</Button>
        </Form.Item>

      </Form>
    );
  }
}
export default HeaderSettingForm;	