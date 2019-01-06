import React from "react";
import {Card, Row} from "antd";
import {Redirect, Route} from "react-router-dom";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form} from "antd/lib/index";
import {
    INPUT_FIELD,
    NUMBER_FIELD,
    SELECT_FIELD,
    SINGLE_CHECKBOX_FIELD,
    SUCCESS_MSG_TYPE, TEXT_FIELD
} from "../../../../constants/dataKeys";
import {displayMessage, interpolate} from "../../../../utils/common";
import {LABTEST_API, PATIENT_PAYMENTS_API} from "../../../../constants/api";

export default class AddorEditLab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            editFields: (this.props.editTest ? this.props.editTest : null)
        }
        this.changeRedirect = this.changeRedirect.bind(this);
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
            editFields: {},
        });
    }

    render() {
        let that = this;
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        const fields = [{
            label: "Test Name",
            key: "name",
            type: INPUT_FIELD,
            initialValue: (this.state.editFields ? this.state.editFields.name : null),
            required: true
        }, {
            label: "Cost",
            key: "cost",
            type: NUMBER_FIELD,
            initialValue: (this.state.editFields ? this.state.editFields.cost : null),
            required: true,
            follow:'INR',
            min:1
        }, {
            label: "Instructions",
            key: "instruction",
            initialValue: (this.state.editFields ? this.state.editFields.instruction : null),
            type: TEXT_FIELD,
        }];
        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success")
                that.props.loadData();
                console.log(data);
            },
            errorFn: function () {

            },
            action: interpolate(LABTEST_API, [that.props.active_practiceId]),
            method: "post",
        };
        let defaultValues = [];
        if (this.state.editFields)
            defaultValues.push({'key': 'id', 'value': this.state.editFields.id});
        return <Row>
            <Card>
                <Route exact path='/settings/labs/add'
                       render={() => <TestFormLayout title="Add Lab" changeRedirect={this.changeRedirect}
                                                     formProp={formProp} fields={fields}/>}/>
                <Route exact path='/settings/labs/edit'
                       render={() => (this.state.editFields ?
                           <TestFormLayout title="Add Lab" defaultValues={defaultValues}
                                           changeRedirect={this.changeRedirect}
                                           formProp={formProp} fields={fields}/> : <Redirect to={'/settings/labs'}/>)}/>
            </Card>
            {this.state.redirect && <Redirect to={'/settings/labs'}/>}
        </Row>
    }
}
