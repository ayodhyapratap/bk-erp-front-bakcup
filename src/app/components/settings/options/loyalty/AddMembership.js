import React from "react";
import {Form, Row} from 'antd';
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {INPUT_FIELD, NUMBER_FIELD, SUCCESS_MSG_TYPE} from "../../../../constants/dataKeys";
import {MEMBERSHIP_API, OFFERS} from "../../../../constants/api";
import {displayMessage, interpolate} from "../../../../utils/common";

export default class AddMembership extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const fields = [{
            label: "Membership Name ",
            key: "name",
            required: true,
            type: INPUT_FIELD
        }, {
            label: "Fee",
            key: "fee",
            required: true,
            type: NUMBER_FIELD,
            follow: 'INR'
        }, {
            label: "Benefit",
            key: "benefit",
            required: true,
            type: NUMBER_FIELD,
            follow: '%'
        }, {
            label: "Validity",
            key: 'validity',
            required: true,
            type: NUMBER_FIELD,
            follow: 'Months',

        }];
        let that = this;
        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success")
                if (that.props.loadData)
                    that.props.loadData();

            },
            errorFn: function () {

            },
            action: interpolate(MEMBERSHIP_API, [this.props.active_practiceId]),
            method: "post",
        };
        const formDefaultValues = [{"key": "practice", "value": this.state.active_practiceId}];
        const AddForm = Form.create()(DynamicFieldsForm);
        return <Row>
            <AddForm fields={fields} formProp={formProp} defaultValues={formDefaultValues} {...this.props}/>
        </Row>
    }
}
