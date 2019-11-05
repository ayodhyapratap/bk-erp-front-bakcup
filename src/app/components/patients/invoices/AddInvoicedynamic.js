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
    Tag
} from "antd";
import {displayMessage, getAPI, interpolate, postAPI, putAPI} from "../../../utils/common";
import {CURRENCY_TYPE, DRUG, INVENTORY, PRESCRIPTIONS, PROCEDURES} from "../../../constants/hardData";
import {
    CREATE_OR_EDIT_INVOICES,
    INVENTORY_ITEM_API, OFFERS,
    PROCEDURE_CATEGORY,
    SEARCH_THROUGH_QR,
    SINGLE_INVOICE_API,
    TAXES,
    UNPAID_PRESCRIPTIONS
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

class Addinvoicedynamic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            selectedDoctor: {},
            tempValues: {},
            offers:[],
            // loading:true,
            taxes_list:[],

        }

    }

    componentDidMount() {
        loadDoctors(this);
        this.loadInventoryItemList();
        this.loadProcedures();
        this.loadPrescriptions();
        this.loadTaxes();
        this.loadLoyaltyDiscount();
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
        let that=this;
        let invoice = this.props.editInvoice;

        this.setState(function (prevState) {
            let tableValues = [];
            invoice.procedure.forEach(function (proc) {
                let id = Math.random().toFixed(7);
                tableValues.push({
                    ...proc.procedure_data,
                    ...proc,
                    selectedDoctor: proc.doctor_data,
                    selectedDate: moment(proc.date).isValid() ? moment(proc.date) : null,
                    _id: id,
                    item_type: PROCEDURES
                });
                that.changeNetPrice(id, proc.discount)
            });
            let stocks = {...prevState.stocks};
            invoice.inventory.forEach(function (proc) {
                let id = Math.random().toFixed(7);
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
                    _id: id,
                    item_type: INVENTORY
                });
                that.changeNetPrice(id, proc.discount)
            });

            return {
                tableFormValues: tableValues,
                selectedDate: moment(invoice.date).isValid() ? moment(invoice.date) : null,
                stocks: stocks,
                // loading:false,
            }
        })

    };

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
                        itemBatches: {...prevState.itemBatches, ...itemBatches},
                        saveLoading:false,
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
                    finalTableFormValues.push({...formValue, selectedDoctor: doctor});

                } else {
                    finalTableFormValues.push(formValue);

                }
            });
            return {
                tableFormValues: finalTableFormValues,
                // selectedDoctor:doctor,
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
                    practice: that.props.active_practiceId,
                    patient: that.props.match.params.id,
                    unit: null,
                    cost: null,
                    discount: null,
                    taxes: 0,
                    total: null,
                    procedure: [],
                    inventory: [],
                    prescription: that.state.selectedPrescriptions,
                    date: that.state.selectedDate && moment(that.state.selectedDate).isValid() ? that.state.selectedDate.format('YYYY-MM-DD') : null,
                };
                that.state.tableFormValues.forEach(function (item) {
                    item.unit = values.unit[item._id];
                    item.taxes = values.taxes[item._id];
                    // item.unit_cost = values.unit_cost[item._id];
                    item.discount = values.discount[item._id];
                    item.discount_type = '%';
                    switch (item.item_type) {
                        case PROCEDURES:
                            reqData.procedure.push({
                                "name": item.name,
                                "unit": item.unit,
                                "procedure": item.procedure,
                                "default_notes": null,
                                "is_active": true,
                                "margin": item.margin,
                                "taxes": item.taxes,
                                "unit_cost": item.unit_cost,
                                // "unit_cost": item.total_unit_cost?item.total_unit_cost:item.unit_cost,
                                "discount": item.discount?item.discount.toString().split('#')[0]:0,
                                "discount_type": "%",
                                "offers": null,
                                "doctor": item.selectedDoctor ? item.selectedDoctor.id : null,
                                id: that.props.editId ? item.id : undefined
                            });
                            break;
                        case INVENTORY:
                            reqData.inventory.push({
                                "inventory": item.inventory,
                                "name": item.name,
                                "unit": item.unit,
                                "taxes": item.taxes,
                                "unit_cost": item.unit_cost,
                                // "unit_cost": item.total_unit_cost?item.total_unit_cost:item.unit_cost,
                                "discount": item.discount?item.discount.toString().split('#')[0]:0,
                                "discount_type": "%",
                                "offers": null,
                                "doctor": item.selectedDoctor ? item.selectedDoctor.id : null,
                                "instruction": item.instruction,
                                "is_active": true,
                                batch_number: item.selectedBatch ? item.selectedBatch.batch_number : null,
                                id: that.props.editId ? item.id : undefined
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
                };
                let errorFn = function () {
                    that.setState({
                        saveLoading: false
                    });
                };
                if (that.props.editId) {
                    putAPI(interpolate(SINGLE_INVOICE_API,[that.props.editId]), reqData, successFn, errorFn);
                } else {
                    postAPI(CREATE_OR_EDIT_INVOICES, reqData, successFn, errorFn);
                }

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
    changeNetPrice = (id,value) => {
        let that = this;
        const {getFieldsValue, setFields} = this.props.form;
        setTimeout(function () {
            let values = getFieldsValue();
            if (values.unit_cost[id] || values.unit[id] || values.discount[id] ) {
                that.setState(function (prevState) {
                    let newTableValues = []
                    prevState.tableFormValues.forEach(function (tableObj) {
                        if (tableObj._id == id) {

                            let totalTaxAmount = 0;
                            let initialDiscount=0;
                            let selectOption=tableObj.selectOption || tableObj.selectOption==false?tableObj.selectOption:false;
                            values.taxes[id].forEach(function (taxid) {
                                prevState.taxes_list.forEach(function (taxObj) {
                                    if (taxObj.id == taxid)
                                        totalTaxAmount += taxObj.tax_value;
                                })
                            });
                            if (value) {
                                if (value == '0') {
                                    selectOption = false
                                } else {
                                    initialDiscount = values.discount[id] ? values.discount[id].toString().split('#')[0] : '';
                                }
                            }



                            let retailPrice = (values.unit_cost[id]?values.unit_cost[id]:0)*(1-(value && values.discount[id]?values.discount[id].toString().split('#')[0]:initialDiscount)*0.01) * (1 + totalTaxAmount * 0.01);
                            // console.log("TAX",retailPrice);
                            let total = values.unit[id]*retailPrice;

                            newTableValues.push({...tableObj, total_unit_cost: retailPrice ,total:total,selectOption:selectOption,discount:initialDiscount})
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

    };

    loadLoyaltyDiscount = () => {
        let that = this;
        let successFn = function (data) {
            that.setState({
                offers: data,
                // loading: false
            })
        };
        let errorFn = function () {
            that.setState({
                // loading: true
            })
        };
        getAPI(interpolate(OFFERS, [this.props.active_practiceId]), successFn, errorFn);
    };
    onChangeOption=(type ,id)=>{
       let that=this;
        that.setState(function (prevState) {
            let tempArr = [];

            prevState.tableFormValues.forEach(function (formValue) {

                if (formValue._id == id) {
                    tempArr.push({...formValue, selectOption: true})
                } else {
                    tempArr.push(formValue)
                }
            });
            return {tableFormValues: tempArr}
        });
    };
    onChangeOffer =(value ,id)=>{
        let that=this;
            that.setState(function (prevState) {
                let selectedOffer=[];
                prevState.tableFormValues.forEach(function (formValue) {
                    if (formValue._id == id){

                        if(value == 'none'){
                            selectedOffer.push({...formValue , loyaltyDiscount:null})
                        }
                        if(value == '0'){
                            selectedOffer.push({...formValue,selectOption:false})
                        }else{
                            prevState.offers.forEach(function (item) {

                                if (item.id == value){
                                    selectedOffer.push({...formValue , loyaltyDiscount:item.discount})
                                }
                            });
                        }


                    }else{
                        selectedOffer.push(formValue);
                    }
                });
                return{ tableFormValues:selectedOffer}

            });

    };


    onchangeDiscountSimple = (value ,id)=>{
        console.log(value,id);
        let that=this;
        that.setState(function (prevState) {
            let selectedOffer=[];
            prevState.tableFormValues.forEach(function (formValue) {
                if (formValue._id == id){

                    let retailPrice = formValue.unit_cost / (1 + value * 0.01);
                    console.log(retailPrice);
                    selectedOffer.push({...formValue , loyaltyDiscount:value})

                }else{
                    selectedOffer.push(formValue);
                }
            });
            return{ tableFormValues:selectedOffer}

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

        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '%',
        })(
            <Select>
              {CURRENCY_TYPE.map(option =><Select.Option value={option.value}> {option.value}</Select.Option>)}
            </Select>
        );

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
                            <span>{record.name}</span>

                            <span><br/>by &nbsp;&nbsp;</span>
                            <Dropdown placement="topCenter" overlay={<Menu>
                                {that.state.practiceDoctors.map(doctor =>
                                    <Menu.Item key={doctor.id}>
                                        <a onClick={() => that.selectDoctor(doctor, record._id, INVENTORY)}>{doctor.user.first_name}</a>
                                    </Menu.Item>)}
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link" href="#">
                                    <b>
                                        {record.selectedDoctor.user ? record.selectedDoctor.user.first_name : 'No DOCTORS Found'}
                                    </b>
                                </a>
                            </Dropdown>
                            <span><br/>from batch &nbsp;&nbsp;</span>
                            <Dropdown placement="topCenter" overlay={<Menu>
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
            title: 'Unit',
            key: 'unit',
            width: 100,
            dataIndex: 'unit',
            render: (item, record) => (record.item_type == INVENTORY ?
                    <Form.Item
                        key={`unit[${record._id}]`}
                        {...formItemLayout}>
                        {getFieldDecorator(`unit[${record._id}]`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            initialValue: record.unit || 1,
                            rules: [{
                                required: true,
                                message: "This field is required.",
                            }],
                        })(
                            <InputNumber min={1}
                                         max={(record.selectedBatch && that.state.stocks[record.inventory] && that.state.stocks[record.inventory][record.selectedBatch.batch_number] ? that.state.stocks[record.inventory][record.selectedBatch.batch_number] : 0)}
                                         placeholder="units" size={'small'}  onChange={(value) => this.changeNetPrice( record._id,record.discount)}
                                         disabled={!(record.selectedBatch && that.state.stocks[record.inventory] && that.state.stocks[record.inventory][record.selectedBatch.batch_number])}/>
                        )}
                    </Form.Item>
                    : <Form.Item
                        key={`unit[${record._id}]`}
                        {...formItemLayout}>
                        {getFieldDecorator(`unit[${record._id}]`, {
                            initialValue: record.unit || 1,
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                message: "This field is required.",
                            }],
                        })(
                            <InputNumber min={1} max={100} placeholder="unit" size={'small'}  onChange={(value) => this.changeNetPrice(record._id,record.discount)}/>
                        )}
                    </Form.Item>
            )
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
                    initialValue: record.item_type == INVENTORY ? record.retail_without_tax : record.cost,
                    rules: [{
                        required: true,
                        message: "This field is required.",
                    }],
                })(
                    <InputNumber min={1} placeholder="Unit Cost" size={'small'} onChange={() => that.changeNetPrice(record._id,record.discount)}/>
                )}
            </Form.Item>
            // render: (item, record) => item ? item.toFixed(2) : null
        }, {
            title: 'discount %',
            key: 'discount',
            width: 100,
            dataIndex: 'discount',
            render: (item, record) =>(record.selectOption ?
            <Form.Item  key={`discount[${record._id}]`} extra={<span>{record && record.discount?record.discount + '% Discount' :null} </span>}>
                  {getFieldDecorator(`discount[${record._id}]`, {
                    initialValue: record.discount,
                    validateTrigger: ['onChange', 'onBlur'],

                })

               (<Select style={{width:150}} onChange={(value)=>that.changeNetPrice(record._id ,value)} size={"small"}>
                    {/* <Select.Option value={'none'}>None</Select.Option> */}
                    {that.state.offers.map(option =><Select.Option value={option.discount+'#'+option.id}>{option.code}</Select.Option>)}
                    <Select.Option value={'0'}>Custom</Select.Option>
                </Select>)
                }
            </Form.Item>:<Form.Item extra={<a  onClick={()=>that.onChangeOption('selectOption' ,record._id)}>Choose Form Offers</a>}
                key={`discount[${record._id}]`}
                {...formItemLayout}>
                {getFieldDecorator(`discount[${record._id}]`, {
                    initialValue: record.discount?record.discount:0,
                    validateTrigger: ['onChange', 'onBlur'],

                })(
                    <Input placeholder="discount"  addonAfter={prefixSelector} size={"small"}
                           style={{ width: 150 }}  onChange={(e) => this.changeNetPrice(record._id,e.target.value)}/>
                )}
            </Form.Item>)
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
                            style={{width:150}}
                            onChange={() => that.changeNetPrice(record._id,record.discount)}>
                        {this.state.taxes_list && this.state.taxes_list.map((tax) => <Select.Option
                            value={tax.id}>{tax.name}@{tax.tax_value}%</Select.Option>)}
                    </Select>
                )}
            </Form.Item>
        }, {
            title: 'Total Unit Cost',
            key: 'total_unit_cost',
            width: 100,
            dataIndex: 'total_unit_cost',
            // render: (item, record) => <Form.Item
            //     key={`total_unit_cost[${record._id}]`}
            //     {...formItemLayout}>
            //     {getFieldDecorator(`total_unit_cost[${record._id}]`, {
            //         validateTrigger: ['onChange', 'onBlur'],
            //         initialValue: record.item_type == INVENTORY ? record.retail_with_tax : record.cost_with_tax,
            //         rules: [{
            //             required: true,
            //             message: "This field is required.",
            //         }],
            //     })(
            //         <InputNumber min={0} placeholder="Unit Cost" size={'small'}
            //                      onChange={() => that.changeNetPrice(record._id)}/>
            //     )}
            // </Form.Item>
            // render: (item, record) => item ? item.toFixed(2) : null
            // render: (item, record) => ((record.item_type == INVENTORY) && record.total_unit_cost) ? record.total_unit_cost.toFixed(2) :record.cost_with_tax ?record.cost_with_tax.toFixed(2) :record.retail_with_tax.toFixed(2),
            render:(item,record)=><span>{item?item.toFixed(2):record.item_type == INVENTORY ? record.retail_with_tax.toFixed(2) : record.cost_with_tax.toFixed(2)}</span>,
        },{
            title:'Total',
            key:'total',
            width:100,
            dataIndex:'total',
            render: (item, record) => item ? item.toFixed(2) : null

        }]);

        consumeRow = consumeRow.concat([{
            key: '_id',
            dataIndex: '_id',
            render: (value, record) => <Button icon={"close"} onClick={() => that.remove(record._id)}
                                               type={"danger"} shape="circle"
                                               size="small"/>
        }]);

        return <div>
            <Spin spinning={this.state.saveLoading} tip="Saving Invoice...">
                <Card
                    title={this.props.editId ? "Edit Invoice (INV " + this.props.editId + ")" : "Add Invoice"}
                    extra={<Search
                        loading={this.state.loadingQr}
                        value={this.state.qrValue}
                        onChange={this.setQrValue}
                        placeholder="Search QR Code"
                        onSearch={this.addItemThroughQR}
                        style={{width: 200}}
                    />}
                    bodyStyle={{padding: 0}}>
                    <Row gutter={16}>
                        <Col span={7}>
                            <Tabs size="small" type="card">
                                <TabPane tab={INVENTORY} key={INVENTORY}>
                                    <div style={{backgroundColor: '#ddd', padding: 8}}>
                                        <Input.Search placeholder={"Search in Inventory "}
                                                      onChange={this.searchValues}/>
                                    </div>
                                    <List size={"small"}
                                          itemLayout="horizontal"
                                          dataSource={this.state.items ? this.state.items[INVENTORY] : []}
                                          renderItem={item => (
                                              <List.Item>
                                                  <List.Item.Meta
                                                      title={item.name + ' ('+ item.total_quantity +')'}
                                                  />
                                                  <Button type="primary" size="small" shape="circle"
                                                          onClick={() => this.add({
                                                              ...item,
                                                              item_type: INVENTORY
                                                          })}
                                                          icon={"arrow-right"}/>
                                              </List.Item>)}/>
                                </TabPane>
                                <TabPane tab={PRESCRIPTIONS} key={PRESCRIPTIONS}>
                                    <List size={"small"}
                                          itemLayout="horizontal"
                                          dataSource={this.state.items ? this.state.items[PRESCRIPTIONS] : []}
                                          renderItem={item => (
                                              <List.Item>
                                                  <List.Item.Meta
                                                      title={item.drugs.map(drug_item => <div>
                                                          <span>{drug_item.name}</span> {drug_item.inventory.maintain_inventory ? null :
                                                          <Tag color="red" style={{
                                                              float: 'right',
                                                              lineHeight: '18px'
                                                          }}>Not
                                                              Sold</Tag>}<br/></div>)}
                                                      description={item.doctor ?
                                                          <Tag
                                                              color={item.doctor ? item.doctor.calendar_colour : null}>
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
                                                          onClick={() => this.add({
                                                              ...item,
                                                              item_type: PROCEDURES
                                                          })}
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
                                        <Col span={8}>
                                            <h3>Grand Total: <b>{this.state.tableFormValues.reduce(function (total, item) {
                                                return (parseFloat(total) + (item&&item.total?item.total:0)).toFixed(2);
                                            },0)}</b></h3>
                                        </Col>

                                        <span> &nbsp;&nbsp;on&nbsp;&nbsp;</span>
                                        <DatePicker value={this.state.selectedDate}
                                                    onChange={(value) => this.selectedDefaultDate(value)}
                                                    format={"DD-MM-YYYY"}
                                                    allowClear={false}/>

                                        <Form.Item {...formItemLayoutWithOutLabel}
                                                   style={{marginBottom: 0, float: 'right'}}>

                                            <Button type="primary" htmlType="submit"
                                                    style={{margin: 5}}>Save Invoice</Button>
                                            {that.props.history ?
                                                <Button style={{margin: 5, float: 'right'}}
                                                        onClick={() => that.props.history.goBack()}>
                                                    Cancel
                                                </Button> : null}
                                        </Form.Item>
                                    </Card>
                                </Affix>
                            </Form>
                        </Col>
                    </Row>
                </Card>
            </Spin>
        </div>

    }
}

export default Form.create()(Addinvoicedynamic);
