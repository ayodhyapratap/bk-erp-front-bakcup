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
    InputNumber, Select, DatePicker,
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
import {INVENTORY_ITEM_API, BULK_STOCK_ENTRY, TAXES, DRUG_CATALOG, PROCEDURE_CATEGORY} from "../../../constants/api";
import moment from "moment";

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
        }

    }

    componentDidMount() {
        this.loadInventoryItemList();
        this.loadProcedures();
        this.loadPrescriptions();
        this.loadTaxes();
    }

    loadInventoryItemList() {
        let that = this;
        let successFn = function (data) {
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
        getAPI(INVENTORY_ITEM_API, successFn, errorFn);
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
            items[PRESCRIPTIONS] = data;
            that.setState({
                items: items,
            })
        };
        let errorFn = function () {
        };
        getAPI(interpolate(DRUG_CATALOG, [this.props.active_practiceId]), successFn, errorFn);
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
            return {
                tableFormValues: [...prevState.tableFormValues, {
                    ...tableFormFields,
                    ...item,
                    _id: Math.random().toFixed(7),
                }]
            }
        });
    };

    handleSubmit = (e) => {
        let that = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let reqData = {};
                that.state.tableFormValues.forEach(function (item) {
                    item.quantity = values.quantity[item._id];
                    item.taxes = values.taxes[item._id];
                    item.unit_cost = values.unit_cost[item._id];
                    item.discount = values.discount[item._id];
                    if (reqData[item.item_type])
                        reqData[item.item_type].push(item);
                    else
                        reqData[item.item_type] = [item];
                });
                console.log(reqData);
                let successFn = function (data) {
                    displayMessage("Inventory updated successfully");
                    that.props.loadData();
                    let url = '/patient/' + this.props.match.params.id + '/billing/invoices';
                    that.props.history.push(url);
                }
                let errorFn = function () {

                }
                // postAPI("ll", reqData, successFn, errorFn);
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
            render:(name,record)=> <Form.Item
                key={`name[${record._id}]`}
                {...formItemLayout}>
                {getFieldDecorator(`quantity[${record._id}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                        required: true,
                        message: "This field is required.",
                    }],
                })(
                    <InputNumber min={0} placeholder="quantity" size={'small'}/>
                )}
            </Form.Item>
        }];
        consumeRow = consumeRow.concat([{
            title: 'Unit',
            key: 'unit',
            dataIndex: 'unit',
            render: (item, record) => <Form.Item
                key={`quantity[${record._id}]`}
                {...formItemLayout}>
                {getFieldDecorator(`quantity[${record._id}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                        required: true,
                        message: "This field is required.",
                    }],
                })(
                    <InputNumber min={0} placeholder="quantity" size={'small'}/>
                )}
            </Form.Item>
        }, {
            title: 'discount %',
            key: 'discount',
            dataIndex: 'discount',
            render: (item, record) => <Form.Item
                key={`discount[${record._id}]`}
                {...formItemLayout}>
                {getFieldDecorator(`discount[${record._id}]`, {
                    rules: [{
                        required: true,
                        message: "This field is required.",
                    }],
                })(
                    <InputNumber min={0} max={100} placeholder="discount" size={'small'}/>
                )}
            </Form.Item>
        }, {
            title: 'Unit Cost',
            key: 'unit_cost',
            dataIndex: 'unit_cost',
            render: (item, record) => <Form.Item
                key={`unit_cost[${record._id}]`}
                {...formItemLayout}>
                {getFieldDecorator(`unit_cost[${record._id}]`, {
                    // validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                        required: true,
                        message: "This field is required.",
                    }],
                })(
                    <InputNumber placeholder="Unit Cost" size={'small'}/>
                )}
            </Form.Item>
        }, {
            title: 'Taxes',
            key: 'taxes',
            dataIndex: 'taxes',
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
            title: 'Action',
            key: '_id',
            dataIndex: '_id',
            render: (value, record) => <a onClick={() => that.remove(record._id)}>Delete</a>
        }]);
        return <div>
            <Card title={this.state.classType + " Stock"}>
                <Row gutter={16}>
                    <Col span={7}>
                        <Tabs size="small" type="card">
                            {INVOICE_ITEM_TYPE.map(itemType => <TabPane tab={itemType.label} key={itemType.value}>
                                <List size={"small"}
                                      itemLayout="horizontal"
                                      dataSource={this.state.items ? this.state.items[itemType.value] : []}
                                      renderItem={item => (
                                          <List.Item>
                                              <List.Item.Meta
                                                  title={item.name}
                                              />
                                              <Button type="primary" size="small" shape="circle"
                                                      onClick={() => this.add({...item, item_type: itemType.value})}
                                                      icon={"arrow-right"}/>
                                          </List.Item>)}/>
                            </TabPane>)}
                        </Tabs>
                    </Col>
                    <Col span={17}>
                        <Form onSubmit={this.handleSubmit}>
                            <Table pagination={false}
                                   bordered={true}
                                   dataSource={this.state.tableFormValues}
                                   columns={consumeRow}/>
                            {/*<List>{formItems}</List>*/}
                            <Form.Item {...formItemLayoutWithOutLabel}>
                                <Button type="primary" htmlType="submit">Submit</Button>
                            </Form.Item>
                        </Form>

                    </Col>
                </Row>
            </Card>

        </div>

    }
}

export default Form.create()(Addinvoicedynamic);
