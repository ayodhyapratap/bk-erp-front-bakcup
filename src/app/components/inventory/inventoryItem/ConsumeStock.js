import React from "react";
import {Button, Card,   Form, Input,Icon,Modal, List, Row, Col, Tag, Divider, Popconfirm, Table, Tabs,} from "antd";
import {getAPI, interpolate, deleteAPI} from "../../../utils/common";

import {INVENTORY_ITEM_TYPE, DRUG, SUPPLIES, EQUIPMENT} from "../../../constants/hardData";
import {INVENTORY_ITEM_API, SINGLE_INVENTORY_ITEM_API, MANUFACTURER_API, TAXES, VENDOR_API} from "../../../constants/api";

const TabPane = Tabs.TabPane;
let id = 0;



class ConsumeStock extends React.Component {
  constructor(props) {
      super(props);
      this.state = {

      }

  }
  componentDidMount(){
    this.loadInventoryItemList();

  }

  loadInventoryItemList() {
      let that = this;
      let successFn = function (data) {
          let drugItems=[];
          let equipmentItems=[];
          let supplesItems=[];
          data.forEach( function(item){
            if(item.item_type==DRUG){
              drugItems.push(item);
            }
            if(item.item_type==SUPPLIES){
              supplesItems.push(item);
            }
            if(item.item_type==EQUIPMENT){
              equipmentItems.push(item);
            }


          })
          that.setState({
            drugItems:drugItems,
            equipmentItems:equipmentItems,
            supplesItems:supplesItems,
          })

      }
      let errorFn = function () {
      }
      getAPI(INVENTORY_ITEM_API, successFn, errorFn);
  }

  ///formdata

  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add = (id) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }



  render(){

    const { getFieldDecorator, getFieldValue, getFieldsValue } = this.props.form;
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
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    console.log(keys);

    const formItems = keys.map((k, index) => (
      <div>
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={k.name}
        required={false}
        key={k}
      >
        {getFieldDecorator(`quantity[${k.id}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{
            required: true,
            whitespace: true,
            message: "Please input passenger's name or delete this field.",
          }],
        })(
          <Input placeholder="quantity" style={{ width: '60%', marginRight: 8 }} />
        )}
        </Form.Item>
        <Form.Item
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={k.name}
          required={false}
          key={k}
        >

        {getFieldDecorator(`batch_no[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{
            required: true,
            whitespace: true,
            message: "Please input passenger's name or delete this field.",
          }],
        })(
          <Input placeholder="batch Number" style={{ width: '60%', marginRight: 8 }} />
        )}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            disabled={keys.length === 1}
            onClick={() => this.remove(k)}
          />
        ) : null}


      </Form.Item>
      </div>
    ));



    return <div>
      <Row>
      <Card>
        <Col span={7}>
        <Card>
        <Tabs defaultActiveKey="1" size="small">
         <TabPane tab="Drugs" key="1">
         <List
            itemLayout="horizontal"
            dataSource={this.state.drugItems}
            renderItem={item => (
             <List.Item>
               <List.Item.Meta

                 title={item.name}
               />
               <Button type="dashed" onClick={()=>this.add(item)} style={{ width: '60%' }}>
                 <Icon type="plus" /> Add field
               </Button>
             </List.Item>
            )}
            />


         </TabPane>
         <TabPane tab="Tab 2" key="2">
         <List
             itemLayout="horizontal"
             dataSource={this.state.supplesItems}
             renderItem={item => (
              <List.Item>
                <List.Item.Meta

                  title={item.name}
                />
              </List.Item>
             )}
             /></TabPane>
         <TabPane tab="Tab 3" key="3">
         <List
            itemLayout="horizontal"
            dataSource={this.state.equipmentItems}
            renderItem={item => (
             <List.Item>

               <List.Item.Meta

                 description={item.name}

               />
             </List.Item>
            )}
            /></TabPane>
       </Tabs>
       </Card>
        </Col>
        <Col span={17}>

        <Form onSubmit={this.handleSubmit}>
          {formItems}

          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>

        </Col>
        </Card>
      </Row>
    </div>

  }


}

export default Form.create()(ConsumeStock);
