import React from "react";
import {Card, Row, Col, Form, Table, Divider, Tabs, List, Button, Input, Select, Radio, InputNumber, Icon, Affix, Popconfirm} from 'antd';
import {DRUG_CATALOG, LABTEST_API} from "../../../constants/api";
import {displayMessage, getAPI, interpolate, postAPI, putAPI} from "../../../utils/common";
import {remove} from "lodash";
import {DURATIONS_UNIT, DOSE_REQUIRED} from "../../../constants/hardData";
import {WARNING_MSG_TYPE} from "../../../constants/dataKeys";
import {PRESCRIPTIONS_API, PRESCRIPTION_TEMPLATE} from "../../../constants/api";
import PrescriptionTemplate from "./PrescriptionTemplate";
import {Link, Route, Switch} from "react-router-dom";

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
            addedDrugs:{},
            addedLabs: {},
            addTemplate:{},
            formTemplateList:[],

        }
        this.loadPrescriptionTemplate = this.loadPrescriptionTemplate.bind(this);
        this.deletePrescriptionTemplate = this.deletePrescriptionTemplate.bind(this);
    }

    componentDidMount() {
        this.loadDrugList();
        this.loadLabList();
        this.loadPrescriptionTemplate();
    }
    loadPrescriptionTemplate(){
        var that = this;
        let successFn = function(data){
            that.setState({
                prescriptionTemplate:data,
            })
        };
        let errorFn= function(){

        };
        console.log("template",that.state.prescriptionTemplate);
        getAPI(interpolate(PRESCRIPTION_TEMPLATE,[that.props.active_practiceId]), successFn, errorFn)
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
            let randId = Math.random().toFixed(7);
            if(prevState.addedDrugs[item.id]){
                displayMessage(WARNING_MSG_TYPE,"Item Already Added");
                return false;
            }
            return {
                addedDrugs:{...prevState.addedDrugs , [item.id] : true},
                formDrugList: [...prevState.formDrugList, {
                    ...item,
                    _id: randId,
                }]
            }
        });
        
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
        this.setState(function (prevState) {
            let randId = Math.random().toFixed(7);
            console.log("LAb state",prevState);
            if (prevState.addedLabs[item.id]) {
                displayMessage(WARNING_MSG_TYPE, "Item Already Added");
                return false;
            }
            return {
                addedLabs: {...prevState.addedLabs, [item.id]: true},
                formLabList: [...prevState.formLabList, {
                    ...item,
                    _id: randId,
                }]
            }
            // console.log("ide",this.state.tableFormValues);
        });
    };

    addTemplate = (item) => {
        this.setState(function (prevState) {
        // console.log("templateData state",prevState);
            let randId = Math.random().toFixed(7);
            if (prevState.addTemplate[item.id]) {
                displayMessage(WARNING_MSG_TYPE, "Item Already Added");
                return false;
            }
           let prevLabs = [...prevState.formLabList];
           let prevAddedLabs = {...prevState.addedLabs};
           item.labs.forEach(function(lab){
               let randId = Math.random().toFixed(7);
               prevLabs.push({
                     ...lab,
                    _id: randId,
                });
               prevAddedLabs = {...prevAddedLabs,[lab.id]:true}
           });

            let prevDrugs = [...prevState.formDrugList];
            let prevAddedDrugs ={...prevState.addedDrugs};
            item.drug.forEach(function(drugs){
               let randId = Math.random().toFixed(7);
               prevDrugs.push({
                   ...drugs,
                   _id:randId,
                   advice_data:item.advice_data,
               });
               prevAddedLabs = {...prevAddedDrugs, [drugs.id]:true}

            })


            return {
              addedLabs : prevAddedLabs,
              formLabList : prevLabs,
              addedDrugs : prevAddedDrugs,
              formDrugList : prevDrugs
            }

        });
    };
    removeTemplates = (_id, item) => {
        this.setState(function (prevState) {
            return {
                addTemplate: {...prevState.addTemplate, [item.id]: false},
                formTemplateList: [...remove(prevState.formTemplateList, function (item) {
                    return item._id != _id;
                })]
            }
        });
    }
    handleSubmit = (e) => {
        let that = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        console.log("value form",values);
            
            if (!err) {
                
                let reqData = {
                    drugs: [],
                    labs:[],
                    advice_data:[],
                    patient: that.props.match.params.id,
                    practice:that.props.active_practiceId,

                };

                that.state.formDrugList.forEach(function (item){
                    console.log("advice search",item);
                    item.dosage = values.does[item._id];
                    item.duration_type = values.duration_unit[item._id];
                    item.frequency = values.does_frequency[item._id];
                    if(values.instruction){
                        item.instruction=values.instruction[item._id];
                    }
                    if (values.food_time[item._id]) {
                      item.after_food = true;
                      item.before_food =false;
                    } else {
                      item.before_food = true;
                      item.after_food=false;
                    }

                    if(item.advice_data){
                        item.advice_data.map(function(advice){
                            reqData.advice_data.push(advice.id)
                        })
                    }
                    const drugIitem ={
                        "drug": item.id,
                        "name":item.name,
                        "dosage": item.dosage,
                        "frequency": item.frequency,
                        "duration_type": item.duration_type,
                        "instruction" :item.instruction,
                        "before_food":item.before_food,
                        "after_food":item.after_food,
                        "advice_data":that.state.prescriptionTemplate.advice_data,
                        "is_active" :true,
                    };
                    reqData.drugs.push(drugIitem)
                console.log("item drug",item);
                });
                that.state.formLabList.forEach(function (item) {
                    reqData.labs.push(item.id);
                });
                let successFn = function (data) {
                }
                let errorFn = function () {

                }
                console.log("final",reqData);
                postAPI(interpolate(PRESCRIPTIONS_API, [that.props.match.params.id]), reqData, successFn, errorFn);
            }
        });
    }
    deletePrescriptionTemplate(id){
         var that = this;
         let reqData={id:id ,is_active: false};
        let successFn = function (data) {
            that.loadPrescriptionTemplate();
        };
        let errorFn = function () {
        };
        postAPI(interpolate(PRESCRIPTION_TEMPLATE, [that.props.active_practiceId]), reqData ,successFn, errorFn);

    }
    onChange = e => {
        this.setState({});
    };
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
                    validateTrigger: ['onChange', 'onBlur'],

                },
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
                        initialValue: 'twice daily'
                    })(
                        <Select size={"small"} onChange={() => this.changeDurationUnits(record._id, false)}>
                            {DOSE_REQUIRED.map(item => <Select.Option
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
        }, 
            // {this.state.prescriptionTemplate.advice_data ? true:false},
        {
            title: 'Instructions',
            dataIndex: 'instruction',
            key: 'instruction',
            render: (instruction, record) =>
                <div>
                    {this.state.addInstructions[record._id] ?
                        <Form.Item
                            extra={<a onClick={() => this.addInstructions(record._id, false)}>Remove Instructions</a>}
                            key={`instruction[${record._id}]`}>
                            {getFieldDecorator(`instruction[${record._id}]`, {
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
        },{
            title:"Timing",
            dataIndex:"food_time",
            key:'food_time',
            render:(timing, record) => <div>
                <Form.Item key={`food_time[${record._id}]`}>
                  {getFieldDecorator(`food_time[${record._id}]`)(
                    <Radio.Group onChange={this.onChange}>
                      <Radio value={1}>after</Radio>
                      <Radio value={0}>before</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                
            </div>

        },
         
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
            render: (name ,record) =><span>{record.cost}</span>
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
                       <TabPane tab="Template" key="3">
                           <div>
                                <Link to={"/patient/" + this.props.match.params.id + "/prescriptions/template/add"}>
                                    <Button type="primary">
                                        <Icon type="plus"/>&nbsp;Add Template
                                    </Button>
                                </Link>

                           </div>
                            <Divider/>
                           <List size={"small"}
                                  itemLayout="horizontal"
                                  dataSource={this.state.prescriptionTemplate}

                                  renderItem={item => (
                                      <List.Item  onConfirm={() => that.deletePrescriptionTemplate(item.id)}>
                                          <List.Item.Meta onClick={() => this.addTemplate(item)} title={item.name}/>
                                          <Popconfirm title="Are you sure delete this item?"
                                                        onConfirm={() => that.deletePrescriptionTemplate(item.id)} okText="Yes" cancelText="No">
                                                 <a>Delete</a>
                                            </Popconfirm>
                                      </List.Item>)}/>
                        </TabPane>
                    </Tabs>
                </Col>
                <Switch>
                      <Route exact path='/patient/:id/prescriptions/template/add'
                       render={(route) => <PrescriptionTemplate {...this.state} {...route}/>}/>
                </Switch>
            </Row>
        </Card>
    }
}

export default Form.create()(AddorEditDynamicPatientPrescriptions);
