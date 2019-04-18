import React from "react";
import {Card, Row, Form, Col, List, Button, Table, InputNumber, Input, Icon} from 'antd';
import {displayMessage, getAPI, interpolate, postAPI} from "../../../utils/common";
import {PROCEDURE_CATEGORY, TREATMENTPLANS_API} from "../../../constants/api";
import {remove} from 'lodash';


class AddorEditDynamicTreatmentPlans extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingProcedures: true,
            procedure_category: [],
            tableFormValues: [],
            addNotes: {}
        }
    }

    componentDidMount() {
        this.loadProcedures();
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
    addNotes = (_id, option) => {
        this.setState(function (prevState) {
            return {addNotes: {...prevState.addNotes, [_id]: !!option}}
        })
    }
    removeTreatment = (_id) => {
        this.setState(function (prevState) {
            return {
                tableFormValues: [...remove(prevState.tableFormValues, function (item) {
                    return item._id != _id;
                })]
            }
        });
    }
    add = (item) => {
        this.setState(function (prevState) {
            let randId = Math.random().toFixed(7);
            return {
                addNotes: {...prevState.addNotes, [randId]: !!item.default_notes},
                tableFormValues: [...prevState.tableFormValues, {
                    ...item,
                    _id: randId,
                }]
            }
        });
    };

    loadProcedures() {
        var that = this;
        let successFn = function (data) {
            that.setState({
                procedure_category: data,
                loadingProcedures: false
            })
        };
        let errorFn = function () {
            that.setState({
                loadingProcedures: false
            })
        };

        getAPI(interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]), successFn, errorFn);
    }

    handleSubmit = (e) => {
        let that = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let reqData = {
                    treatment: [],
                    patient: that.props.match.params.id
                };
                that.state.tableFormValues.forEach(function (item) {
                    console.log(item);
                    item.quantity = values.quantity[item._id];
                    item.cost = values.cost[item._id];
                    item.discount = values.discount[item._id];
                    if (values.notes)
                        item.notes = values.notes[item._id];
                    let sendingItem = {
                        "procedure": item.id,
                        "cost": item.cost,
                        "quantity": item.quantity,
                        "margin": item.margin,
                        "default_notes": item.notes,
                        "is_active": true,
                        "is_completed": false,
                        "practice": that.props.active_practiceId,
                        "discount": item.discount,
                        "discount_type": "%"
                    };
                    reqData.treatment.push(sendingItem);
                });
                let successFn = function (data) {
                    displayMessage("Inventory updated successfully");
                    that.props.loadData();
                    let url = '/patient/' + that.props.match.params.id + '/billing/invoices';
                    that.props.history.push(url);
                }
                let errorFn = function () {

                }
                console.log("Same adta",JSON.stringify(reqData));
                postAPI(interpolate(TREATMENTPLANS_API, [that.props.match.params.id]), reqData, successFn, errorFn);
            }
        });
    }

    render() {
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
        const consumeRow = [{
            title: 'Treatments',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => <span>
                <b>{name}</b><br/>
                {this.state.addNotes[record._id] ?
                    <Form.Item
                        key={`default_notes[${record._id}]`}
                        {...formItemLayout}>
                        {getFieldDecorator(`notes[${record._id}]`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                message: "This field is required.",
                            }],
                            initialValue: record.default_notes
                        })(
                            <Input.TextArea min={0} placeholder={"Notes..."}/>
                        )}
                    </Form.Item>
                    : <a onClick={() => this.addNotes(record._id, true)}>+ Add Note</a>}
                </span>
        }, {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (name, record) => <Form.Item
                key={`quantity[${record._id}]`}
                {...formItemLayout}>
                {getFieldDecorator(`quantity[${record._id}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                        required: true,
                        message: "This field is required.",
                    }],
                    initialValue: 1
                })(
                    <InputNumber min={0} placeholder="Quantity" size={'small'}
                                 onChange={() => this.calculateItem(record._id)}/>
                )}
            </Form.Item>
        }, {
            title: 'Cost',
            dataIndex: 'cost',
            key: 'cost',
            render: (name, record) => <Form.Item
                key={`cost[${record._id}]`}
                {...formItemLayout}>
                {getFieldDecorator(`cost[${record._id}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                        required: true,
                        message: "This field is required.",
                    }],
                    initialValue: record.cost
                })(
                    <InputNumber min={0} placeholder="Cost" size={'small'}
                                 onChange={() => this.calculateItem(record._id)}/>
                )}
            </Form.Item>
        }, {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
            render: (name, record) => <Form.Item
                key={`discount[${record._id}]`}
                {...formItemLayout}>
                {getFieldDecorator(`discount[${record._id}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                        required: true,
                        message: "This field is required.",
                    }],
                })(
                    <InputNumber min={0} placeholder="Discount" size={'small'}
                                 onChange={() => this.calculateItem(record._id)}/>
                )} %
            </Form.Item>
        }, {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (total, record) => <span>
                {total}
                <a onClick={() => this.removeTreatment(record._id)}>
                    <Icon type="close-circle" theme="twoTone" twoToneColor={"#f00"}/>
                </a>
            </span>
        }];
        return <div>
            <Form onSubmit={this.handleSubmit}>
                <Card title={"Treatment Plans"} bodyStyle={{padding: 0}}
                      extra={<Form.Item {...formItemLayoutWithOutLabel} style={{marginBottom: 0}}>
                          <Button type="primary" htmlType="submit">Save Treatment Plan</Button>
                      </Form.Item>}>
                    <Row gutter={16}>
                        <Col span={7}>
                            <List size={"small"}
                                  itemLayout="horizontal"
                                  dataSource={this.state.procedure_category}
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
                                   columns={consumeRow}/>


                        </Col>
                    </Row>
                </Card>
            </Form>
        </div>
    }
}

export default Form.create()(AddorEditDynamicTreatmentPlans)
