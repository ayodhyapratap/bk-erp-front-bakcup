import React from "react";
import {Card, Form, Row,Col,Input,Button ,Select,Checkbox,InputNumber} from "antd";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {CHECKBOX_FIELD, INPUT_FIELD, SUCCESS_MSG_TYPE, NUMBER_FIELD, SELECT_FIELD} from "../../../constants/dataKeys";
import {
    SINGLE_INVENTORY_ITEM_API,
    TAXES,
    MANUFACTURER_API,
    VENDOR_API,
    INVENTORY_ITEM_API,
    INVENTORY_API,
    DRUG_TYPE_API
} from "../../../constants/api";
import {INVENTORY_ITEM_TYPE ,DRUG, SUPPLIES, EQUIPMENT} from "../../../constants/hardData";
import {getAPI, postAPI,displayMessage, interpolate} from "../../../utils/common";
import {Link, Redirect, Switch} from "react-router-dom";
import {Route} from "react-router";
import TextArea from "antd/lib/input/TextArea";

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
            type:this.props.editInventoryItem ? this.props.editInventoryItem: null,
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
            that.setState({
                editInventoryItem: data,
                type:data.item_type,
            })
        }
        let errorFn = function () {

        }
        if (this.props.match.params.id)
            getAPI(interpolate(SINGLE_INVENTORY_ITEM_API, [this.props.match.params.id]), successFn, errorFn);

    }
    loadDrugType=()=> {
        let that = this;
        let successFn = function (data) {
            that.setState({
                drug_type: data,
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(DRUG_TYPE_API,[this.props.active_practiceId]), successFn, errorFn);
    }
    onChangeHandeler =(e)=>{
        let that=this
        that.setState({
            type: e,
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        let that = this;
        this.props.form.validateFields((err, formData) => {
            if (!err) {
                let reqData = {
                    ...formData,
                    practice:this.props.active_practiceId,
                }

                let successFn = function (data) {
                    that.setState({
                        redirect:true
                        
                    })
                    that.props.loadData();
                    
                };
                let errorFn = function () {
                };
                postAPI(interpolate(INVENTORY_ITEM_API, [this.props.match.params.id]), reqData, successFn, errorFn);
            }
        });
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
        
        
        return <Card title={this.state.editInventoryItem ? "Edit Inventory Item" :"Add Inventory Item"}>
                    <Row>
                        <Col span={18}>
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Item label="Item Name" {...formItemLayout}>
                                    {getFieldDecorator('name',{initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.name : null})
                                    (<Input placeholder="Item Name"/>)
                                }
                                </Form.Item>

                                <Form.Item label="Item Code" {...formItemLayout}>
                                    {getFieldDecorator('code', {initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.code : null})
                                    (<Input placeholder="Item Code"/>)
                                    }
                                </Form.Item>

                                <Form.Item label="Manufacturer" {...formItemLayout}>
                                    {getFieldDecorator('manufacturer', {initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.manufacturer : null})
                                    (<Select placeholder="manufacturer">
                                        {manufacturerOption.map((option) => <Select.Option
                                        value={option.value}>{option.label}</Select.Option>)}
                                    </Select>)

                                    }
                                </Form.Item>

                                <Form.Item label="Stocking Unit" {...formItemLayout}>
                                    {getFieldDecorator('stocking_unit', {initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.stocking_unit : null})
                                        (<Input placeholder="Example: Bottles, Strips etc."/>)
                                    }
                                </Form.Item>

                                <Form.Item label="Re-Order Level" {...formItemLayout}>
                                    {getFieldDecorator('re_order_level', {initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.re_order_level : null})
                                        (<Input placeholder="Re-Order Level"/>)
                                    }
                                </Form.Item>

                                <Form.Item label="Retail Price" {...formItemLayout}>
                                    {getFieldDecorator('retail_price', {initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.retail_price : null})
                                        (<InputNumber />)
                                    }
                                </Form.Item>

                                <Form.Item label="Tax" {...formItemLayout}>
                                    {getFieldDecorator('taxes', {initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.taxes : []})
                                        (<CheckboxGroup>
                                           {taxesOption.map((option) =><Checkbox
                                           value={option.value}>{option.label}
                                           </Checkbox>)}
                                        </CheckboxGroup>)
                                    }
                                </Form.Item>

                                <Form.Item label="Item Type" {...formItemLayout}>
                                    {getFieldDecorator('item_type', {initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.item_type : null,})
                                    (<Select placeholder="Item Type" onChange={this.onChangeHandeler}>
                                        {INVENTORY_ITEM_TYPE.map((option) => <Select.Option
                                        value={option.value}>{option.label}
                                        </Select.Option>)}
                                    </Select>)

                                    }
                                </Form.Item>
                                    
                                {this.state.type == DRUG ? <div>
                                        <Form.Item label="I prescribe this" {...formItemLayout}>
                                            {getFieldDecorator('perscribe_this', {})
                                                (<Checkbox></Checkbox>)
                                            }
                                        </Form.Item>
                                        <Form.Item label="Drug Type" {...formItemLayout}>
                                            {getFieldDecorator('drug_type',{})
                                            (<Select placeholder="Drug Type">
                                                {/* {this.state.drug_type.map((option) => <Select.Option
                                                value={option.value}>{option.label}
                                            </Select.Option>)} */}
                                        </Select>)
                                        }
                                        </Form.Item>
                                        <Form.Item label="Strength" {...formItemLayout}>
                                            {getFieldDecorator('strength',{})
                                            (<InputNumber />)
                                        }
                                        </Form.Item>
                                        <Form.Item label="Strength Unit" {...formItemLayout}>
                                            {getFieldDecorator('strength_unit',{})
                                            (<Input/>)
                                        }
                                        </Form.Item>
                                        <Form.Item label="Instructions" {...formItemLayout}>
                                            {getFieldDecorator('instructions',{})
                                            (<TextArea/>)
                                        }
                                        </Form.Item>
                                    </div>
                                
                                :null}
                                {this.state.type == SUPPLIES ?<div>
                                        <Form.Item label="I prescribe this" {...formItemLayout}>
                                            {getFieldDecorator('perscribe_this', {})
                                                (<Checkbox></Checkbox>)
                                            }
                                        </Form.Item>

                                        <Form.Item label="Strength" {...formItemLayout}>
                                            {getFieldDecorator('strength',{})
                                            (<InputNumber />)
                                        }
                                        </Form.Item>
                                        <Form.Item label="Strength Unit" {...formItemLayout}>
                                            {getFieldDecorator('strength_unit',{})
                                            (<Input/>)
                                        }
                                        </Form.Item>
                                        <Form.Item label="Instructions" {...formItemLayout}>
                                            {getFieldDecorator('instructions',{})
                                            (<TextArea/>)
                                        }
                                        </Form.Item>
                                    </div>
                                :null}
                                {this.state.type == EQUIPMENT ? <div>
                                        <Form.Item label="I prescribe this" {...formItemLayout}>
                                            {getFieldDecorator('perscribe_this', {})
                                                (<Checkbox></Checkbox>)
                                            }
                                        </Form.Item>
                                        <Form.Item label="Instructions" {...formItemLayout}>
                                            {getFieldDecorator('instructions',{})
                                            (<TextArea/>)
                                        }
                                        </Form.Item>
                                    </div>

                                :null}

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