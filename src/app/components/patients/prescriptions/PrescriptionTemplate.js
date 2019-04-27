import React from 'react';
import {Form, Row, Card, Input, Button, InputNumber, Select, Icon} from "antd";
import {INPUT_FIELD, NUMBER_FIELD, SUCCESS_MSG_TYPE, MULTI_SELECT_FIELD} from "../../../constants/dataKeys";
import {displayMessage, interpolate, getAPI, postAPI} from "../../../utils/common";
import {Link,Redirect, Route, Switch} from "react-router-dom";
import {PRESCRIPTION_TEMPLATE, LABTEST_API, DRUG_CATALOG} from "../../../constants/api";
const { Option } = Select;
let id = 0;
class PrescriptionTemplate extends React.Component {
	constructor(props){
		super(props);
		this.state={
			redirect: false,
			drugList: [],
            labList: [],
		}
		this.changeRedirect = this.changeRedirect.bind(this);
		this.loadDrug =this.loadDrug.bind(this);
		this.loadLab = this.loadLab.bind(this);
	}

	componentDidMount() {
        this.loadDrug();
        this.loadLab();
    }
	loadLab() {
        var that = this;
        let successFn = function (data) {
            that.setState({
                labList: data,
            })
        };
        let errorFn = function () {

        };
        getAPI(interpolate(LABTEST_API, [that.props.active_practiceId]), successFn, errorFn);
    }

    loadDrug() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                drugList: data
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(DRUG_CATALOG, [this.props.active_practiceId]), successFn, errorFn);
    }
   
    handleAddFields = () => {
        const { form } = this.props;
        const keys = form.getFieldValue("keys");
        const nextKeys = keys.concat(id++);
        form.setFieldsValue({
          keys: nextKeys
        });
    };
    remove = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
          return;
        }
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
    }
    handleSubmit = (e) => {
        let that = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let reqData = {...values, practice:that.props.active_practiceId

                };
             
                let successFn = function (data) {
                }
                let errorFn = function () {

                }
                console.log("Data",reqData);
            postAPI(interpolate(PRESCRIPTION_TEMPLATE, [this.props.active_practiceId]), reqData, successFn, errorFn);
          }
      });
    }

	changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
            editFields: {},
        });
    }
	render(){ 
        const  { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 4 }
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 }
          }
        };
        const formItemLayoutWithOutLabel = {
          wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 12, offset: 4 }
          }
        };
        getFieldDecorator('keys',{ initialValue: [] } );
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
          <Form.Item  {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}  label={index === 0 ? 'Advice' : ''}
            required={false}
            key={k}
          >
            {getFieldDecorator(`advice_data[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
             
            })(
                <Input style={{ width: '60%', marginRight: 8 }} />
            )}
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(k)}
              />
            ) : null}
          </Form.Item>
        ));
		return (
            <Form onSubmit={this.handleSubmit}>
                <Card title={"Prescription Template"}
                      extra={<Form.Item style={{marginBottom: 0}}>
                          <Button type="primary" htmlType="submit">Save</Button>
                      </Form.Item>}>
                    <Form.Item {...formItemLayout} label={"Template Name"}>
                      {getFieldDecorator('name', {
                       
                      })(
                        <Input />
                      )}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label={"Schedule"}>
                        {getFieldDecorator('schedule', {})(
                        <InputNumber min={1} />
                        )}
                   
                    </Form.Item>

                    <Form.Item {...formItemLayout} label="Drugs">
                        {getFieldDecorator('drug', {})
                        (
                            <Select mode="multiple" placeholder="Please select  Drugs">
                                {this.state.drugList.map((drug) => <option key={drug.id} value={drug.id}>{drug.name}</option>)}
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label="Labs">
                        {getFieldDecorator('labs', {})
                        (
                            <Select mode="multiple" placeholder="Please select Labs">
                                {this.state.labList.map((lab) => <option key={lab.id} value={lab.id}>{lab.name}</option>)}
                            </Select>
                        )}
                    </Form.Item>

                    {formItems}
                    <Form.Item {...formItemLayoutWithOutLabel}>
                      <Button type="dashed" onClick={this.handleAddFields} style={{ width: '60%' }}>
                        <Icon type="plus" /> Add advice field
                      </Button>
                    </Form.Item>
                   
                  


                </Card>
            </Form>
        )
	}

}
export default Form.create()(PrescriptionTemplate);