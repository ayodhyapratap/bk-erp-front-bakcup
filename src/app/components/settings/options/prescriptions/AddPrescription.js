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
import {DRUG_CATALOG, OFFERS} from "../../../../constants/api";
import {getAPI, displayMessage, deleteAPI, interpolate} from "../../../../utils/common";
import {Redirect} from 'react-router-dom'


class AddPrescription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            fields: [{
                label: "Name",
                key: "name",
                // initialValue: this.props.active_practiceId,
                required: true,
                type: INPUT_FIELD
            }, {
                label: "Dosage",
                key: "strength",
                required: true,
                type: INPUT_FIELD
            }, {
                label: "Instructions ",
                key: "instruction",
                required: true,
                type: INPUT_FIELD
            },]
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
        // const formProp={
        //   successFn:function(data){
        //     console.log(data);
        //     displayMessage(SUCCESS_MSG_TYPE, "success")
        //
        //   },
        //   errorFn:function(){
        //
        //   },
        //   action: interpolate(OFFERS,[this.props.active_practiceId]),
        //   method: "post",
        // }
        const formProp = {
            successFn: function (data) {
                console.log(data);
                displayMessage(SUCCESS_MSG_TYPE, "success")

            },
            errorFn: function () {

            },
            action: interpolate(DRUG_CATALOG, [this.props.active_practiceId]),
            method: "post",
        }
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div><Card>
            <TestFormLayout title="Add Prescriptions" formProp={formProp} changeRedirect={this.changeRedirect}
                            fields={this.state.fields}/>
            {this.state.redirect && <Redirect to='/settings/loyalty'/>}

        </Card>
        </div>
    }
}

export default AddPrescription;
