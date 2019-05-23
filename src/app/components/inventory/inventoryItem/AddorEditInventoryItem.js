import React from "react";
import {Card, Form, Row} from "antd";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {CHECKBOX_FIELD, INPUT_FIELD, SUCCESS_MSG_TYPE, NUMBER_FIELD, SELECT_FIELD} from "../../../constants/dataKeys";
import {
    SINGLE_INVENTORY_ITEM_API,
    TAXES,
    MANUFACTURER_API,
    VENDOR_API,
    INVENTORY_ITEM_API,
    INVENTORY_API
} from "../../../constants/api";
import {INVENTORY_ITEM_TYPE} from "../../../constants/hardData";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import {Link, Redirect, Switch} from "react-router-dom";
import {Route} from "react-router";


export default class AddorEditInventoryItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editInventoryItem: this.props.editInventoryItem ? this.props.editInventoryItem : null,
            taxes_list: this.props.taxes_list ? this.props.taxes_list : null,
            manufacture_list: this.props.manufacture_list ? this.props.manufacture_list : null,
            vendor_list: this.props.vendor_list ? this.props.vendor_list : null,
            redirect: false,
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
            })
        }
        let errorFn = function () {

        }
        if (this.props.match.params.id)
            getAPI(interpolate(SINGLE_INVENTORY_ITEM_API, [this.props.match.params.id]), successFn, errorFn);

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


        const fields = [{
            label: 'Item Name',
            key: 'name',
            type: INPUT_FIELD,
            initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.name : null,
            required: true
        }, {
            label: 'Item Code',
            key: 'code',
            type: INPUT_FIELD,
            initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.code : null,
        }, {
            label: 'Manufacturer',
            key: 'manufacturer',
            type: SELECT_FIELD,
            options: manufacturerOption,
            initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.manufacturer : null,
        }, {
            label: 'Stocking Unit',
            key: 'stocking_unit',
            placeholder: 'Example: Bottles, Strips etc.',
            follow: '(Make sure this is the same as the unit in which you dispense this item.)',
            required: true,
            type: INPUT_FIELD,
            initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.stocking_unit : null,
        }, {
            label: 'Re-Order Level',
            key: 're_order_level',
            type: NUMBER_FIELD,
            initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.re_order_level : null,
        }, {
            label: 'Retail Price',
            key: 'retail_price',
            initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.retail_price : null,
            type: NUMBER_FIELD,
            min: 1,
            follow: 'INR'
        }, {
            label: 'Tax',
            key: 'taxes',
            type: CHECKBOX_FIELD,
            options: taxesOption,
            initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.taxes : null,
            mode: "multiple"
        }, {
            label: 'Item Type',
            key: 'item_type',
            type: SELECT_FIELD,
            required: true,
            options: INVENTORY_ITEM_TYPE,
            initialValue: this.state.editInventoryItem ? this.state.editInventoryItem.item_type : null,
        }];
        const AddInventoryFormLayout = Form.create()(DynamicFieldsForm);
        let editformProp;
        if (this.state.editInventoryItem) {
            editformProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "success");
                    console.log(data);
                },
                errorFn: function () {

                },
                action: interpolate(SINGLE_INVENTORY_ITEM_API, [this.props.match.params.id]),
                method: "put",
            }
        }

        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success");
                that.props.history.push('/inventory/edit-item-type/' + data.id);
            },
            errorFn: function () {

            },
            action: INVENTORY_ITEM_API,
            method: "post",
        }
        let defaultValues = [{key: 'practice', value: this.props.active_practiceId}];

        return <Row>
            <Card>
                <Route exact path='/inventory/edit/:id'
                       render={(route) => (this.props.match.params.id ?
                           <AddInventoryFormLayout defaultValues={defaultValues} title="Edit Post"
                                                   {...route}
                                                   changeRedirect={this.changeRedirect} formProp={editformProp}
                                                   fields={fields}/> : <Redirect to={'/web/blog'}/>)}/>
                <Route exact path='/inventory/add'
                       render={(route) => <AddInventoryFormLayout title="Add Inventory Item"
                                                                  {...route}
                                                                  changeRedirect={this.changeRedirect}
                                                                  formProp={formProp}
                                                                  fields={fields}/>}/>


            </Card>
            {this.state.redirect && <Redirect to={'/inventory'}/>}
        </Row>

    }
}
