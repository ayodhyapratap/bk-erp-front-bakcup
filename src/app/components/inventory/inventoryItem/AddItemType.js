import React from "react";
import {Card, Form, Row} from "antd";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {
    CHECKBOX_FIELD,
    INPUT_FIELD,
    SUCCESS_MSG_TYPE,
    NUMBER_FIELD,
    SELECT_FIELD,
    SINGLE_CHECKBOX_FIELD, TEXT_FIELD
} from "../../../constants/dataKeys";
import {
    SINGLE_INVENTORY_ITEM_API,
    INVENTORY_ITEM_API,
    INVENTORY_API,
    ITEM_TYPE_STOCK,
    SINGLE_ITEM_TYPE_STOCK,
    DRUG_TYPE_API
} from "../../../constants/api";
import {INVENTORY_ITEM_TYPE, DRUG, SUPPLIES, EQUIPMENT} from "../../../constants/hardData";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import {Link, Redirect, Switch} from "react-router-dom";
import {Route} from "react-router";


export default class AddItemType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editInventoryItemType: this.props.editInventoryItemType ? this.props.editInventoryItemType : null,
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
        if (!this.state.editInventoryItemType) {
            this.loadData();
        }
        this.loadInventoryItemData();
        this.loadDrugType();
    }


    loadInventoryItemData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                inventory_item: data,
                item_type: data.item_type,
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(SINGLE_INVENTORY_ITEM_API, [this.props.match.params.id]), successFn, errorFn);
    }

    loadDrugType() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                drug_type: data,
            })
        }
        let errorFn = function () {

        }
        getAPI(DRUG_TYPE_API, successFn, errorFn);
    }

    loadData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                editInventoryItemType: data,
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(SINGLE_ITEM_TYPE_STOCK, [this.props.match.params.id]), successFn, errorFn);


    }


    render() {
        const drugOption = []
        if (this.state.drug_type) {
            this.state.drug_type.forEach(function (drug) {
                drugOption.push({label: drug.name, value: drug.id});
            })
        }

        let fields = [];
        const AddInventoryFormLayout = Form.create()(DynamicFieldsForm);
        let editformProp;
        if (this.state.editInventoryItemType) {
            editformProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "success");
                    console.log(data);
                },
                errorFn: function () {

                },
                action: interpolate(SINGLE_ITEM_TYPE_STOCK, [this.props.match.params.id]),
                method: "put",
            }
        }

        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success");

                console.log(data);
            },
            errorFn: function () {

            },
            action: ITEM_TYPE_STOCK,
            method: "post",
        }
        let defaultValues = [{"key": "inventory_item", "value": this.props.match.params.id}, {
            "key": "item_type",
            "value": this.state.item_type
        }];

        if (this.state.item_type == DRUG) {
            fields = [{
                label:"I prescribe this",
                key: "perscribe_this",
                type: SINGLE_CHECKBOX_FIELD,
                initialValue: this.state.editInventoryItemType ? this.state.editInventoryItemType.perscribe_this : null,
                // follow: "I prescribe this"
            },{
                label: 'Drug Type',
                key: 'drug_type',
                type: SELECT_FIELD,
                options: drugOption,
                initialValue: this.state.editInventoryItemType ? this.state.editInventoryItemType.drug_type : null,
            }, {
                label: 'Strength',
                key: 'strength',
                initialValue: this.state.editInventoryItemType ? this.state.editInventoryItemType.strength : null,
                type: NUMBER_FIELD,
            }, {
                label: 'stength_unit',
                key: 'stength_unit',
                type: INPUT_FIELD,
                initialValue: this.state.editInventoryItemType ? this.state.editInventoryItemType.stength_unit : null,
            }, {
                label: 'Instructions',
                key: 'instructions',
                type: TEXT_FIELD,
                initialValue: this.state.editInventoryItemType ? this.state.editInventoryItemType.instructions : null,
            },]
        }
        if (this.state.item_type == EQUIPMENT) {
            fields = [{
                label:"I prescribe this",
                key: "perscribe_this",
                type: SINGLE_CHECKBOX_FIELD,
                initialValue: this.state.editInventoryItemType ? this.state.editInventoryItemType.perscribe_this : null,
                // follow: "I prescribe this"
            }, {
                label: 'Instructions',
                key: 'instructions',
                type: TEXT_FIELD,
                initialValue: this.state.editInventoryItemType ? this.state.editInventoryItemType.instructions : null,
            },]
        }
        if (this.state.item_type == SUPPLIES) {
            fields = [{
                key: "perscribe_this",
                type: SINGLE_CHECKBOX_FIELD,
                initialValue: this.state.editInventoryItemType ? this.state.editInventoryItemType.perscribe_this : null,
                label: "I prescribe this"
            }, {
                label: 'Strength',
                key: 'strength',
                initialValue: this.state.editInventoryItemType ? this.state.editInventoryItemType.strength : null,
                type: NUMBER_FIELD,
            }, {
                label: 'Strength Unit',
                key: 'stength_unit',
                type: INPUT_FIELD,
                initialValue: this.state.editInventoryItemType ? this.state.editInventoryItemType.stength_unit : null,
            }, {
                label: 'Instructions',
                key: 'instructions',
                type: TEXT_FIELD,
                initialValue: this.state.editInventoryItemType ? this.state.editInventoryItemType.instructions : null,
            },]
        }


        if (this.state.editInventoryItemType != null) {
            return <Row>
                <Card>
                    <AddInventoryFormLayout defaultValues={defaultValues} title="Edit Inventory Item type"
                                            changeRedirect={this.changeRedirect} formProp={editformProp}
                                            fields={fields}/>
                </Card>
                {this.state.redirect && <Redirect to={'/inventory'}/>}
            </Row>
        } else {
            return <Row>
                <Card>
                    <AddInventoryFormLayout title="Add Inventory Item type" defaultValues={defaultValues}
                                            changeRedirect={this.changeRedirect} formProp={formProp} fields={fields}/>
                </Card>
                {this.state.redirect && <Redirect to={'/inventory'}/>}
            </Row>
        }


    }
}
