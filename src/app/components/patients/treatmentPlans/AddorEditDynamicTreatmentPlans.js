import React from "react";
import {
    Card,
    Row,
    Form,
    Col,
    List,
    Button,
    Table,
    InputNumber,
    Input,
    Icon,
    Affix,
    Dropdown,
    Menu,
    DatePicker
} from 'antd';
import {displayMessage, getAPI, interpolate, postAPI} from "../../../utils/common";
import {PRACTICESTAFF, PROCEDURE_CATEGORY, TREATMENTPLANS_API} from "../../../constants/api";
import {remove} from 'lodash';
import {Redirect} from 'react-router-dom';
import {DOCTORS_ROLE} from "../../../constants/dataKeys";
import moment from "moment";


class AddorEditDynamicTreatmentPlans extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingProcedures: true,
            procedure_category: [],
            tableFormValues: [],
            addNotes: {},
            practiceDoctors: [],
            selectedDoctor: {},
            selectedDate: moment()
        }
    }

    componentDidMount() {
        this.loadProcedures();
        this.loadDoctors();
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
        let that = this;
        this.setState(function (prevState) {
            let randId = Math.random().toFixed(7);
            return {
                addNotes: {...prevState.addNotes, [randId]: !!item.default_notes},
                tableFormValues: [...prevState.tableFormValues, {
                    ...item,
                    _id: randId,
                }]
            }
        }, function () {
            if (that.bottomPoint)
                that.bottomPoint.scrollIntoView({behavior: 'smooth'});
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

    loadDoctors() {
        let that = this;
        let successFn = function (data) {
            let doctor = [];
            data.staff.forEach(function (usersdata) {
                if (usersdata.role == DOCTORS_ROLE) {
                    doctor.push(usersdata);
                }
            })
            that.setState({
                practiceDoctors: doctor,
                selectedDoctor: doctor.length ? doctor[0] : {}
            });
        };
        let errorFn = function () {
        };
        getAPI(interpolate(PRACTICESTAFF, [this.props.active_practiceId]), successFn, errorFn);
    }

    selectDoctor = (doctor) => {
        this.setState({
            selectedDoctor: doctor
        })
    }
    selectedDate = (date) => {
        this.setState({
            selectedDate: date
        })
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
                        "discount_type": "%",
                        "doctor": that.state.selectedDoctor.id
                    };
                    reqData.treatment.push(sendingItem);
                });
                let successFn = function (data) {
                    displayMessage("Inventory updated successfully");
                    // that.props.loadData();
                    let url = '/patient/' + that.props.match.params.id + '/emr/plans';
                    that.props.history.push(url);
                    // return <Redirect to={url} />;
                }
                let errorFn = function () {

                }
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
                <Button icon={"close"} onClick={() => this.removeTreatment(record._id)} type={"danger"}
                        shape="circle"
                        size="small"/>
            </span>
        }];
        return <div>
            <Form onSubmit={this.handleSubmit}>
                <Card title={"Treatment Plans"}
                      extra={<Form.Item {...formItemLayoutWithOutLabel} style={{marginBottom: 0}}>
                          <Button type="primary" htmlType="submit">Save Treatment Plan</Button>
                      </Form.Item>}>
                    <Row>
                        <Col span={7}>
                            <Affix offsetTop={0}>
                                <List size={"small"}

                                      style={{maxHeight: '100vh', overflowX: 'scroll'}}
                                      itemLayout="horizontal"
                                      dataSource={this.state.procedure_category}
                                      renderItem={item => (
                                          <List.Item onClick={() => this.add(item)}>
                                              <List.Item.Meta
                                                  title={item.name}/>
                                          </List.Item>)}/>
                            </Affix>
                        </Col>
                        <Col span={17}>

                            <Table pagination={false}
                                   bordered={true}
                                   dataSource={this.state.tableFormValues}
                                   columns={consumeRow}/>

                            <Affix offsetBottom={0}>
                                <Card>
                                    <span>by &nbsp;&nbsp;</span>
                                    <Dropdown placement="topCenter" overlay={<Menu>
                                        {this.state.practiceDoctors.map(doctor =>
                                            <Menu.Item key="0">
                                                <a onClick={() => this.selectDoctor(doctor)}>{doctor.user.first_name}</a>
                                            </Menu.Item>)}
                                    </Menu>} trigger={['click']}>
                                        <a className="ant-dropdown-link" href="#">
                                            <b>
                                                {this.state.selectedDoctor.user ? this.state.selectedDoctor.user.first_name : 'No DOCTORS Found'}
                                            </b>
                                        </a>
                                    </Dropdown>
                                    <span> &nbsp;&nbsp;on&nbsp;&nbsp;</span>
                                    <DatePicker value={this.state.selectedDate}
                                                onChange={(value) => this.selectedDate(value)} format={"DD-MM-YYYY"}/>
                                </Card>
                            </Affix>
                            <div ref={el => {
                                that.bottomPoint = el;
                            }}/>
                        </Col>
                    </Row>
                </Card>
            </Form>
        </div>
    }
}

export default Form.create()(AddorEditDynamicTreatmentPlans)
