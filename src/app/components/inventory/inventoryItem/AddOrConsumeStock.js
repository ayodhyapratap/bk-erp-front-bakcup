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
    InputNumber, Select, DatePicker, AutoComplete, Affix
} from "antd";
import {displayMessage, getAPI, postAPI} from "../../../utils/common";

import {
    INVENTORY_ITEM_TYPE,
    DRUG,
    SUPPLIES,
    EQUIPMENT,
    ADD_STOCK,
    CONSUME_STOCK,
    TYPE_OF_CONSUMPTION
} from "../../../constants/hardData";
import {INVENTORY_ITEM_API, BULK_STOCK_ENTRY, SUPPLIER_API} from "../../../constants/api";
import moment from "moment";

const {MonthPicker} = DatePicker;
const TabPane = Tabs.TabPane;

let tableFormFields = {
    _id: null,
    quantity: 0,
    batch: null
};

class AddOrConsumeStock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classType: props.type,
            tableFormValues: [],
            maxQuantityforConsume: {},
            searchStrings: {},
            tempValues: {},
            supplierList: []
        }
    }

    componentDidMount() {
        this.loadInventoryItemList();
        this.loadSupplierList();
    }

    loadSupplierList = () => {
        let that = this;
        let successFn = function (data) {
            that.setState({
                supplierList: data
            })
        }
        let errorFn = function () {

        }
        getAPI(SUPPLIER_API, successFn, errorFn, {
            practice: this.props.active_practiceId
        })
    }

    loadInventoryItemList() {
        let that = this;
        let successFn = function (recData) {
            let data = recData.results;
            let drugItems = [];
            let equipmentItems = [];
            let supplesItems = [];
            data.forEach(function (item) {
                if (item.item_type == DRUG) {
                    drugItems.push(item);
                }
                if (item.item_type == SUPPLIES) {
                    supplesItems.push(item);
                }
                if (item.item_type == EQUIPMENT) {
                    equipmentItems.push(item);
                }
            });
            that.setState({
                items: {
                    [DRUG]: drugItems,
                    [EQUIPMENT]: equipmentItems,
                    [SUPPLIES]: supplesItems,
                },
                filteredItems: {
                    [DRUG]: drugItems,
                    [EQUIPMENT]: equipmentItems,
                    [SUPPLIES]: supplesItems,
                }
            })
        }
        let errorFn = function () {
        }
        getAPI(INVENTORY_ITEM_API, successFn, errorFn, {
            maintain_inventory: true,
            practice: this.props.active_practiceId
        });
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
                let reqData = [];
                that.state.tableFormValues.forEach(function (item) {
                    let itemObject = {
                        item_add_type: that.state.classType,
                        inventory_item: item.id,
                        quantity: values.quantity[item._id],
                        batch_number: values.batch[item._id],
                    };
                    if (that.state.classType == ADD_STOCK) {
                        itemObject = {
                            ...itemObject,
                            expiry_date: moment(values.expiry_date[item._id]).format('YYYY-MM-DD'),
                            unit_cost: values.unit_cost[item._id],
                            total_cost: values.unit_cost[item._id] * values.quantity[item._id]
                        }
                    }
                    reqData.push(itemObject);
                });
                console.log(reqData);
                let successFn = function (data) {
                    displayMessage("Inventory updated successfully");
                    that.props.loadData();
                    that.props.history.push('/inventory');
                }
                let errorFn = function () {

                }
                postAPI(BULK_STOCK_ENTRY, reqData, successFn, errorFn);
            }
        });
    }

    changeMaxQuantityforConsume(recordId, batch) {
        this.setState(function (prevState) {
            let newMaxQuantityforConsume = {...prevState.maxQuantityforConsume}
            prevState.tableFormValues.forEach(function (formValue) {
                if (formValue._id == recordId)
                    formValue.item_type_stock.item_stock.forEach(function (stock) {
                        if (stock.batch_number == batch)
                            newMaxQuantityforConsume[recordId] = stock.quantity || 0
                    })
            });
            return {
                maxQuantityforConsume: newMaxQuantityforConsume
            }
        });
    }

    searchValues = (type, value) => {
        let that = this;
        this.setState(function (prevState) {
            let searchValues = {...prevState.searchStrings};
            searchValues[type] = value;
            return {searchStrings: searchValues}
        }, function () {
            that.filterValues(type);
        });
    }
    filterValues = (type) => {
        this.setState(function (prevState) {
            let filteredItemOfGivenType = [];
            if (prevState.items[type]) {
                if (prevState.searchStrings[type]) {
                    prevState.items[type].forEach(function (item) {
                        if (item.name
                            .toString()
                            .toLowerCase()
                            .includes(prevState.searchStrings[type].toLowerCase())) {
                            filteredItemOfGivenType.push(item);
                        }
                    });
                } else {
                    filteredItemOfGivenType = prevState.items[type];
                }
            }
            return {
                filteredItems: {...prevState.filteredItems, [type]: filteredItemOfGivenType}
            }
        });
    }
    storeValue = (type, id, value) => {
        this.setState(function (prevState) {
            return {tempValues: {...prevState.tempValues, [type.toString() + id.toString()]: value}}
        });
    }

    render() {
        let that = this;
        const {getFieldDecorator} = this.props.form;
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
            dataIndex: 'name'
        }];
        if (this.state.classType == ADD_STOCK) {
            consumeRow = consumeRow.concat([{
                title: 'Quantity',
                key: 'quantity',
                dataIndex: 'quantity',
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
                        <InputNumber min={0} placeholder="quantity"
                                     onChange={(value) => this.storeValue('quantity', record._id, value)}/>
                    )}
                </Form.Item>
            }, {
                title: 'Batch',
                key: 'batch',
                dataIndex: 'batch',
                render: (item, record) => <Form.Item
                    key={`batch[${record._id}]`}
                    {...formItemLayout}>
                    {getFieldDecorator(`batch[${record._id}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            message: "This field is required.",
                        }],
                    })(
                        <AutoComplete placeholder="Batch Number"
                                      onChange={(value) => this.storeValue('batch', record._id, value)}
                                      dataSource={record.item_type_stock && record.item_type_stock.item_stock ? record.item_type_stock.item_stock.map(itemStock => itemStock.batch_number ? itemStock.batch_number : '--') : []}/>
                    )}
                </Form.Item>
            }, {
                title: 'Expiry Date',
                key: 'expiry',
                dataIndex: 'expiry',
                render: (item, record) => <Form.Item
                    key={`expiry_date[${record._id}]`}
                    {...formItemLayout}>
                    {getFieldDecorator(`expiry_date[${record._id}]`, {
                        rules: [{
                            required: true,
                            message: "This field is required.",
                        }],
                        initialValue: moment(new Date())
                    })(
                        <MonthPicker/>
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
                        <InputNumber placeholder="Unit Cost"
                                     onChange={(value) => this.storeValue('unit_cost', record._id, value)}/>
                    )}
                </Form.Item>
            }, {
                title: 'Total Cost',
                key: 'total_cost',
                dataIndex: 'total_cost',
                render: (item, record) =>
                    <span>{this.state.tempValues['unit_cost' + record._id] && this.state.tempValues['quantity' + record._id] ? this.state.tempValues['unit_cost' + record._id] * this.state.tempValues['quantity' + record._id] : '--'}</span>
            }]);
        } else if (this.state.classType == CONSUME_STOCK) {
            consumeRow = consumeRow.concat([{
                title: 'Batch',
                key: 'batch',
                dataIndex: 'batch',
                render: (item, record) => <Form.Item
                    key={`batch[${record._id}]`}
                    {...formItemLayout}>
                    {getFieldDecorator(`batch[${record._id}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            message: "This field is required.",
                        }],
                    })(
                        <Select placeholder="Batch Number"
                                onChange={(value) => that.changeMaxQuantityforConsume(record._id, value)}>
                            {record.item_type_stock.item_stock.map(stock =>
                                <Select.Option value={stock.batch_number}>
                                    #{stock.batch_number} ({stock.quantity})
                                </Select.Option>)}
                        </Select>
                    )}
                </Form.Item>
            }, {
                title: 'Quantity',
                key: 'quantity',
                dataIndex: 'quantity',
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
                        <InputNumber min={0} max={this.state.maxQuantityforConsume[record._id]} placeholder="quantity"/>
                    )}
                </Form.Item>
            },]);
        }
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
                            {INVENTORY_ITEM_TYPE.map(itemType => <TabPane tab={itemType.label} key={itemType.value}>
                                <div style={{backgroundColor: '#ddd', padding: 8}}>


                                    <Input.Search key={itemType.label}
                                                  placeholder={"Search in " + itemType.label + "..."}
                                                  onSearch={value => this.searchValues(itemType.label, value)}/>
                                </div>
                                <List size={"small"}
                                      itemLayout="horizontal"
                                      dataSource={this.state.filteredItems ? this.state.filteredItems[itemType.value] : []}
                                      renderItem={item => (
                                          <List.Item>
                                              <List.Item.Meta
                                                  title={item.name}
                                                  description={item.item_type_stock.item_stock && item.item_type_stock.item_stock.map((stock) =>
                                                      <span>#{stock.batch_number}({stock.quantity})<br/></span>)}/>
                                              <Button type="primary" size="small" shape="circle"
                                                      onClick={() => this.add(item)} icon={"arrow-right"}/>
                                          </List.Item>)}/>
                            </TabPane>)}
                        </Tabs>
                    </Col>
                    <Col span={17}>
                        <Form onSubmit={this.handleSubmit}>
                            <Row>
                                {this.state.classType == CONSUME_STOCK ?
                                    <Form.Item
                                        key={`type_of_consumption`}
                                        label={"Type of Consumption"}
                                        {...{
                                            labelCol: {span: 6},
                                            wrapperCol: {span: 14},
                                        }}>
                                        {getFieldDecorator(`type_of_consumption`, {
                                            validateTrigger: ['onChange', 'onBlur'],
                                            rules: [{
                                                message: "This field is required.",
                                            }],
                                        })(
                                            <Select>
                                                {TYPE_OF_CONSUMPTION.map(item => <Select.Option
                                                    value={item.value}>{item.label}</Select.Option>)}
                                            </Select>
                                        )}
                                    </Form.Item>
                                    : null}
                                {/*{this.state.classType == CONSUME_STOCK ?*/}
                                {/*<Form.Item*/}
                                {/*key={`supplier`}*/}
                                {/*label={"Supplier"}*/}
                                {/*{...{*/}
                                {/*labelCol: {span: 6},*/}
                                {/*wrapperCol: {span: 14},*/}
                                {/*}}>*/}
                                {/*{getFieldDecorator(`addedOn`, {*/}
                                {/*validateTrigger: ['onChange', 'onBlur'],*/}
                                {/*rules: [{*/}
                                {/*message: "This field is required.",*/}
                                {/*}],*/}
                                {/*})(*/}
                                {/*<Select>*/}
                                {/*/!*{this.state.suppliersList && this.state.suppliersList.map(item =>*!/*/}
                                {/*/!*<Select.Option*!/*/}
                                {/*/!*value={item.id}>{item.name}</Select.Option>)}*!/*/}
                                {/*</Select>*/}
                                {/*)}*/}
                                {/*</Form.Item>*/}
                                {/*: null}*/}
                            </Row>
                            <Table pagination={false}
                                   bordered={true}
                                   dataSource={this.state.tableFormValues}
                                   columns={consumeRow}/>
                            {/*<List>{formItems}</List>*/}

                            <Affix offsetBottom={0}>
                                <Card>
                                    <Row>
                                        <Col span={8}>
                                            <Form.Item {...formItemLayoutWithOutLabel}>
                                                <Button type="primary" htmlType="submit">Submit</Button>
                                                {that.props.history ?
                                                    <Button style={{margin: 5}}
                                                            onClick={() => that.props.history.goBack()}>
                                                        Cancel
                                                    </Button> : null}
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                key={`addedOn`}
                                                label={this.state.classType == ADD_STOCK ? "Added On" : "Consumed On"}
                                                {...{
                                                    labelCol: {span: 10},
                                                    wrapperCol: {span: 14},
                                                }}>
                                                {getFieldDecorator(`addedOn`, {
                                                    validateTrigger: ['onChange', 'onBlur'],
                                                    rules: [{
                                                        required: true,
                                                        message: "This field is required.",
                                                    }],
                                                    initialValue: moment()
                                                })(
                                                    <DatePicker/>
                                                )}
                                            </Form.Item>
                                            {this.state.classType == ADD_STOCK ? <Form.Item
                                                key={`supplier`}
                                                label={"Supplier"}
                                                {...{
                                                    labelCol: {span: 10},
                                                    wrapperCol: {span: 14},
                                                }}>
                                                {getFieldDecorator(`supplier`, {
                                                    validateTrigger: ['onChange', 'onBlur'],
                                                    rules: [{
                                                        required: true,
                                                        message: "This field is required.",
                                                    }],
                                                })(
                                                    <Select>

                                                    </Select>
                                                )}
                                            </Form.Item> : null}
                                        </Col>
                                        {this.state.classType == ADD_STOCK ?
                                            <Col style={{textAlign: 'center'}}>

                                                <h3>Grand
                                                    Total: <b>{this.state.tableFormValues.reduce(function (total, item) {
                                                        if (that.state.tempValues['quantity' + item._id] && that.state.tempValues['unit_cost' + item._id]) {
                                                            return total + (that.state.tempValues['quantity' + item._id] * that.state.tempValues['unit_cost' + item._id])
                                                        }
                                                        return total
                                                    }, 0)}</b></h3>
                                            </Col>
                                            : null}
                                    </Row>
                                </Card>
                            </Affix>

                        </Form>

                    </Col>
                </Row>
            </Card>

        </div>

    }
}

export default Form.create()(AddOrConsumeStock);
