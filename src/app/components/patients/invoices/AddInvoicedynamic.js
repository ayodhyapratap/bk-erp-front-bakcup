import React from "react";
import {
    Button,
    Card,
    Form,
    Input,
    List,
    Row,
    Col,
    Table,
    Tabs,
    InputNumber, Select, DatePicker, Menu, Dropdown, Tag, Affix
} from "antd";
import {displayMessage, interpolate, getAPI, postAPI} from "../../../utils/common";

import {
    INVOICE_ITEM_TYPE,
    PROCEDURES,
    DRUG,
    PRESCRIPTIONS,
    INVENTORY,
    EQUIPMENT,
    ADD_STOCK,
    CONSUME_STOCK
} from "../../../constants/hardData";
import {
    INVENTORY_ITEM_API,
    BULK_STOCK_ENTRY,
    TAXES,
    DRUG_CATALOG,
    PROCEDURE_CATEGORY,
    CREATE_OR_EDIT_INVOICES, PRACTICESTAFF, UNPAID_PRESCRIPTIONS
} from "../../../constants/api";
import moment from "moment";
import {DOCTORS_ROLE} from "../../../constants/dataKeys";
import {loadDoctors} from "../../../utils/clinicUtils";

const {MonthPicker} = DatePicker;
const TabPane = Tabs.TabPane;

let tableFormFields = {
    _id: null,
    quantity: 0,
    batch: null
};

class Addinvoicedynamic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classType: props.type,
            tableFormValues: [],
            maxQuantityforConsume: {},
            items: {},
            practiceDoctors: [],
            selectedPrescriptions: []
        }

    }

    componentDidMount() {
        loadDoctors(this);
        this.loadInventoryItemList();
        this.loadProcedures();
        this.loadPrescriptions();
        this.loadTaxes();
    }

    loadInventoryItemList() {
        let that = this;
        let successFn = function (reqData) {
            let data = reqData.results;
            let drugItems = [];
            let equipmentItems = [];
            let supplesItems = [];
            data.forEach(function (item) {
                if (item.item_type == DRUG) {
                    drugItems.push(item);
                }
            });
            let items = that.state.items;
            console.log(items);
            items[INVENTORY] = drugItems;
            that.setState({
                items: items,
            })
        }
        let errorFn = function () {
        }
        getAPI(INVENTORY_ITEM_API, successFn, errorFn, {
            practice: this.props.active_practiceId,
            maintain_inventory: true
        });
    }

    loadProcedures() {
        var that = this;
        let successFn = function (data) {
            let items = that.state.items;
            console.log(items);
            items[PROCEDURES] = data;
            that.setState({
                items: items,
            })
        };
        let errorFn = function () {
        };

        getAPI(interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]), successFn, errorFn);
    }

    loadPrescriptions() {
        var that = this;
        let successFn = function (data) {
            let items = that.state.items;
            console.log(items);
            items[PRESCRIPTIONS] = data.results;
            that.setState({
                items: items,
            })
        };
        let errorFn = function () {
        };
        getAPI(interpolate(UNPAID_PRESCRIPTIONS, [that.props.match.params.id]), successFn, errorFn);
    }

    loadTaxes() {
        var that = this;
        let successFn = function (data) {
            console.log("get table");
            that.setState({
                taxes_list: data,
            })
        };
        let errorFn = function () {
        };
        getAPI(interpolate(TAXES, [this.props.active_practiceId]), successFn, errorFn);

    }

    remove = (k) => {
        this.setState(function (prevState) {
            let newTableFormValues = [];
            prevState.tableFormValues.forEach(function (formValue) {
                if (formValue._id != k)
                    newTableFormValues.push(formValue);
            });
            console.log(prevState.tableFormValues, k);
            return {
                tableFormValues: newTableFormValues
            }
        });
    }


    add = (item) => {
        this.setState(function (prevState) {
            if (item.item_type == PROCEDURES) {
                item = {
                    ...item,
                    unit_cost: item.cost,
                    selectedDoctor: prevState.selectedDoctor ? prevState.selectedDoctor : null,
                    selectedDate: moment()
                }
            } else if (item.item_type == INVENTORY) {
                item = {
                    ...item,
                    unit_cost: item.cost,
                    selectedDoctor: prevState.selectedDoctor ? prevState.selectedDoctor : null,
                }
            }
            return {
                tableFormValues: [...prevState.tableFormValues, {
                    ...tableFormFields,
                    ...item,
                    _id: Math.random().toFixed(7),
                }]
            }
        });
    };
    selectDoctor = (doctor, id, type) => {
        this.setState(function (prevState) {
            let finalTableFormValues = [];
            prevState.tableFormValues.forEach(function (formValue) {
                if (formValue._id == id && formValue.item_type == type) {
                    finalTableFormValues.push({...formValue, selectedDoctor: doctor})
                } else {
                    finalTableFormValues.push(formValue)
                }
            });
            return {
                tableFormValues: finalTableFormValues
            }
        })
    }
    selectedDate = (dateValue, id, type) => {
        this.setState(function (prevState) {
            let finalTableFormValues = [];
            prevState.tableFormValues.forEach(function (formValue) {
                if (formValue._id == id && formValue.item_type == type) {
                    finalTableFormValues.push({...formValue, selectedDate: dateValue})
                } else {
                    finalTableFormValues.push(formValue)
                }
            });
            return {
                tableFormValues: finalTableFormValues
            }
        })
    }
    selectBatch = (batch, id, type) => {
        this.setState(function (prevState) {
            let finalTableFormValues = [];
            prevState.tableFormValues.forEach(function (formValue) {
                if (formValue._id == id && formValue.item_type == type) {
                    finalTableFormValues.push({...formValue, selectedBatch: batch})
                } else {
                    finalTableFormValues.push(formValue)
                }
            });
            return {
                tableFormValues: finalTableFormValues
            }
        })
    }
    addPrescription = (item) => {
        let that = this;
        item.drugs.forEach(function (drug_item) {
            if (drug_item.maintain_inventory)
                that.add({...drug_item, item_type: INVENTORY})
        });
        that.setState(function (prevState) {
            return {selectedPrescriptions: [...prevState.selectedPrescriptions, item.id]}
        })
    }
    handleSubmit = (e) => {
        let that = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let reqData = {
                    practice: that.props.active_practiceId,
                    patient: that.props.match.params.id,
                    unit: null,
                    cost: null,
                    discount: null,
                    taxes: 0,
                    total: null,
                    is_pending: false,
                    is_active: true,
                    is_cancelled: false,
                    procedure: [],
                    inventory: [],
                    prescription: that.state.selectedPrescriptions
                };
                that.state.tableFormValues.forEach(function (item) {
                    item.quantity = values.quantity[item._id];
                    item.taxes = values.taxes[item._id];
                    item.unit_cost = values.unit_cost[item._id];
                    item.discount = values.discount[item._id];
                    item.discount_type = '%';
                    switch (item.item_type) {
                        case PROCEDURES:
                            reqData.procedure.push({
                                "name": item.name,
                                "unit": item.quantity,
                                "procedure": item.id,
                                "default_notes": null,
                                "is_active": true,
                                "margin": item.margin,
                                "taxes": item.taxes,
                                "unit_cost": item.unit_cost,
                                "discount": item.discount,
                                "discount_type": "%",
                                "offers": 1,
                                "doctor": item.selectedDoctor ? item.selectedDoctor.id : null
                            });
                            break;
                        case INVENTORY:
                            reqData.inventory.push({
                                "inventory": item.id,
                                "name": item.name,
                                "unit": item.quantity,
                                "taxes": item.taxes,
                                "unit_cost": item.unit_cost,
                                "discount": item.discount,
                                "discount_type": "%",
                                "offers": null,
                                "doctor": item.selectedDoctor ? item.selectedDoctor.id : null,
                                "instruction": item.instruction,
                                "is_active": true,
                                batch_number: item.selectedBatch ? item.selectedBatch.batch_number : null
                            });
                            break;
                        default:
                            return null;

                    }
                });
                console.log(reqData);
                let successFn = function (data) {
                    displayMessage("Inventory updated successfully");
                    that.props.loadData();
                    let url = '/patient/' + that.props.match.params.id + '/billing/invoices';
                    that.props.history.push(url);
                }
                let errorFn = function () {

                }
                postAPI(CREATE_OR_EDIT_INVOICES, reqData, successFn, errorFn);
            }
        });
    }


    render() {
        const taxesOption = []
        if (this.state.taxes_list) {
            this.state.taxes_list.forEach(function (tax) {
                taxesOption.push(<Select.Option value={tax.id}>{tax.name}</Select.Option>);
            })
        }
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
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 20},
            },
        };
        getFieldDecorator('keys', {initialValue: []});
        let consumeRow = [{
            title: 'Item Name',
            key: 'item_name',
            dataIndex: 'name',
            render: function (name, record) {
                switch (record.item_type) {
                    case PROCEDURES:
                        return <Form.Item
                            key={`name[${record._id}]`}
                            {...formItemLayout}>
                            {getFieldDecorator(`name[${record._id}]`, {
                                validateTrigger: ['onChange', 'onBlur'],
                                initialValue: name,
                                rules: [{
                                    required: true,
                                    message: "This field is required.",
                                }],
                            })(
                                <Input min={0} placeholder="Item name" size={'small'}/>
                            )}
                            <span>by &nbsp;&nbsp;</span>
                            <Dropdown placement="topCenter" overlay={<Menu>
                                {that.state.practiceDoctors.map(doctor =>
                                    <Menu.Item key="0">
                                        <a onClick={() => that.selectDoctor(doctor, record._id, PROCEDURES)}>{doctor.user.first_name}</a>
                                    </Menu.Item>)}
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link" href="#">
                                    <b>
                                        {record.selectedDoctor.user ? record.selectedDoctor.user.first_name : 'No DOCTORS Found'}
                                    </b>
                                </a>
                            </Dropdown>
                            <span> &nbsp;&nbsp;on&nbsp;&nbsp;</span>
                            <DatePicker value={record.selectedDate}
                                        size={'small'}
                                        onChange={(value) => that.selectedDate(value, record._id, PROCEDURES)}
                                        format={"DD-MM-YYYY"}/>
                        </Form.Item>;
                    case PRESCRIPTIONS:
                        return <b>{record.name}</b>;
                    case INVENTORY:
                        return <div>
                            {record.name}
                            <span><br/>by &nbsp;&nbsp;</span>
                            <Dropdown placement="topCenter" overlay={<Menu>
                                {that.state.practiceDoctors.map(doctor =>
                                    <Menu.Item key="0">
                                        <a onClick={() => that.selectDoctor(doctor, record._id, PROCEDURES)}>{doctor.user.first_name}</a>
                                    </Menu.Item>)}
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link" href="#">
                                    <b>
                                        {record.selectedDoctor && record.selectedDoctor.user ? record.selectedDoctor.user.first_name : '+Add Doctor'}
                                    </b>
                                </a>
                            </Dropdown>
                            <span><br/>from batch &nbsp;&nbsp;</span>
                            <Dropdown placement="topCenter" overlay={<Menu>
                                {record.item_type_stock && record.item_type_stock.item_stock && record.item_type_stock.item_stock.map(batch =>
                                    <Menu.Item key="0">
                                        <a onClick={() => that.selectBatch(batch, record._id, INVENTORY)}>{batch.batch_number}&nbsp;({batch.quantity}) &nbsp;&nbsp;{batch.expiry_date}</a>
                                    </Menu.Item>)}
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link" href="#">
                                    <b>
                                        {record.selectedBatch ? record.selectedBatch.batch_number : 'Select Batch'}
                                    </b>
                                </a>
                            </Dropdown>
                        </div>
                    default:
                        return null;
                }
            }
        }];
        consumeRow = consumeRow.concat([{
            title: 'Unit',
            key: 'unit',
            width: 100,
            dataIndex: 'unit',
            render: (item, record) => (record.item_type == INVENTORY ? <Form.Item
                key={`name[${record._id}]`}
                {...formItemLayout}>
                {getFieldDecorator(`quantity[${record._id}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    initialValue: record.selectedBatch ? 1 : null,
                    rules: [{
                        min: 0,
                        max: record.selectedBatch ? record.selectedBatch.quantity : 0,
                        required: true,
                        message: "This field is required.",
                    }],
                })(
                    <InputNumber placeholder="quantity" size={'small'}
                                 disabled={!record.selectedBatch}/>
                )}
            </Form.Item> : <Form.Item
                key={`name[${record._id}]`}
                {...formItemLayout}>
                {getFieldDecorator(`quantity[${record._id}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    initialValue: 1,
                    rules: [{
                        min: 0,
                        required: true,
                        message: "This field is required.",
                    }],
                })(
                    <InputNumber min={0} placeholder="quantity" size={'small'}/>
                )}
            </Form.Item>)
        }, {
            title: 'Unit Cost',
            key: 'unit_cost',
            width: 100,
            dataIndex: 'unit_cost',
            render: (item, record) => <Form.Item
                key={`unit_cost[${record._id}]`}
                {...formItemLayout}>
                {getFieldDecorator(`unit_cost[${record._id}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                        required: true,
                        message: "This field is required.",
                    }],
                })(
                    <InputNumber placeholder="Unit Cost" size={'small'}/>
                )}
            </Form.Item>
        }, {
            title: 'discount %',
            key: 'discount',
            width: 100,
            dataIndex: 'discount',
            render: (item, record) => <Form.Item
                key={`discount[${record._id}]`}
                {...formItemLayout}>
                {getFieldDecorator(`discount[${record._id}]`, {
                    initialValue: 0,
                    validateTrigger: ['onChange', 'onBlur'],

                })(
                    <InputNumber min={0} max={100} placeholder="discount" size={'small'}/>
                )}
            </Form.Item>
        }, {
            title: 'Taxes',
            key: 'taxes',
            dataIndex: 'taxes',
            width: 100,
            render: (item, record) => <Form.Item
                key={`taxes[${record._id}]`}
                {...formItemLayout}>
                {getFieldDecorator(`taxes[${record._id}]`, {
                    validateTrigger: ['onChange', 'onBlur'],

                })(
                    <Select placeholder="Batch Number" size={'small'}>{taxesOption}</Select>
                )}
            </Form.Item>
        },]);

        consumeRow = consumeRow.concat([{
            key: '_id',
            dataIndex: '_id',
            render: (value, record) => <Button icon={"close"} onClick={() => this.removeDrug(record._id)}
                                               type={"danger"} shape="circle"
                                               size="small"/>
        }]);

        return <div>
            <Card title={this.state.classType + " Stock"} bodyStyle={{padding: 0}}>
                <Row gutter={16}>
                    <Col span={7}>
                        <Tabs size="small" type="card">
                            <TabPane tab={PRESCRIPTIONS} key={PRESCRIPTIONS}>
                                <List size={"small"}
                                      itemLayout="horizontal"
                                      dataSource={this.state.items ? this.state.items[PRESCRIPTIONS] : []}
                                      renderItem={item => (
                                          <List.Item>
                                              <List.Item.Meta
                                                  title={item.drugs.map(drug_item => <div>
                                                      <span>{drug_item.name}</span> {drug_item.maintain_inventory ? null :
                                                      <Tag color="red" style={{float: 'right', lineHeight: '18px'}}>Not
                                                          Sold</Tag>}<br/></div>)}
                                                  description={item.doctor ?
                                                      <Tag color={item.doctor ? item.doctor.calendar_colour : null}>
                                                          <b>{"prescribed by  " + item.doctor.user.first_name} </b>
                                                      </Tag> : null}
                                              />
                                              <Button type="primary" size="small" shape="circle"
                                                      onClick={() => this.addPrescription({...item})}
                                                      icon={"arrow-right"}/>
                                          </List.Item>)}/>
                            </TabPane>
                            <TabPane tab={PROCEDURES} key={PROCEDURES}>
                                <List size={"small"}
                                      itemLayout="horizontal"
                                      dataSource={this.state.items ? this.state.items[PROCEDURES] : []}
                                      renderItem={item => (
                                          <List.Item>
                                              <List.Item.Meta
                                                  title={item.name}
                                              />
                                              <Button type="primary" size="small" shape="circle"
                                                      onClick={() => this.add({...item, item_type: PROCEDURES})}
                                                      icon={"arrow-right"}/>
                                          </List.Item>)}/>
                            </TabPane>
                            <TabPane tab={INVENTORY} key={INVENTORY}>
                                <List size={"small"}
                                      itemLayout="horizontal"
                                      dataSource={this.state.items ? this.state.items[INVENTORY] : []}
                                      renderItem={item => (
                                          <List.Item>
                                              <List.Item.Meta
                                                  title={item.name}
                                              />
                                              <Button type="primary" size="small" shape="circle"
                                                      onClick={() => this.add({...item, item_type: INVENTORY})}
                                                      icon={"arrow-right"}/>
                                          </List.Item>)}/>
                            </TabPane>
                        </Tabs>
                    </Col>
                    <Col span={17}>
                        <Form onSubmit={this.handleSubmit}>
                            <Table pagination={false}
                                   bordered={true}
                                   dataSource={this.state.tableFormValues}
                                   columns={consumeRow}/>
                            {/*<List>{formItems}</List>*/}
                            <Affix offsetBottom={0}>
                                <Card>
                                    <Form.Item {...formItemLayoutWithOutLabel}>
                                        <Button type="primary" htmlType="submit">Submit</Button>
                                    </Form.Item>
                                </Card>
                            </Affix>

                        </Form>

                    </Col>
                </Row>
            </Card>

        </div>

    }
}

export default Form
    .create()

    (
        Addinvoicedynamic
    )
;
