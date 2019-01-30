import {
  Form, Icon, Input, Button, Checkbox,Card
} from 'antd';
import React from "react";
import {ROLE_COMMISION, STAFF_ROLES, PRODUCT_LEVEL} from "../../constants/api"
import {displayMessage,getAPI, postAPI, putAPI} from "../../utils/common";
import {SUCCESS_MSG_TYPE} from "../../constants/dataKeys";
let id = 0;


class MLMGenerate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      redirect: false
    }
  }
  componentDidMount(){
    this.loadMlmData();
    this.loadRoles();
    this.loadProductlevels();
  }

  loadMlmData(){
    let that = this;
    let successFn = function (data) {
        that.setState({
            mlmItems: data
        })
    }
    let errorFn = function () {

    }
    getAPI(ROLE_COMMISION, successFn, errorFn);
  }

  loadRoles(){
    let that = this;
    let successFn = function (data) {
        that.setState({
            staffRoles: data
        })
    }
    let errorFn = function () {

    }
    getAPI(STAFF_ROLES, successFn, errorFn);
  }

  loadProductlevels(){
    let that = this;
    let successFn = function (data) {
        that.setState({
            productLevels: data
        });
        data.forEach(function(item){
          that.add(item.name);
        })
    }
    let errorFn = function () {

    }
    getAPI(PRODUCT_LEVEL, successFn, errorFn);
  }


  handleSubmit = (e) => {
    e.preventDefault();
    let that = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        that.setState({changePassLoading: true});
        let data = {}

        let successFn = function(data) {

          displayMessage(SUCCESS_MSG_TYPE, data.message);


        };
        let errorFn = function() {
        };
        postAPI("lflf", data, successFn, errorFn);
      }
    });
  };



  add = (level_name) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(level_name);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }


  render() {
    let that =this
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    let formItems;
    if(that.state.staffRoles){
      formItems= that.state.staffRoles.map(function(role){
      let roleItems;

        roleItems = keys.map(function(k){
          let name=role.id+"/"+k
            return <Form.Item
              {...formItemLayout}
              label={k}
              required={false}
              key={name}

            >
              {getFieldDecorator(name, {
                validateTrigger: ['onChange', 'onBlur'],

              })(
                <Input placeholder="enter " style={{ width: '20%', marginRight: 8 }} />
              )}

            </Form.Item>})

      return  <div>
        <h3>{role.name}</h3>
        {roleItems}
        </div>
    });}

    return (
      <Card>
        <Form onSubmit={this.handleSubmit} className="login-form">

          {formItems}

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
            generate Mlm
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}
export default Form.create()(MLMGenerate);
