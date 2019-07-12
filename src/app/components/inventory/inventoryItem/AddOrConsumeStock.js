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
import {displayMessage, getAPI, postAPI, interpolate} from "../../../utils/common";

import {
    INVENTORY_ITEM_TYPE,
    DRUG,
    SUPPLIES,
    EQUIPMENT,
    ADD_STOCK,
    CONSUME_STOCK,
    TYPE_OF_CONSUMPTION, INVENTORY
} from "../../../constants/hardData";
import {INVENTORY_ITEM_API, BULK_STOCK_ENTRY, SUPPLIER_API, SEARCH_THROUGH_QR} from "../../../constants/api";
import moment from "moment";

const {Search} = Input;
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
            items: {},
            classType: props.type,
            tableFormValues: [],
            maxQuantityforConsume: {},
            searchStrings: {},
            tempValues: {},
            supplierList: [],
            customSupplier: false,
            qrValue: ''
        }
        this.loadSupplierList = this.loadSupplierList.bind(this);
    }

    componentDidMount() {
        this.loadInventoryItemList();
        this.loadSupplierList();
    }

    changeSupplierType = (value) => {
        this.setState({
            customSupplier: !!value
        })
    }

    loadSupplierList() {
        let that = this;
        let params = {practice: this.props.active_practiceId}
        let successFn = function (data) {
            console.log("bhai kaha ", data)
            that.setState({
                supplierList: data
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(SUPPLIER_API, [this.props.active_practiceId]), successFn, errorFn, params);
        // getAPI(SUPPLIER_API, successFn, errorFn, {
        //     practice: this.props.active_practiceId
        // })
    }

    loadInventoryItemList() {
        let that = this;
        INVENTORY_ITEM_TYPE.forEach(function (type) {
            that.loadItemsList(type.value)
        });
    }

    loadItemsList = (type, page = 1) => {
        let that = this;
        let successFn = function (recData) {
            let data = recData.results;
            if (recData.current == 1) {
                that.setState(function (prevState) {
                    return {
                        items: {
                            ...prevState.items,
                            [type]: data,
                        }
                    }
                });
            } else {
                that.setState(function (prevState) {
                    return {
                        items: {
                            ...prevState.items,
                            [type]: [...prevState.items[type], ...data],
                        }
                    }
                });
            }
        }
        let errorFn = function () {
        }
        let params = {
            maintain_inventory: true,
            practice: this.props.active_practiceId,
            item_type: type,
        }
        if (that.state.searchStrings[type]) {
            params.item_name = that.state.searchStrings[type]
        }
        getAPI(INVENTORY_ITEM_API, successFn, errorFn, params);
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

    add = (item, randId = Math.random().toFixed(7)) => {
        console.log(randId);
        this.setState(function (prevState) {
            return {
                tableFormValues: [...prevState.tableFormValues, {
                    ...tableFormFields,
                    ...item,
                    _id: randId,
                }]
            }
        });
    };

    handleSubmit = (e) => {

        if (e.keyCode == 13) {
            return false;
        }
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
                        date:moment(values.date).format('YYYY-MM-DD'),
                        bill_number:values.bill_number,
                    };
                    if (that.state.classType == ADD_STOCK) {
                        itemObject = {
                            ...itemObject,
                            expiry_date: moment(values.expiry_date[item._id]).format('YYYY-MM-DD'),
                            unit_cost: values.unit_cost[item._id],
                            total_cost: values.unit_cost[item._id] * values.quantity[item._id],
                        }
                        if(values.supplier){
                            itemObject.supplier = values.supplier;
                        }else if(values.supplier_name){
                            itemObject.supplier_name = values.supplier_name;
                        }
                    }
                    reqData.push(itemObject);
                });
                reqData.date = moment(values.date).isValid() ? moment(values.date).format() : null;
                if (that.state.customSupplier)
                    reqData.supplier_name = values.supplier_name;
                else
                    reqData.supplier = values.supplier;

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
            that.loadItemsList(type);
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
    addItemThroughQR = (value) => {
        let that = this;
        that.setState({
            loadingQr: true,
        });
        let qrSplitted = value.split('*');
        let successFn = function (data) {
            let item = data;
            let {setFieldsValue, getFieldsValue, getFieldValue} = that.props.form;
            let randomId = Math.random().toFixed(7);
            let flag = true
            that.state.tableFormValues.forEach(function (row) {
                if (row.item_name == qrSplitted[0]) {
                    let _id = row._id;
                    let batch = getFieldsValue(`batch[${_id}]`);
                    if (batch == qrSplitted[3]) {
                        let quantity = getFieldsValue(`quantity[${_id}]`);
                        flag = false
                        setFieldsValue({
                            [`quantity[${_id}]`]: quantity + 1
                        })
                        that.storeValue('quantity',_id,value);
                    }
                }
            })
            if (flag) {
                that.add(data, randomId);
                that.storeValue('batch', randomId, qrSplitted[1]);
                that.storeValue('unit_cost',randomId,qrSplitted[3]);
                let fieldsToBeSet = {
                    [`batch[${randomId}]`]: qrSplitted[1],
                    [`expiry_date[${randomId}]`]: moment(qrSplitted[2], 'MM/YY')
                };
                if(that.state.classType == CONSUME_STOCK)
                    fieldsToBeSet[`unit_cost[${randomId}]`] = qrSplitted[3]
                setFieldsValue(fieldsToBeSet)
            }
            console.log(getFieldsValue(), {
                [`batch[${randomId}]`]: qrSplitted[0]
            });
            that.setState(function (prevState) {

                // if (prevState.items && prevState.items[INVENTORY]) {
                //     prevState.items[INVENTORY].forEach(function (inventItem) {
                //         console.log(item.inventory_item)
                //         if (inventItem.id == item.inventory_item) {
                //             console.log(inventItem);
                //             that.add({...inventItem, item_type: INVENTORY});
                //
                //         }
                //     })
                // }
                return {
                    loadingQr: false,
                    qrValue: ''
                }
            });
        }
        let errorFn = function () {

        }
        getAPI(SEARCH_THROUGH_QR, successFn, errorFn, {qr: value, form: 'Inventory'})
    }
    setQrValue = (e) => {
        let value = e.target.value;
        this.setState({
            qrValue: value
        })
    }

    render() {
        console.log("supplierList", this.state.tableFormValues)
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
            <Card title={this.state.classType + " Stock"} extra={
                <Search
                    loading={this.state.loadingQr}
                    value={this.state.qrValue}
                    onChange={this.setQrValue}
                    placeholder="Search QR Code"
                    onSearch={this.addItemThroughQR}
                    style={{width: 200}}
                />}>
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
                                      dataSource={this.state.items ? this.state.items[itemType.value] : []}
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
                            {this.state.classType == CONSUME_STOCK ?
                                <Row>
                                    <Col span={16}>
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
                                    </Col>
                                    {/*<Col span={8}>*/}
                                    {/*<Search*/}
                                    {/*loading={this.state.loadingQr}*/}
                                    {/*value={this.state.qrValue}*/}
                                    {/*onChange={this.setQrValue}*/}
                                    {/*placeholder="Search QR Code"*/}
                                    {/*onSearch={this.addItemThroughQR}*/}
                                    {/*style={{width: 200}}*/}
                                    {/*/>*/}
                                    {/*</Col>*/}
                                </Row>
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
                                                key={`date`}
                                                label={this.state.classType == ADD_STOCK ? "Added On" : "Consumed On"}
                                                {...{
                                                    labelCol: {span: 10},
                                                    wrapperCol: {span: 14},
                                                }}>
                                                {getFieldDecorator(`date`, {
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

                                            <Form.Item
                                                key={`bill_number`}
                                                label='Bill Number'
                                                {...{
                                                    labelCol: {span: 10},
                                                    wrapperCol: {span: 14},
                                                }}>
                                                {getFieldDecorator(`bill_number`, {
                                                    validateTrigger: ['onChange', 'onBlur'],
                                                    rules: [{
                                                        required: true,
                                                        message: "This field is required.",
                                                    }],

                                                })(
                                                    <Input/>
                                                )}
                                            </Form.Item>

                                            {this.state.classType == ADD_STOCK ? <div>
                                                {this.state.customSupplier ?
                                                    <Form.Item
                                                        key={`supplier_name`}
                                                        label={"Supplier"}
                                                        {...{
                                                            labelCol: {span: 10},
                                                            wrapperCol: {span: 14},
                                                        }}>
                                                        {getFieldDecorator(`supplier_name`, {
                                                            validateTrigger: ['onChange', 'onBlur'],
                                                            rules: [{
                                                                required: true,
                                                                message: "This field is required.",
                                                            }],
                                                        })(
                                                            <Input/>
                                                        )}
                                                        {this.state.customSupplier ?
                                                            <a onClick={() => this.changeSupplierType(false)}>Cancel</a> : null}
                                                    </Form.Item> : <Form.Item
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
                                                        })(<Select>
                                                            {this.state.supplierList.map(item => <Select.Option
                                                                value={item.id}>
                                                                {item.name}
                                                            </Select.Option>)}
                                                        </Select>)}
                                                        {this.state.customSupplier ? null :
                                                            <a onClick={() => this.changeSupplierType(true)}>Add
                                                                New</a>}
                                                    </Form.Item>} </div> : null}
                                        </Col>
                                        {this.state.classType == ADD_STOCK ?
                                            <Col style={{textAlign: 'center'}} span={8}>

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
