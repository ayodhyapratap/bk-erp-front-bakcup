import React from 'react';
import {Form, Row, Card, Input, Button, InputNumber, Select, Icon} from "antd";
import {INPUT_FIELD, NUMBER_FIELD, SUCCESS_MSG_TYPE, MULTI_SELECT_FIELD} from "../../../constants/dataKeys";
import {displayMessage, interpolate, getAPI} from "../../../utils/common";
import {Link,Redirect, Route, Switch} from "react-router-dom";
import {PRESCRIPTION_TEMPLATE, LABTEST_API, DRUG_CATALOG} from "../../../constants/api";
const { Option } = Select;

class PrescriptionTemplate extends React.Component {
	constructor(props){
		super(props);
		this.state={
			redirect: false,
			drugList: [],
            labList: [],
            inputMultiple: [{ advice: "" }]
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
   
    handleAddFields= ()=>{
        this.setState({
            inputMultiple:this.state.inputMultiple.concat([{ advice: "" }])
        })
    };
    handleSubmit(){
        console.log("hello");
    }
	changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
            editFields: {},
        });
    }
	render(){ 
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 9 },
          },
        };
		return (
            <Form onSubmit={this.handleSubmit}>
                <Card title={"Prescription Template"}
                      extra={<Form.Item style={{marginBottom: 0}}>
                          <Button type="primary" htmlType="submit">Save</Button>
                      </Form.Item>}>

                    <Form.Item {...formItemLayout} label={"Template Name"}>
                      {getFieldDecorator('namename', {
                       
                      })(
                        <Input />
                      )}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label={"Schedule"}>
                        {getFieldDecorator('schedule', { initialValue: 3 })(
                        <InputNumber min={1} max={10} />
                        )}
                   
                    </Form.Item>

                    <Form.Item {...formItemLayout} label="Drugs">
                        {getFieldDecorator('drug', {})
                        (
                            <Select mode="multiple" placeholder="Please select favourite Drugs">
                            <Option value="red">Red</Option>
                            <Option value="green">Green</Option>
                            <Option value="blue">Blue</Option>
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label="Labs">
                        {getFieldDecorator('Labs', {})
                        (
                            <Select mode="multiple" placeholder="Please select favourite Labs">
                            <Option value="red">Red</Option>
                            <Option value="green">Green</Option>
                            <Option value="blue">Blue</Option>
                            </Select>
                        )}
                    </Form.Item>
                    {this.state.inputMultiple.map((value ,key)=>(
                        <div>
                            <Form.Item {...formItemLayout} label={"Advice"}>
                                {getFieldDecorator('advice')(
                                <Input suffix={<Icon onClick={this.handleAddFields} type="plus-circle" style={{ color: 'rgba(0,0,0,.25)' }} />}/>
                                )}
                           
                            </Form.Item>
                        </div>
                        ))}


                </Card>
            </Form>
        )
	}

}
export default Form.create()(PrescriptionTemplate);