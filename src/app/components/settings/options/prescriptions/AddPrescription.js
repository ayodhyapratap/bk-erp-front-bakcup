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
import {DRUG_CATALOG, OFFERS, SINGLE_DRUG_CATALOG} from "../../../../constants/api";
import {getAPI, displayMessage, deleteAPI, interpolate} from "../../../../utils/common";
import {Redirect, Route} from 'react-router-dom'


class AddPrescription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            editPrescreption: this.props.editCatalog ? this.props.editCatalog : null


        }
        this.changeRedirect = this.changeRedirect.bind(this);

    }

    componentWillMount() {
        let that = this;
        if (this.props.match.params.drugId) {
            let successFn = function (data) {
                that.setState({
                    editPrescreption: data
                })
            };
            let errorFn = function () {
            };
            getAPI(interpolate(SINGLE_DRUG_CATALOG, [this.props.active_practiceId, this.props.match.params.drugId]), successFn, errorFn);
        }
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    render() {
        let that = this;
        const fields = [{
            label: "Name",
            key: "name",
            initialValue: this.state.editPrescreption ? this.state.editPrescreption.name : null,
            required: true,
            type: INPUT_FIELD
        }, {
            label: "Dosage",
            key: "strength",
            required: true,
            initialValue: this.state.editPrescreption ? this.state.editPrescreption.strength : null,
            type: NUMBER_FIELD
        }, {
            label: "Instructions ",
            key: "instruction",
            required: true,
            initialValue: this.state.editPrescreption ? this.state.editPrescreption.instruction : null,
            type: INPUT_FIELD
        },]
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
                that.props.loadData();

            },
            errorFn: function () {

            },
            action: interpolate(DRUG_CATALOG, [this.props.active_practiceId]),
            method: "post",
        }
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        let defaultValues = []
        if (this.state.editPrescreption) {
            defaultValues.push({key: 'id', value: this.state.editPrescreption.id})
        }
        return <div>
            <Card>
                <Route exact path="/settings/prescriptions/add"
                       render={() => <TestFormLayout title="Add Prescriptions" formProp={formProp}
                                                     changeRedirect={this.changeRedirect}
                                                     fields={fields}/>}/>
                <Route exact path="/settings/prescriptions/edit"
                       render={(route) => this.state.editPrescreption ?
                           <TestFormLayout title="Add Prescriptions"
                                           defaultValues={defaultValues} formProp={formProp}
                                           changeRedirect={this.changeRedirect}
                                           fields={fields}/> : null}/>

                {this.state.redirect && <Redirect to='/settings/prescriptions'/>}

            </Card>
        </div>
    }
}

export default AddPrescription;
