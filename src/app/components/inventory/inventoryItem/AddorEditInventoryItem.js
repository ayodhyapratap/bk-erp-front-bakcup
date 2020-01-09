import React from "react";
import {Card, Form, Row, Col, Input, Button, Select, Checkbox, InputNumber} from "antd";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {CHECKBOX_FIELD, INPUT_FIELD, SUCCESS_MSG_TYPE, NUMBER_FIELD, SELECT_FIELD} from "../../../constants/dataKeys";
import {
    SINGLE_INVENTORY_ITEM_API,
    TAXES,
    MANUFACTURER_API,
    VENDOR_API,
    INVENTORY_ITEM_API,
    INVENTORY_API,
    DRUG_TYPE_API,
    DRUG_UNIT_API, PRODUCT_MARGIN
} from "../../../constants/api";
import {INVENTORY_ITEM_TYPE, DRUG, SUPPLIES, EQUIPMENT} from "../../../constants/hardData";
import {getAPI, putAPI, postAPI, displayMessage, interpolate} from "../../../utils/common";
import {Link, Redirect, Switch} from "react-router-dom";
import {Route} from "react-router";
import TextArea from "antd/lib/input/TextArea";
import {REQUIRED_FIELD_MESSAGE} from "../../../constants/messages";

const CheckboxGroup = Checkbox.Group;

class AddorEditInventoryItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // editInventoryItem: this.props.editInventoryItem ? this.props.editInventoryItem : null,
            taxes_list: this.props.taxes_list ? this.props.taxes_list : null,
            manufacture_list: this.props.manufacture_list ? this.props.manufacture_list : null,
            vendor_list: this.props.vendor_list ? this.props.vendor_list : null,
            redirect: false,
            type: this.props.editInventoryItem ? this.props.editInventoryItem : null,
            drugUnitList: [],
            drugTypeList: [],
            retail_price: 0,
            productMargin: [],
            loading:false,
        };
        this.changeRedirect = this.changeRedirect.bind(this);
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            if (!this.state.editInventoryItem) {
                this.loadData();
            }
        }
        if (this.props.taxes_list == null) {
            this.loadTaxes();
        }
        if (this.props.manufacture_list == null) {
            this.loadManufactureList();
        }
        if (this.props.vendor_list == null) {
            this.loadVendorList();
        }
        this.loadDrugType();
        this.loadDrugUnit();
        this.loadProductMargin();
    }

    loadProductMargin() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                productMargin: data
            })
        }
        let errorFn = function () {

        }
        getAPI(PRODUCT_MARGIN, successFn, errorFn);
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

    loadManufactureList() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                manufacture_list: data
            })
        }
        let errorFn = function () {

        }
        getAPI(MANUFACTURER_API, successFn, errorFn);
    }

    loadVendorList() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                vendor_list: data
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(VENDOR_API, [this.props.active_practiceId]), successFn, errorFn);
    }


    loadData() {
        let that = this;
        let successFn = function (data) {
            that.setState(function (prevState) {
                let totalTax = 0;
                data.taxes_data.forEach(function (tax) {
                    totalTax += tax.tax_value;
                });
                let net_price = (data.retail_price * (1 + totalTax * 0.01)).toFixed(2);
                return {
                    editInventoryItem: {...data, net_price: net_price},
                    type: data.item_type,
                    retail_price: data.retail_price
                }
            })
        }
        let errorFn = function () {

        }
        if (this.props.match.params.id)
            getAPI(interpolate(SINGLE_INVENTORY_ITEM_API, [this.props.match.params.id]), successFn, errorFn);

    }

    loadDrugType = () => {
        let that = this;
        let successFn = function (data) {
            that.setState({
                drugTypeList: data,
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(DRUG_TYPE_API, [this.props.active_practiceId]), successFn, errorFn);
    }
    onChangeHandeler = (e) => {
        let that = this
        that.setState({
            type: e,
        })
    }

    loadDrugUnit() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                drugUnitList: data
            })
        }
        let errorFn = function () {
        }
        getAPI(interpolate(DRUG_UNIT_API, [this.props.active_practiceId]), successFn, errorFn);
    }

    setFormParams = (type, value) => {
        this.setState({
            [type]: value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let that = this;
        this.props.form.validateFields((err, formData) => {
            if (!err) {
                let reqData = {
                    ...formData,
                    retail_without_tax: that.state.retail_price,
                    net_price: undefined,
                    practice: this.props.active_practiceId,

                }
                if (this.state.editInventoryItem) {
                    reqData.id = this.state.editInventoryItem.id
                }

                let successFn = function (data) {
                    that.setState({
                        redirect: true,
                    });
                    that.props.loadData();
                    that.props.history.replace('/inventory');
                };
                let errorFn = function () {

                };
                if (!this.state.editInventoryItem) {
                    postAPI(interpolate(INVENTORY_ITEM_API, [this.props.match.params.id]), reqData, successFn, errorFn);
                } else {
                    putAPI(interpolate(SINGLE_INVENTORY_ITEM_API, [this.props.match.params.id]), reqData, successFn, errorFn);
                }

            }
        });
    }
    changeNetPrice = (value) => {
        let that = this;
        const {getFieldsValue, setFields} = this.props.form;
        setTimeout(function () {
            let values = getFieldsValue();
            if (values.retail_with_tax) {
                let totalTaxAmount = 0;
                values.taxes.forEach(function (taxid) {
                    that.state.taxes_list.forEach(function (taxObj) {
                        if (taxObj.id == taxid)
                            totalTaxAmount += taxObj.tax_value;
                    })
                });
                let retailPrice = values.retail_with_tax / (1 + totalTaxAmount * 0.01);
                that.setState({
                    retail_price: retailPrice.toFixed(2)
                })
            } else {
                that.setState({
                    retail_price: 0
                })
            }
        }, 1000);

    }

    render() {
        let that = this;
        const taxesOption = [];
        if (this.state.taxes_list) {
            this.state.taxes_list.forEach(function (drug) {
                taxesOption.push({label: (drug.name + "(" + drug.tax_value + "%)"), value: drug.id});
            })
        }
        const manufacturerOption = [];
        if (this.state.manufacture_list) {
            this.state.manufacture_list.forEach(function (manufacturer) {
                manufacturerOption.push({label: (manufacturer.name), value: manufacturer.id});
            })
        }

        const vendorOption = [];
        if (this.state.vendor_list) {
            this.state.vendor_list.forEach(function (vendor) {
                vendorOption.push({label: (vendor.name), value: vendor.id});
            })
        }
        const {getFieldDecorator} = this.props.form;

        const formItemLayout = ({
            labelCol: {span: 10},
            wrapperCol: {span: 14},
        });

        return <Card title={this.state.editInventoryItem ? "Edit Inventory Item" : "Add Inventory Item"} loading={this.state.loading}>
            <Row>
                <Col span={18} >
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item label="Item Name" {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.name : null,
                                rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}]
                            })
                            (<Input placeholder="Item Name"/>)
                            }
                        </Form.Item>

                        <Form.Item label="HSN" {...formItemLayout}>
                            {getFieldDecorator('code', {initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.code : null})
                            (<Input placeholder="HSN Number"/>)
                            }
                        </Form.Item>
                        {this.state.manufacturerType && this.state.manufacturerType == INPUT_FIELD ?
                            <Form.Item key={'manufacturer_extra'} label={"Manufacturer"}  {...formItemLayout}>
                                {getFieldDecorator("manufacturer_extra", {
                                    initialValue: that.state.editPrescreption ? that.state.editPrescreption.manufacturer_extra : null,
                                    rules: [{
                                        required: true,
                                        message: REQUIRED_FIELD_MESSAGE
                                    }]
                                })(
                                    <Input/>
                                )}
                                <a onClick={() => that.setFormParams('manufacturerType', SELECT_FIELD)}>Choose
                                    Manufacturer</a>
                            </Form.Item>
                            : <Form.Item key={"manufacturer"} {...formItemLayout} label={"Manufacturer"}>
                                {getFieldDecorator("manufacturer", {
                                    initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.manufacturer : null,
                                })(
                                    <Select>
                                        {manufacturerOption.map((option) => <Select.Option
                                            value={option.value}>{option.label}</Select.Option>)}
                                    </Select>
                                )}
                                <a onClick={() => that.setFormParams('manufacturerType', INPUT_FIELD)}>Add New
                                    Manufacturer</a>
                            </Form.Item>}
                        <Form.Item label="Stocking Unit" {...formItemLayout}>
                            {getFieldDecorator('stocking_unit', {
                                initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.stocking_unit : null,
                                rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}],
                            })
                            (<Input placeholder="Example: Bottles, Strips etc."/>)
                            }<p>(Make sure this is the same as the unit in which you dispense this item.)</p>
                        </Form.Item>

                        <Form.Item label="Re-Order Level" {...formItemLayout}>
                            {getFieldDecorator('re_order_level', {initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.re_order_level : null})
                            (<InputNumber placeholder="Re-Order Level"/>)
                            }
                        </Form.Item>
                        <Form.Item label="Net Price" {...formItemLayout}>
                            {getFieldDecorator('retail_with_tax', {
                                initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.retail_with_tax : null,
                                rules: [{
                                    required: true,
                                    message: REQUIRED_FIELD_MESSAGE
                                }]
                            })
                            (<InputNumber onChange={this.changeNetPrice}/>)
                            }<span className="ant-form-text">INR</span>
                        </Form.Item>
                        <Form.Item label="Tax" {...formItemLayout}>
                            {getFieldDecorator('taxes', {initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.taxes : []})
                            (<CheckboxGroup onChange={this.changeNetPrice}>
                                {taxesOption.map((option) => <Checkbox
                                    value={option.value}>{option.label}
                                </Checkbox>)}
                            </CheckboxGroup>)
                            }
                        </Form.Item>
                        <Form.Item label="Retail Price" {...formItemLayout}>
                            <span className="ant-form-text"><b>{that.state.retail_price}</b>&nbsp;INR</span>
                        </Form.Item>

                        <Form.Item key={"margin"} {...formItemLayout} label={"MLM Margin"}>
                            {getFieldDecorator("margin", {
                                initialValue: this.state.editingProcedureData ? this.state.editingProcedureData.margin : null,
                            })(
                                <Select>
                                    {this.state.productMargin.map((option) => <Select.Option
                                        value={option.id}>{option.name}</Select.Option>)}
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="Item Type" {...formItemLayout}>
                            {getFieldDecorator('item_type', {
                                initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.item_type : null,
                                rules: [{required: true, message: REQUIRED_FIELD_MESSAGE}],
                            })
                            (<Select placeholder="Item Type" onChange={this.onChangeHandeler}>
                                {INVENTORY_ITEM_TYPE.map((option) => <Select.Option
                                    value={option.value}>{option.label}
                                </Select.Option>)}
                            </Select>)

                            }
                        </Form.Item>

                        {this.state.type == DRUG ? <div>
                                <Form.Item label="I prescribe this" {...formItemLayout}>
                                    {getFieldDecorator('perscribe_this', {
                                        valuePropName: 'checked',
                                        initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.perscribe_this : false
                                    })
                                    (<Checkbox></Checkbox>)
                                    }
                                </Form.Item>
                                {this.state.drugType && this.state.drugType == INPUT_FIELD ?
                                    <Form.Item key={'drug_type_extra'} label={"Medicine Type"}  {...formItemLayout}>
                                        {getFieldDecorator("drug_type_extra", {
                                            initialValue: that.state.editInventoryItem ? that.state.editInventoryItem.drug_type_extra : null,
                                            rules: [{
                                                required: true,
                                                message: REQUIRED_FIELD_MESSAGE
                                            }]
                                        })(
                                            <Input/>
                                        )}
                                        <a onClick={() => that.setFormParams('drugType', SELECT_FIELD)}>Choose Medicine
                                            Type</a>
                                    </Form.Item>
                                    : <Form.Item key={"drug_type"} {...formItemLayout} label={"Medicine Type"}>
                                        {getFieldDecorator("drug_type", {
                                            initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.drug_type : null,
                                            rules: [{
                                                required: true,
                                                message: REQUIRED_FIELD_MESSAGE
                                            }]
                                        })(
                                            <Select>
                                                {that.state.drugTypeList.map((option) => <Select.Option
                                                    value={option.id}>{option.name}</Select.Option>)}
                                            </Select>
                                        )}
                                        <a onClick={() => that.setFormParams('drugType', INPUT_FIELD)}>Add New Medicine
                                            Type</a>
                                    </Form.Item>}
                                <Form.Item label="Strength" {...formItemLayout}>
                                    {getFieldDecorator('strength', {initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.strength : null})
                                    (<InputNumber/>)
                                    }
                                </Form.Item>
                                {this.state.drugUnit && this.state.drugUnit == INPUT_FIELD ?
                                    <Form.Item key={'unit_type_extra'} label={"Strength Unit"}  {...formItemLayout}>
                                        {getFieldDecorator("unit_type_extra", {
                                            initialValue: that.state.editInventoryItem ? that.state.editInventoryItem.unit_type_extra : null,
                                            rules: [{
                                                required: true,
                                                message: REQUIRED_FIELD_MESSAGE
                                            }]
                                        })(
                                            <Input/>
                                        )}
                                        <a onClick={() => that.setFormParams('drugUnit', SELECT_FIELD)}>Choose Strength
                                            Unit</a>
                                    </Form.Item>
                                    : <Form.Item key={"stength_unit"} {...formItemLayout} label={"Strength Unit"}>
                                        {getFieldDecorator("stength_unit", {
                                            initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.stength_unit : null,
                                            rules: [{
                                                required: true,
                                                message: REQUIRED_FIELD_MESSAGE
                                            }]
                                        })(
                                            <Select>
                                                {that.state.drugUnitList.map((option) => <Select.Option
                                                    value={option.id}>{option.name}</Select.Option>)}
                                            </Select>
                                        )}
                                        <a onClick={() => that.setFormParams('drugUnit', INPUT_FIELD)}>Add New Strength
                                            Unit</a>
                                    </Form.Item>}
                                <Form.Item label="Instructions" {...formItemLayout}>
                                    {getFieldDecorator('instructions', {initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.instructions : null})
                                    (<TextArea/>)
                                    }
                                </Form.Item>

                            </div>

                            : null}
                        {this.state.type == SUPPLIES ? <div>
                                <Form.Item label="I prescribe this" {...formItemLayout}>
                                    {getFieldDecorator('perscribe_this', {
                                        valuePropName: 'checked',
                                        initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.perscribe_this : false
                                    })
                                    (<Checkbox></Checkbox>)
                                    }
                                </Form.Item>
                                <Form.Item label="Strength Unit" {...formItemLayout}>
                                    {getFieldDecorator('strength', {initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.strength : null})
                                    (<Input/>)
                                    }
                                </Form.Item>

                                {this.state.drugUnit && this.state.drugUnit == INPUT_FIELD ?
                                    <Form.Item key={'unit_type_extra'} label={"Strength Unit"}  {...formItemLayout}>
                                        {getFieldDecorator("unit_type_extra", {
                                            initialValue: that.state.editInventoryItem ? that.state.editInventoryItem.unit_type_extra : null,
                                            rules: [{
                                                required: true,
                                                message: REQUIRED_FIELD_MESSAGE
                                            }]
                                        })(
                                            <Input/>
                                        )}
                                        <a onClick={() => that.setFormParams('drugUnit', SELECT_FIELD)}>Choose Strength
                                            Unit</a>
                                    </Form.Item>
                                    : <Form.Item key={"stength_unit"} {...formItemLayout} label={"Strength Unit"}>
                                        {getFieldDecorator("stength_unit", {
                                            initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.stength_unit : null,
                                            rules: [{
                                                required: true,
                                                message: REQUIRED_FIELD_MESSAGE
                                            }]
                                        })(
                                            <Select>
                                                {that.state.drugUnitList.map((option) => <Select.Option
                                                    value={option.id}>{option.name}</Select.Option>)}
                                            </Select>
                                        )}
                                        <a onClick={() => that.setFormParams('drugUnit', INPUT_FIELD)}>Add New Strength
                                            Unit</a>
                                    </Form.Item>}

                                <Form.Item label="Instructions" {...formItemLayout}>
                                    {getFieldDecorator('instructions', {initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.instructions : null})
                                    (<TextArea/>)
                                    }
                                </Form.Item>
                            </div>
                            : null}
                        {this.state.type == EQUIPMENT ? <div>
                                <Form.Item label="I prescribe this" {...formItemLayout}>
                                    {getFieldDecorator('perscribe_this', {
                                        valuePropName: 'checked',
                                        initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.perscribe_this : null
                                    })
                                    (<Checkbox></Checkbox>)
                                    }
                                </Form.Item>
                                <Form.Item label="Instructions" {...formItemLayout}>
                                    {getFieldDecorator('instructions', {initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.instructions : null})
                                    (<TextArea/>)
                                    }
                                </Form.Item>
                            </div>

                            : null}

                        <Form.Item>
                            <Button style={{margin: 5}} type="primary" htmlType="submit">
                                Submit
                            </Button>
                            {that.props.history ?
                                <Button style={{margin: 5}} onClick={() => that.props.history.goBack()}>
                                    Cancel
                                </Button> : null}
                        </Form.Item>


                    </Form>
                </Col>
            </Row>
            {this.state.redirect && <Redirect to={'/inventory'}/>}
        </Card>

    }
}

export default Form.create()(AddorEditInventoryItem);
