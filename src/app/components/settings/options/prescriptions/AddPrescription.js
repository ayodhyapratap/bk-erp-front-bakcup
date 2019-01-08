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
import {DRUG_CATALOG, DRUG_TYPE_API, OFFERS, SINGLE_DRUG_CATALOG} from "../../../../constants/api";
import {getAPI, displayMessage, deleteAPI, interpolate} from "../../../../utils/common";
import {Redirect, Route} from 'react-router-dom'


class AddPrescription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            editPrescreption: this.props.editCatalog ? this.props.editCatalog : null,
            drugType: []

        }
        this.changeRedirect = this.changeRedirect.bind(this);
        this.setFormParams = this.setFormParams.bind(this);
    }

    componentWillMount() {
        this.loadDrugType();
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

    loadDrugType() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                drugType: data
            })
        }
        let errorFn = function () {
        }
        getAPI(DRUG_TYPE_API, successFn, errorFn);
    }

    setFormParams(type, value) {
        this.setState({
            [type]: value
        })
    }

    render() {
        let that = this;
        let drugTypeField = (this.state.drugType && this.state.drugType == INPUT_FIELD ?
            {
                label: "Drug Type",
                key: "drug_type_extra",
                required: true,
                initialValue: this.state.editPrescreption ? this.state.editPrescreption.drug_type : null,
                type: INPUT_FIELD,
                follow: <a onClick={() => that.setFormParams('drugType', SELECT_FIELD)}>Choose Drug Type</a>
            } : {
                label: "Drug Type",
                key: "drug_type",
                required: true,
                initialValue: this.state.editPrescreption ? this.state.editPrescreption.drug_type : null,
                type: SELECT_FIELD,
                options: [],
                follow: <a onClick={() => that.setFormParams('drugType', INPUT_FIELD)}>Add New Drug Type</a>
            });
        let drugUnitField = (this.state.drugUnit && this.state.drugUnit == INPUT_FIELD ?
            {
                label: "Dosage Unit",
                key: "unit_type_extra",
                required: true,
                initialValue: this.state.editPrescreption ? this.state.editPrescreption.unit : null,
                type: INPUT_FIELD,
                follow: <a onClick={() => that.setFormParams('drugUnit', SELECT_FIELD)}>Choose Drug Type</a>
            } : {
                label: "Dosage Unit",
                key: "unit",
                required: true,
                initialValue: this.state.editPrescreption ? this.state.editPrescreption.unit : null,
                type: SELECT_FIELD,
                options: [],
                follow: <a onClick={() => that.setFormParams('drugUnit', INPUT_FIELD)}>Add New Drug Type</a>
            });
        const fields = [{
            label: "Name",
            key: "name",
            initialValue: this.state.editPrescreption ? this.state.editPrescreption.name : null,
            required: true,
            type: INPUT_FIELD
        }, drugTypeField, {
            label: "Dosage",
            key: "strength",
            required: true,
            initialValue: this.state.editPrescreption ? this.state.editPrescreption.strength : null,
            type: NUMBER_FIELD
        }, drugUnitField, {
            label: "Instructions ",
            key: "instruction",
            required: true,
            initialValue: this.state.editPrescreption ? this.state.editPrescreption.instruction : null,
            type: INPUT_FIELD
        },];
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
