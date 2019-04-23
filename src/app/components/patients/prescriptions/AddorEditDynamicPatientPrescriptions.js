import React from "react";
import {Card, Row, Col, Form, Table, Divider, Tabs, List, Button, Input, Select, Radio, InputNumber, Icon, Affix} from 'antd';
import {DRUG_CATALOG, LABTEST_API} from "../../../constants/api";
import {displayMessage, getAPI, interpolate, postAPI} from "../../../utils/common";
import {remove} from "lodash";
import {DURATIONS_UNIT} from "../../../constants/hardData";
import {WARNING_MSG_TYPE} from "../../../constants/dataKeys";
import {PRESCRIPTIONS_API} from "../../../constants/api";

const TabPane = Tabs.TabPane;

class AddorEditDynamicPatientPrescriptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drugList: [],
            labList: [],
            formDrugList: [],
            formLabList: [],
            addInstructions: {},
            changeDurationUnits: {},
            addedLabs: {}
        }
    }

    componentDidMount() {
        this.loadDrugList();
        this.loadLabList()
    }

    loadLabList() {
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

    loadDrugList() {
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

    addDrug(item) {
        this.setState(function (prevState) {
            return {
                formDrugList: [...prevState.formDrugList, {
                    ...item,
                    _id: Math.random()
                }]
            }
        })
    }

    addInstructions = (_id, option) => {
        this.setState(function (prevState) {
            return {addInstructions: {...prevState.addInstructions, [_id]: !!option}}
        })
    }
    changeDurationUnits = (_id, option) => {
        this.setState(function (prevState) {
            return {changeDurationUnits: {...prevState.changeDurationUnits, [_id]: !!option}}
        })
    }
    removeDrug = (_id) => {
        this.setState(function (prevState) {
            return {
                formDrugList: [...remove(prevState.formDrugList, function (item) {
                    return item._id != _id;
                })]
            }
        });
    }
    removeLabs = (_id, item) => {
        this.setState(function (prevState) {
            return {
                addedLabs: {...prevState.addedLabs, [item.id]: false},
                formLabList: [...remove(prevState.formLabList, function (item) {
                    return item._id != _id;
                })]
            }
        });
    }
    addLabs = (item) => {
        console.log("item", item);
        this.setState(function (prevState) {
            console.log("preview", prevState);
            let randId = Math.random().toFixed(7);
            if (prevState.addedLabs[item.id]) {
                displayMessage(WARNING_MSG_TYPE, "Item Already Added");
                return false;
            }
            return {
                addedLabs: {...prevState.addedLabs, [item.id]: true},
                // addNotes: {...prevState.addNotes, [randId]: !!item.default_notes},
                formLabList: [...prevState.formLabList, {
                    ...item,
                    _id: randId,
                }]
            }
            // console.log("ide",this.state.tableFormValues);
        });
    };

     handleSubmit = (e) => {
        let that = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log("form",values);
            if (!err) {
                let reqData = {
                    drugs: [],
                    labs:[],
                    patient: that.props.match.params.id,
                    practice:that.props.active_practiceId,
                };

                that.state.formDrugList.forEach(function (item){
                       console.log("drug h",item);
                    item.dosage = values.does[item._id];
                    item.duration_type = values.duration_unit[item._id];

                    if(values.instruction)
                        item.instructions =values.instruction[item._id];
                    const drugIitem ={
                        "drug": item.id,
                        "name":item.name,
                        "dosage": item.dosage,
                        "frequency": item.frequency,
                        "duration_type": item.duration_type,
                        "instuction" :item.instructions,
                        "before_food":true,
                        "after_food":false,
                        "is_active" :true,
                    };
                    reqData.drugs.push(drugIitem)
                });

                that.state.formLabList.forEach(function (item) {
                    
                    reqData.labs.push(item);
                });
                // console.log("data set",JSON.stringify(reqData));
                let successFn = function (data) {
                }
                let errorFn = function () {

                }
                postAPI(interpolate(PRESCRIPTIONS_API, [that.props.match.params.id]), reqData, successFn, errorFn);
            }
        });
    }


    render() {
        let that = this;
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
        const {getFieldDecorator, getFieldValue, getFieldsValue} = this.props.form;
        const drugTableColumns = [{
            title: 'Drug Name',
            dataIndex: 'name',
            key: 'name',
            render: name => <h2>{name}</h2>
        }, {
            title: 'Dosage & Frequency',
            dataIndex: 'dosage',
            key: 'dosage',
            render: (dosage, record) => <div><Form.Item
                extra={<span>does(s)</span>}
                key={`does[${record._id}]`}>
                {getFieldDecorator(`does[${record._id}]`, {
                    validateTrigger: ['onChange', 'onBlur']},
                    { rules: [{ message: "This field is required.",}],
                })(
                    <InputNumber min={0} size={"small"}/>
                )}

            </Form.Item>
                <Form.Item
                    key={`does_frequency[${record._id}]`}>
                    {getFieldDecorator(`does_frequency[${record._id}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            message: "This field is required.",
                        }],
                        initialValue: 'day(s)'
                    })(
                        <Select size={"small"} onChange={() => this.changeDurationUnits(record._id, false)}>
                            {DURATIONS_UNIT.map(item => <Select.Option
                                value={item.value}>{item.label}</Select.Option>)}
                        </Select>
                    )}
                </Form.Item>
            </div>
        }, {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            render: (duration, record) => <div>
                <Form.Item
                    key={`duration[${record._id}]`}>
                    {getFieldDecorator(`duration[${record._id}]`, {
                        validateTrigger: ['onChange', 'onBlur']},
                       {
                        rules: [{ message: "This field is required.",}],
                    })(
                        <InputNumber min={0} size={"small"}/>
                    )}
                </Form.Item>
                <Form.Item
                    key={`duration_unit[${record._id}]`}>
                    {getFieldDecorator(`duration_unit[${record._id}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            message: "This field is required.",
                        }],
                        initialValue: 'day(s)'
                    })(
                        <Select size={"small"} onChange={() => this.changeDurationUnits(record._id, false)}>
                            {DURATIONS_UNIT.map(item => <Select.Option
                                value={item.value}>{item.label}</Select.Option>)}
                        </Select>
                    )}
                </Form.Item>
            </div>
        }, {
            title: 'Instructions',
            dataIndex: 'instructions',
            key: 'instructions',
            render: (instructions, record) =>
                <div>
                    {/*<Form.Item>*/}
                    {/*<Input/>*/}
                    {/*</Form.Item>*/}
                    {this.state.addInstructions[record._id] ?
                        <Form.Item
                            extra={<a onClick={() => this.addInstructions(record._id, false)}>Remove Instructions</a>}
                            key={`instructions[${record._id}]`}>
                            {getFieldDecorator(`instructions[${record._id}]`, {
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [{
                                    message: "This field is required.",
                                }],
                            })(
                                <Input.TextArea min={0} placeholder={"Instructions..."} size={"small"}/>
                            )}

                        </Form.Item>
                        : <a onClick={() => this.addInstructions(record._id, true)}>+ Add Instructions</a>}
                </div>
        },
         // 
        //     title:'time'

        // },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render: (instructions, record) => <Form.Item>
                <Button icon={"close"} onClick={() => this.removeDrug(record._id)} type={"danger"} shape="circle"
                        size="small"/>
            </Form.Item>
        }];
        const labTablecolums = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => <span>
                <b>{name}</b>
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
        }, {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (total, record) => <span>
                {total}
                <Button icon={"close"} onClick={() => this.removeLabs(record._id, record)} type={"danger"}
                        shape="circle"
                        size="small"/>
            </span>
        }];
        return <Card title={"Prescriptions"}>
            <Row>
                <Col span={18}>
                    <Form onSubmit={this.handleSubmit}> 
                        <Table pagination={false} bordered={false} columns={drugTableColumns}
                               dataSource={this.state.formDrugList}/>

                        <Divider> Lab Test</Divider>
                        <Table pagination={false} bordered={false} columns={labTablecolums}
                               dataSource={this.state.formLabList}/>
                         <Affix target={() => this.container}>
                           <Button type="primary" htmlType="submit">
                              Save
                            </Button>
                          </Affix>
                    </Form>
                </Col>
                <Col span={6}>
                    <Tabs type="card">
                        <TabPane tab="Drugs" key="1">
                            <List size={"small"}
                                  itemLayout="horizontal"
                                  dataSource={this.state.drugList}
                                  renderItem={item => (
                                      <List.Item onClick={() => this.addDrug(item)}>
                                          <List.Item.Meta
                                              title={item.name}/>
                                      </List.Item>)}/>
                        </TabPane>
                        <TabPane tab="Labs" key="2">
                            <List size={"small"}
                                  itemLayout="horizontal"
                                  dataSource={this.state.labList}
                                  renderItem={item => (
                                      <List.Item onClick={() => this.addLabs(item)}>
                                          <List.Item.Meta
                                              title={item.name}/>
                                      </List.Item>)}/>
                        </TabPane>
                        {/*<TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>*/}
                    </Tabs>
                </Col>
            </Row>
        </Card>
    }
}

export default Form.create()(AddorEditDynamicPatientPrescriptions);
