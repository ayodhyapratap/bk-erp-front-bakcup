import React from "react";
import {Card, Row, Form, Col, List, Button, Table, InputNumber, Input, Icon} from 'antd';
import {displayMessage, getAPI, interpolate, postAPI} from "../../../utils/common";
import {LABTEST_API} from "../../../constants/api";
import {WARNING_MSG_TYPE} from "../../../constants/dataKeys";
import {remove} from 'lodash';

class PatientLabOrders extends React.Component{
    constructor(props){
        super(props);
        this.state={
        	lab_test:[],
        	tableFormValues: [],
        	addedLabs : {}
        }
    }

    componentDidMount() {
        this.loadLabs();
    }

    loadLabs(){
    	var that =this;
    	let successFn = function(data){
    		that.setState({
    			lab_test: data,
    		})
    	};
    	let errorFn = function(){

    	};
    	getAPI(interpolate(LABTEST_API, [that.props.active_practiceId]), successFn, errorFn);
    }

    calculateItem = (_id) => {
        const {getFieldsValue} = this.props.form;
        console.log(getFieldsValue());
        this.setState(function (prevState) {
            let newtableFormValues = [...prevState.tableFormValues];
            newtableFormValues.forEach(function (item) {

            });
        });
    }
    
    removeTests = (_id,item) => {
        this.setState(function (prevState) {
            return {
            	addedLabs:{...prevState.addedLabs,[item.id]:false},
                tableFormValues: [...remove(prevState.tableFormValues, function (item) {
                    return item._id != _id;
                })]
            }
        });
    }
    add = (item) => {
    	console.log("item",item);
        this.setState(function (prevState) {
        	console.log("preview",prevState);
            let randId = Math.random().toFixed(7);
            if(prevState.addedLabs[item.id]){
            	displayMessage(WARNING_MSG_TYPE,"Item Already Added");
            	return false;
            }
            return {
            	addedLabs:{...prevState.addedLabs,[item.id]:true},
                tableFormValues: [...prevState.tableFormValues, {
                    ...item,
                    _id: randId,
                }]
            }
        });
    };

     handleSubmit = (e) => {
        let that = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let reqData = {
                    treatment: [],
                    patient: that.props.match.params.id
                };
                that.state.tableFormValues.forEach(function (item) {
                    item.cost = values.cost[item._id];
                    let sendingItem = {
                        "name": item.id,
                        "cost": item.cost,
                        "instruction":item.instruction,
                        "is_active":true,
                        "practice":item.practice,
                        "margin":item.margin,
                        
                    };
                    reqData.treatment.push(sendingItem);
                });
                let successFn = function (data) {
                    displayMessage("Inventory updated successfully");
                    
                }
                let errorFn = function () {

                }
                console.log("DataSet",reqData);
                postAPI(interpolate("API name" [that.props.match.params.id]), reqData, successFn, errorFn);
            }
        });
    }


    render(){
    	let that = this;
        const {getFieldDecorator, getFieldValue, getFieldsValue} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 20},
            },
        };
        const formItemLayoutWithOutLabel = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 24},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 24},
            },
        };
        const coloums = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => <span>
                <b>{name}</b><br/>
                    <Form.Item
                        key={`default_notes[${record._id}]`}
                        {...formItemLayout}>
                        {getFieldDecorator(`notes[${record._id}]`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                message: "This field is required.",
                            }],
                            initialValue: record.default_notes
                        })}
                    </Form.Item>
                   
                </span>
        }, {
            title: 'Cost',
            dataIndex: 'cost',
            key: 'cost',
            render: (name, record) => <span><Form.Item
                key={`cost[${record._id}]`}
                {...formItemLayout}>
                {getFieldDecorator(`cost[${record._id}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                        required: true,
                        message: "This field is required.",
                    }],
                    initialValue: record.cost
                })}
            </Form.Item>
            </span>
        },  {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (total, record) => <span>
                {total}
                <a onClick={() => this.removeTests(record._id,record)}>
                    <Icon type="close-circle" theme="twoTone" twoToneColor={"#f00"}/>
                </a>
            </span>
        }];
        return <div>
            <Form onSubmit={this.handleSubmit}>
                <Card title={"Patient Lab Orders"} bodyStyle={{padding: 0}}
                      extra={<Form.Item {...formItemLayoutWithOutLabel} style={{marginBottom: 0}}>
                          <Button type="primary" htmlType="submit">Save Lab Orders</Button>
                      </Form.Item>}>
                    <Row gutter={16}>
                        <Col span={7}>
                            <List size={"small"}
                                  itemLayout="horizontal"
                                  dataSource={this.state.lab_test}
                                  renderItem={item => (
                                      <List.Item>
                                          <List.Item.Meta
                                              title={item.name}/>
                                          <Button type="primary" size="small" shape="circle"
                                                  onClick={() => this.add(item)}
                                                  icon={"arrow-right"}/>
                                      </List.Item>)}/>
                        </Col>
                        <Col span={17}>

                            <Table pagination={false}
                                   bordered={true}
                                   dataSource={this.state.tableFormValues}
                                   columns={coloums}/>


                        </Col>
                    </Row>
                </Card>
            </Form>
        </div>
    }
}
export default Form.create()(PatientLabOrders);
