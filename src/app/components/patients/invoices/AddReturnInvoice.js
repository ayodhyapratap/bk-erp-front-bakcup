import React from "react";
import {
    Affix,
    Button,
    Card,
    Col,
    DatePicker,
    Dropdown,
    Form,
    Input,
    InputNumber,
    List,
    Menu,
    Row,
    Select,
    Spin,
    Table,
    Tabs,
    Tag,
    Checkbox, Divider
} from "antd";
import {displayMessage, getAPI, interpolate, postAPI, putAPI} from "../../../utils/common";
import {DRUG, INVENTORY, PRESCRIPTIONS, PROCEDURES} from "../../../constants/hardData";
import {
    INVENTORY_ITEM_API,
    PROCEDURE_CATEGORY,
    SEARCH_THROUGH_QR,
    TAXES,
    UNPAID_PRESCRIPTIONS,
    INVOICE_RETURN_API
} from "../../../constants/api";
import moment from "moment";
import {loadDoctors} from "../../../utils/clinicUtils";

const {Search} = Input;
const {MonthPicker} = DatePicker;
const TabPane = Tabs.TabPane;

let tableFormFields = {
    _id: null,
    quantity: 0,
    batch: null
};

class AddReturnInvoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editInvoice: this.props.editInvoice,
            classType: props.type,
            tableFormValues: [],
            maxQuantityforConsume: {},
            items: {},
            practiceDoctors: [],
            selectedPrescriptions: [],
            selectedDate: moment(),
            stocks: {},
            itemBatches: {},
            saveLoading: false,
            qrValue: '',
            searchItem: '',
            return_with_tax: false,
            returnCashAvailable: 0
        }

    }

    componentDidMount() {
        loadDoctors(this);
        this.loadInventoryItemList();
        this.loadProcedures();
        this.loadPrescriptions();
        this.loadTaxes();
        if (this.props.editId) {
            this.loadEditInvoiceData();
        }
    }

    selectedDefaultDate = (date) => {
        this.setState({
            selectedDate: date
        })
    }
    loadEditInvoiceData = () => {
        let invoice = this.props.editInvoice;
        this.setState(function (prevState) {
            let tableValues = [];
            invoice.procedure.forEach(function (proc) {
                tableValues.push({
                    ...proc.procedure_data,
                    ...proc,
                    selectedDoctor: proc.doctor_data,
                    selectedDate: moment(proc.date).isValid() ? moment(proc.date) : null,
                    _id: Math.random().toFixed(7),
                    item_type: PROCEDURES
                })
            });
            let stocks = {...prevState.stocks};
            invoice.inventory.forEach(function (proc) {

                if (prevState.itemBatches[proc.inventory]) {
                    if (stocks[proc.inventory]) {
                        let stock_quantity = stocks[proc.inventory];
                        if (stock_quantity[proc.batch_number])
                            stock_quantity[proc.batch_number] += proc.unit;
                        else
                            stock_quantity[proc.batch_number] += proc.unit;
                    } else {
                        let stock_quantity = {};
                        stock_quantity[proc.batch_number] = proc.unit;
                        stocks[proc.inventory] = stock_quantity;
                    }
                    prevState.itemBatches[proc.inventory].forEach(function (batchObj) {
                        if (batchObj.batch_number == proc.batch_number)
                            proc.selectedBatch = batchObj;
                    });
                }
                tableValues.push({
                    ...proc.inventory_item_data,
                    ...proc,
                    selectedDoctor: proc.doctor_data,
                    _id: Math.random().toFixed(7),
                    item_type: INVENTORY,

                });
            });

            return {
                tableFormValues: tableValues,
                selectedDate: moment(invoice.date).isValid() ? moment(invoice.date) : null,
                stocks: stocks
            }
        })
    }

    loadInventoryItemList() {
        let that = this;
        let successFn = function (reqData) {
            let data = reqData.results;
            let drugItems = [];
            let equipmentItems = [];
            let supplesItems = [];

            that.setState(function (prevState) {
                    let stocks = {...prevState.stocks};
                    let itemBatches = {};
                    data.forEach(function (item) {
                        if (item.item_type == DRUG) {
                            drugItems.push(item);
                            if (stocks[item.id]) {
                                let stock_quantity = stocks[item.id]
                                if (item.item_type_stock && item.item_type_stock.item_stock)
                                    item.item_type_stock.item_stock.forEach(function (stock) {
                                        if (stock_quantity[stock.batch_number])
                                            stock_quantity[stock.batch_number] += stock.quantity;
                                        else
                                            stock_quantity[stock.batch_number] += stock.quantity;
                                    });
                            } else {
                                let stock_quantity = {}
                                if (item.item_type_stock && item.item_type_stock.item_stock)
                                    item.item_type_stock.item_stock.forEach(function (stock) {
                                        stock_quantity[stock.batch_number] = stock.quantity
                                    });
                                stocks[item.id] = stock_quantity;
                            }
                            itemBatches[item.id] = item.item_type_stock.item_stock;
                        }

                    });
                    let items = that.state.items;
                    items[INVENTORY] = drugItems;
                    return {
                        items: items,
                        stocks: {...prevState.stocks, ...stocks},
                        itemBatches: {...prevState.itemBatches, ...itemBatches}
                    }
                }, function () {
                    if (that.props.editId) {
                        that.loadEditInvoiceData();
                    }
                }
            )

        }
        let errorFn = function () {
        }
        let paramsApi = {
            practice: this.props.active_practiceId,
            maintain_inventory: true,
        }
        if (this.state.searchItem) {
            paramsApi.item_name = this.state.searchItem;
        }

        getAPI(INVENTORY_ITEM_API, successFn, errorFn, paramsApi);
    }

    loadProcedures() {
        var that = this;
        let successFn = function (data) {
            let items = that.state.items;
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

            that.setState(function (prevState) {
                return {
                    items: {...prevState.items, [PRESCRIPTIONS]: data}
                }
            })
        };
        let errorFn = function () {
        };
        getAPI(interpolate(UNPAID_PRESCRIPTIONS, [that.props.match.params.id]), successFn, errorFn);
    }

    loadTaxes() {
        var that = this;
        let successFn = function (data) {
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
            return {
                tableFormValues: newTableFormValues
            }
        });
    }


    add = (item, randId = Math.random().toFixed(7)) => {
        this.setState(function (prevState) {
            if (item.item_type == PROCEDURES) {
                item = {
                    ...item,
                    id: undefined,
                    unit_cost: item.cost,
                    procedure: item.id,
                    selectedDoctor: prevState.selectedDoctor ? prevState.selectedDoctor : null,
                    selectedDate: moment(),
                    taxes: item.taxes.map(tax => tax.id)
                }
            } else if (item.item_type == INVENTORY) {
                item = {
                    ...item,
                    id: undefined,
                    inventory: item.id,
                    unit_cost: item.retail_without_tax,
                    selectedDoctor: prevState.selectedDoctor ? prevState.selectedDoctor : null,
                }
            }
            return {
                tableFormValues: [...prevState.tableFormValues, {
                    ...tableFormFields,
                    ...item,
                    id: undefined,
                    _id: randId,
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
            if (drug_item.inventory.maintain_inventory)
                that.add({...drug_item.inventory, item_type: INVENTORY, inventory: item.inventory.id, id: undefined})
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
                that.setState({
                    saveLoading: true
                });
                let reqData = {
                    bank: '',
                    number: '',
                    practice: that.props.active_practiceId,
                    return_mode: null,
                    invoice: this.props.editInvoice.id,
                    procedure: [],
                    inventory: [],
                    patient: that.props.match.params.id,
                    staff: this.props.editInvoice.staff_data ? this.props.editInvoice.staff_data.id : null,
                    prescription: that.state.selectedPrescriptions,
                    date: that.state.selectedDate && moment(that.state.selectedDate).isValid() ? that.state.selectedDate.format('YYYY-MM-DD') : null,
                    return_with_tax: this.state.return_with_tax ? true : '',
                    cash_return: values.cash_return,

                };
                that.state.tableFormValues.forEach(function (item) {
                    item.unit = values.unit[item._id];
                    var id = item.id;
                    delete (item.id);
                    // item.taxes = values.taxes[item._id];
                    // item.unit_cost = values.unit_cost[item._id];
                    // item.discount = values.discount[item._id];
                    // item.discount_type = '%';
                    if (item.unit)
                        switch (item.item_type) {
                            case PROCEDURES:
                                reqData.procedure.push({
                                    ...item,
                                    // "name": item.name,
                                    "unit": item.unit,
                                    // "procedure": item.procedure,
                                    // "default_notes": null,
                                    // "is_active": true,
                                    // "margin": item.margin,
                                    // "taxes": item.taxes,
                                    // "unit_cost": item.unit_cost,
                                    // "discount": item.discount,
                                    // "discount_type": "%",
                                    // "offers": 1,
                                    procedure_inv: id,
                                    // "doctor": item.selectedDoctor ? item.selectedDoctor.id : null,
                                    // id:item.id
                                });
                                break;
                            case INVENTORY:
                                reqData.inventory.push({
                                    ...item,
                                    // "inventory": item.inventory,
                                    // "name": item.name,
                                    "unit": item.unit,
                                    // "taxes": item.taxes,
                                    // "unit_cost": item.unit_cost,
                                    // "discount": item.discount,
                                    // "discount_type": "%",
                                    // "offers": null,
                                    inventory_inv: id,
                                    // "doctor": item.selectedDoctor ? item.selectedDoctor.id : null,
                                    // "instruction": item.instruction,
                                    // "is_active": true,
                                    // batch_number: item.selectedBatch ? item.selectedBatch.batch_number : null,
                                    // id: item.id
                                });
                                break;
                            default:
                                return null;
                        }
                });
                let successFn = function (data) {
                    that.setState({
                        saveLoading: false
                    });
                    displayMessage("Inventory updated successfully");
                    that.props.loadData();
                    let url = '/patient/' + that.props.match.params.id + '/billing/invoices';
                    that.props.history.push(url);
                }
                let errorFn = function () {
                    that.setState({
                        saveLoading: false
                    });
                }

                postAPI(INVOICE_RETURN_API, reqData, successFn, errorFn);

            }
        });
    }
    addItemThroughQR = (value) => {
        let that = this;
        that.setState({
            loadingQr: true,
        })
        let qrSplitted = value.split('*');
        let successFn = function (data) {

            let item = data;
            let {setFieldsValue, getFieldsValue, getFieldValue} = that.props.form;
            let randomId = Math.random().toFixed(7);
            let flag = true
            that.state.tableFormValues.forEach(function (row) {
                if (row.name == qrSplitted[0]) {
                    let _id = row._id;
                    let batch = row.selectedBatch.batch_number;
                    let quantity = getFieldValue(`unit[${_id}]`);
                    if (batch == qrSplitted[1]) {
                        flag = false;
                        setFieldsValue({
                            [`unit[${_id}]`]: quantity + 1
                        })
                    }
                }
            });
            if (flag) {
                let unit_cost = null;
                if (data.item_type_stock && data.item_type_stock.item_stock)
                    data.item_type_stock.item_stock.forEach(function (stock) {
                        if (stock.batch_number == qrSplitted[1]) {
                            data.selectedBatch = stock;
                            unit_cost = stock.unit_cost
                        }
                    })
                that.add({...data, item_type: INVENTORY}, randomId);

                setFieldsValue({
                    [`unit_cost[${randomId}]`]: unit_cost,
                })
            }
            that.setState(function (prevState) {

                return {
                    loadingQr: false,
                    qrValue: ''
                }
            });
        }
        let errorFn = function () {

        }
        getAPI(SEARCH_THROUGH_QR, successFn, errorFn, {qr: value, form: 'Invoice'})
    }
    setQrValue = (e) => {
        let value = e.target.value;
        this.setState({
            qrValue: value
        })
    }
    searchValues = (e) => {
        let value = e.target.value;
        this.setState({
            searchItem: value,
        }, function () {
            this.loadInventoryItemList();
        })

    }
    changeNetPrice = (id) => {
        let that = this;
        const {getFieldsValue, setFields} = this.props.form;
        setTimeout(function () {
            let values = getFieldsValue();
            if (values.total_unit_cost[id]) {

                that.setState(function (prevState) {
                    let newTableValues = []
                    prevState.tableFormValues.forEach(function (tableObj) {
                        if (tableObj._id == id) {
                            let totalTaxAmount = 0;
                            values.taxes[id].forEach(function (taxid) {
                                prevState.taxes_list.forEach(function (taxObj) {
                                    if (taxObj.id == taxid)
                                        totalTaxAmount += taxObj.tax_value;
                                })
                            });
                            let retailPrice = values.total_unit_cost[id] / (1 + totalTaxAmount * 0.01);
                            newTableValues.push({...tableObj, unit_cost: retailPrice})
                        } else {
                            newTableValues.push(tableObj);
                        }
                    })
                    return {tableFormValues: newTableValues}
                })
            } else {
                that.setState({
                    retail_price: 0
                })
            }
        }, 1000);

    }

    onChangeHandle = (e) => {
        let that = this;
        this.setState({
            return_with_tax: e.target.checked
        },function(){
            that.calculateReturnCashAvailable();
        })
    }

    calculateReturnCashAvailable = () => {
        let that = this;
        let totalAmountPaid = this.state.editInvoice.payments.reduce((a, b) => a + b.pay_amount, 0);
        let totalInvoiceAmount = this.state.editInvoice.total;
        let pendingPayment = totalInvoiceAmount - totalAmountPaid;
        let worthOfReturningItems = 0;
        const {getFieldsValue} = this.props.form;
        setTimeout(function () {
            let values = getFieldsValue();
            let taxAllowed = that.state.return_with_tax;
            that.state.tableFormValues.forEach(function (item) {
                let units = values.unit[item._id];
                if (item.item_type == INVENTORY) {
                    worthOfReturningItems += units * item.unit_cost;
                    worthOfReturningItems += (taxAllowed ? (item.tax_value / item.unit) * units : null);
                } else if (item.item_type == PRESCRIPTIONS) {
                    worthOfReturningItems += units * item.unit_cost;
                    worthOfReturningItems += (taxAllowed ? (item.tax_value / item.unit) * units : null);
                } else if (item.item_type == PROCEDURES) {
                    worthOfReturningItems += units * item.unit_cost;
                    worthOfReturningItems += (taxAllowed ? (item.tax_value / item.unit) * units : null);
                }
            });
            that.setState({
                returnCashAvailable: (worthOfReturningItems > pendingPayment ? worthOfReturningItems - pendingPayment : 0).toFixed(2)
            });
        }, 500);


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
                sm: {span: 24},
                md: {span: 24},
                lg: {span: 24},
                xl: {span: 24},
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
                                <Input min={0} placeholder="Item name" size={'small'} disabled/>
                            )}
                            <span>by &nbsp;&nbsp;</span>
                            <Dropdown placement="topCenter" disabled overlay={<Menu>
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
                                        disabled
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
                            <Dropdown placement="topCenter" disabled overlay={<Menu>
                                {that.state.practiceDoctors.map(doctor =>
                                    <Menu.Item key={doctor.id}>
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
                            <Dropdown placement="topCenter" disabled overlay={<Menu>
                                {that.state.itemBatches[record.inventory] && that.state.itemBatches[record.inventory].map((batch, index) =>
                                    (moment() >= moment(batch.expiry_date) ? <Menu.Item key={index} disabled={true}>
                                        {batch.batch_number}&nbsp;({batch.quantity}) &nbsp;&nbsp;{batch.expiry_date}
                                    </Menu.Item> : <Menu.Item key={index}>
                                        <a onClick={() => that.selectBatch(batch, record._id, INVENTORY)}>{batch.batch_number}&nbsp;({batch.quantity}) &nbsp;&nbsp;{batch.expiry_date}</a>
                                    </Menu.Item>))}
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
            title: 'Returning Unit',
            key: 'unit',
            width: 100,
            dataIndex: 'unit',
            render: (item, record) => (record.item_type == INVENTORY ?
                    <Form.Item
                        key={`unit[${record._id}]`}
                        {...formItemLayout}>
                        {getFieldDecorator(`unit[${record._id}]`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            initialValue: 0,
                        })(
                            <InputNumber max={(record.unit)}
                                         onChange={this.calculateReturnCashAvailable}
                                         min={0}
                                         placeholder="units" size={'small'}
                                         disabled={!(record.selectedBatch && that.state.stocks[record.inventory] && that.state.stocks[record.inventory][record.selectedBatch.batch_number])}/>
                        )}
                    </Form.Item>
                    : <Form.Item
                        key={`unit[${record._id}]`}
                        {...formItemLayout}>
                        {getFieldDecorator(`unit[${record._id}]`, {
                            initialValue: 0,
                            validateTrigger: ['onChange', 'onBlur'],
                        })(
                            <InputNumber min={0} max={record.unit} placeholder="unit" size={'small'}
                                         onChange={this.calculateReturnCashAvailable}/>
                        )}
                    </Form.Item>
            )
        }, {
            title: 'Unit Cost',
            key: 'unit_cost',
            width: 100,
            dataIndex: 'unit_cost',
            render: (item, record) => item ? item.toFixed(2) : null
        }, {
            title: 'discount %',
            key: 'discount',
            width: 100,
            dataIndex: 'discount',
            render: (item, record) => <Form.Item
                key={`discount[${record._id}]`}
                {...formItemLayout}>
                {getFieldDecorator(`discount[${record._id}]`, {
                    initialValue: record.discount,
                    validateTrigger: ['onChange', 'onBlur'],

                })(
                    <InputNumber min={0} max={100} placeholder="discount" size={'small'} disabled={true}/>
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
                    initialValue: record.taxes || [],
                    validateTrigger: ['onChange', 'onBlur'],
                })(
                    <Select placeholder="Taxes" size={'small'} mode={"multiple"}
                            disabled={true}
                            style={{width: 150}}
                            onChange={() => that.changeNetPrice(record._id)}>
                        {this.state.taxes_list && this.state.taxes_list.map((tax) => <Select.Option
                            value={tax.id}>{tax.name}@{tax.tax_value}%</Select.Option>)}
                    </Select>
                )}
            </Form.Item>
        }, {
            title: 'Total Unit Cost',
            key: 'total',
            width: 100,
            dataIndex: 'total',
            render: (item, record) => (record.unit ? (record.total/record.unit).toFixed(2) : record.total.toFixed(2))
        }]);

        return <div>
            <Spin spinning={this.state.saveLoading} tip="Saving Invoice...">
                <Row gutter={16}>
                    <Col span={20}>
                        <Card
                            title={this.props.editId ? "Return Invoice (INV " + this.props.editId + ")" : "Add Invoice"}
                            bodyStyle={{padding: 0}}>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form onSubmit={this.handleSubmit} layout="inline">
                                        <Table pagination={false}
                                               bordered={true}
                                               dataSource={this.state.tableFormValues}
                                               columns={consumeRow}/>
                                        <Affix offsetBottom={0}>
                                            <Card>
                                                <Row gutter={16}>
                                                    <Col span={6}>
                                                        <span> &nbsp;&nbsp;on&nbsp;&nbsp;</span>
                                                        <DatePicker value={this.state.selectedDate}
                                                                    disabled
                                                                    onChange={(value) => this.selectedDefaultDate(value)}
                                                                    format={"DD-MM-YYYY"}
                                                                    allowClear={false}/>
                                                        <br/>
                                                        <br/>
                                                        <Checkbox onChange={this.onChangeHandle}
                                                                  defaultChecked={this.state.return_with_tax}>
                                                            Return With Tax
                                                        </Checkbox>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item label={"Returned Cash "}>
                                                            {getFieldDecorator('cash_return',
                                                            )
                                                            (<InputNumber min={0} max={this.state.returnCashAvailable}
                                                                          placeholder={"Cash Returned"}/>)
                                                            }
                                                            <span><br/>Max Cash Return Allowed (INR) {this.state.returnCashAvailable}</span>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={10}>
                                                        <Form.Item {...formItemLayoutWithOutLabel}
                                                                   style={{marginBottom: 0, float: 'right'}}>
                                                            <Button type="primary" htmlType="submit"
                                                                    style={{margin: 5}}>Save Return Invoice</Button>
                                                            {that.props.history ?
                                                                <Button style={{margin: 5, float: 'right'}}
                                                                        onClick={() => that.props.history.goBack()}>
                                                                    Cancel
                                                                </Button> : null}
                                                        </Form.Item>

                                                    </Col>
                                                </Row>


                                            </Card>
                                        </Affix>
                                    </Form>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Divider>Payments Done</Divider>
                        <List dataSource={this.state.editInvoice.payments}
                              renderItem={payment => <Card title={payment.payment_id} style={{marginBottom: 10}}
                                                           bodyStyle={{padding: 5}}>
                                  <p>Paid (INR)<span
                                      style={{float: 'right', fontWeight: 600}}> {payment.pay_amount.toFixed(2)}</span>
                                  </p>
                              </Card>}/>
                    </Col>
                </Row>
            </Spin>
        </div>

    }
}

export default Form.create()(AddReturnInvoice);
