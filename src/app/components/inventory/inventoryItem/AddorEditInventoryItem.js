import React from "react";
import AddInventoryForm from "./AddInventoryForm";
import {Card, Form} from "antd";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {CHECKBOX_FIELD, INPUT_FIELD, NUMBER_FIELD, SELECT_FIELD} from "../../../constants/dataKeys";
import {INVENTORY_ITEM_TYPE} from "../../../constants/hardData";

export default class AddorEditInventoryItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const fields = [{
            label: 'Item Name',
            key: 'name',
            type: INPUT_FIELD,
            required: true
        }, {
            label: 'Item Code',
            key: 'code',
            type: INPUT_FIELD
        }, {
            label: 'Manufacturer',
            key: 'manufacturer',
            type: SELECT_FIELD,
            options: []
        }, {
            label: 'Stocking Unit',
            key: 'stocking_unit',
            placeholder: 'Example: Bottles, Strips etc.',
            follow: '(Make sure this is the same as the unit in which you dispense this item.)',
            required: true,
            type: INPUT_FIELD
        }, {
            label: 'Re-Order Level',
            key: 're_order_level',
            type: INPUT_FIELD,
        }, {
            label: 'Retail Price',
            key: 'retail_price',
            type: NUMBER_FIELD,
            min: 1,
            follow: 'INR'
        }, {
            label: 'Tax',
            key: 'taxes',
            type: CHECKBOX_FIELD,
            options: []
        }, {
            label: 'Item Type',
            key: 'item_type',
            type: SELECT_FIELD,
            required: true,
            options: INVENTORY_ITEM_TYPE
        }];
        const AddInventoryFormLayout = Form.create()(DynamicFieldsForm)
        return <div>
            <Card>
                <AddInventoryFormLayout fields={fields}/>
            </Card>
        </div>
    }
}
