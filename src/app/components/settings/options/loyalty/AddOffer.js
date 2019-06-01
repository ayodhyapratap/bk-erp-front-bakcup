import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form, Card, message} from "antd";
import {
    CHECKBOX_FIELD,
    SUCCESS_MSG_TYPE,
    INPUT_FIELD,
    RADIO_FIELD,
    NUMBER_FIELD,
    SELECT_FIELD
} from "../../../../constants/dataKeys";
import {OFFERS} from "../../../../constants/api";
import {getAPI, displayMessage, deleteAPI, interpolate} from "../../../../utils/common";
import {Redirect} from 'react-router-dom'


class AddOffer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            fields: [{
                label: "Offer Name ",
                key: "code",
                required: true,
                type: INPUT_FIELD
            }, {
                label: "Description ",
                key: "description",
                type: INPUT_FIELD
            }, {
                label: "Discount",
                key: "discount",
                required: true,
                type: NUMBER_FIELD,
                // follow:'%'
            }, {
                label: "Discount Unit",
                key: 'unit',
                required: true,
                options: [{label: 'Percent', value: '%'}, {label: 'Rupees', value: 'INR'}],
                type: SELECT_FIELD,
                initialValue: '%'
            }]
        }
        this.changeRedirect = this.changeRedirect.bind(this);

    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    render() {
        let that = this;
        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success")
                if (that.props.loadData)
                    that.props.loadData();

            },
            errorFn: function () {

            },
            action: interpolate(OFFERS, [this.props.active_practiceId]),
            method: "post",
            beforeSubmit: function (data) {
                console.log(data)
            }
        }
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
            <TestFormLayout formProp={formProp}
                            fields={this.state.fields} {...this.props}/>
            {this.state.redirect && <Redirect to='/settings/loyalty'/>}

        </div>
    }
}

export default AddOffer;
