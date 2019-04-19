import React from "react";
import {Card, Row, Col, Form, Table, Divider, Tabs, List, Button, Input, Select, Radio, InputNumber, Icon} from 'antd';
import {DRUG_CATALOG} from "../../../constants/api";
import {getAPI, interpolate} from "../../../utils/common";
import {remove} from "lodash";
import {DURATIONS_UNIT} from "../../../constants/hardData";

const TabPane = Tabs.TabPane;

class AddorEditDynamicPatientPrescriptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drugList: [],
            formDrugList: [],
            addInstructions: {},
            changeDurationUnits: {}
        }
    }

    componentDidMount() {
        this.loadDrugList();
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

    render() {
        let that = this;
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
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                        message: "This field is required.",
                    }],
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
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            message: "This field is required.",
                        }],
                    })(
                        <InputNumber min={0} size={"small"}/>
                    )}
                </Form.Item>
                {/*{this.state.changeDurationUnits[record._id] ?*/}
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
                {/*: <a onClick={() => this.changeDurationUnits(record._id, true)}>Change</a>*/}
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
            }, {
                title: '',
                dataIndex: 'action',
                key: 'action',
                render: (instructions, record) => <Form.Item>
                <Button icon={"close"} onClick={() => this.removeDrug(record._id)} type={"danger"} shape="circle" size="small"/>
                </Form.Item>
            }];
                return <Card>
                <Row>
                    <Col span={18}>
                        <Form>
                            <Table pagination={false} bordered={false} columns={drugTableColumns}
                                   dataSource={this.state.formDrugList}/>

                            <Divider> Lab Test</Divider>
                            <Table pagination={false} bordered={false} columns={drugTableColumns}
                                   dataSource={this.state.formDrugList}/>
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
                            <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
                            <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
                        </Tabs>
                    </Col>
                </Row>
            </Card>
                }
                }

                export default Form.create()(AddorEditDynamicPatientPrescriptions);
