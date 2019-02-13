import React from "react";
import {Route} from "react-router";

import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {
    CHECKBOX_FIELD,
    DATE_PICKER,
    SINGLE_CHECKBOX_FIELD,
    NUMBER_FIELD,
    SUCCESS_MSG_TYPE,
    INPUT_FIELD,
    RADIO_FIELD,
    SELECT_FIELD
} from "../../../constants/dataKeys";
import {TREATMENTPLANS_API, PROCEDURE_CATEGORY, ALL_TREATMENTPLANS_API, PRODUCT_MARGIN} from "../../../constants/api";
import {getAPI, interpolate, displayMessage} from "../../../utils/common";
import {Redirect} from 'react-router-dom'
import moment from 'moment';


class AddorEditPatientTreatmentPlans extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
            vitalSign: null,
            procedure_category: this.props.procedure_category ? this.props.procedure_category : null,
            editTreatmentPlan: this.props.editTreatmentPlan ? this.props.editTreatmentPlan : null,

        }
        this.changeRedirect = this.changeRedirect.bind(this);
        this.loadDrugCatalog = this.loadDrugCatalog.bind(this);

    }

    componentDidMount() {
        this.loadProductMargin();
        this.loadDrugCatalog();

    }

    loadProductMargin() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                productMargin: data
            })
        }
        let errorFn = function () {

        }
        getAPI(PRODUCT_MARGIN, successFn, errorFn);
    }

    loadDrugCatalog() {
        if (this.state.procedure_category == null) {
            let that = this;
            let successFn = function (data) {
                that.setState({
                    procedure_category: data,

                })
            }
            let errorFn = function () {

            }
            getAPI(interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]), successFn, errorFn)
        }
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    render() {
        const drugOption = []
        if (this.state.procedure_category) {
            this.state.procedure_category.forEach(function (drug) {
                drugOption.push({label: (drug.name), value: drug.id});
            })
        }
        const fields = [{
            label: "Procedure",
            key: "procedure",
            type: SELECT_FIELD,
            initialValue: this.state.editTreatmentPlan ? this.state.editTreatmentPlan.procedure : null,
            options: drugOption
        }, {
            label: "Quantity",
            key: "qunatity",
            required: true,
            initialValue: this.state.editTreatmentPlan ? this.state.editTreatmentPlan.qunatity : null,
            type: INPUT_FIELD
        }, {
            label: "cost",
            key: "cost",
            initialValue: this.state.editTreatmentPlan ? this.state.editTreatmentPlan.cost : null,
            type: INPUT_FIELD
        }, {
            label: 'MLM Margin Type',
            type: SELECT_FIELD,
            initialValue: (this.state.editFields ? this.state.editFields.margin : null),
            key: 'margin',
            required: true,
            options: this.state.productMargin.map(margin => ({label: margin.name, value: margin.id}))
        }, {
            label: "total",
            key: "total",
            initialValue: this.state.editTreatmentPlan ? this.state.editTreatmentPlan.total : null,
            type: INPUT_FIELD,
        }, {
            label: "active",
            key: "is_active",
            initialValue: this.state.editTreatmentPlan ? this.state.editTreatmentPlan.is_active : false,
            type: SINGLE_CHECKBOX_FIELD,
        }, {
            label: "Completed",
            key: "is_completed",
            initialValue: this.state.editTreatmentPlan ? this.state.editTreatmentPlan.is_completed : false,
            type: SINGLE_CHECKBOX_FIELD,
        },];


        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success")

                console.log(data);
            },
            errorFn: function () {

            },
            action: interpolate(TREATMENTPLANS_API, [this.props.match.params.id]),
            method: "post",
        }

        const TestFormLayout = Form.create()(DynamicFieldsForm);

        let defaultValues = [{"key": "practice", "value": this.props.active_practiceId}];
        if (this.state.editTreatmentPlan)
            defaultValues.push({"key": "id", "value": this.props.editTreatmentPlan.id});
        return <Row>
            <Card>
                <Route exact path='/patient/:id/emr/plans/edit'
                       render={() => (this.state.editTreatmentPlan ?
                           <TestFormLayout defaultValues={defaultValues} title="Edit Invoive"
                                           changeRedirect={this.changeRedirect} formProp={formProp} fields={fields}/> :
                           <Redirect to={'/patient/' + this.props.match.params.id + '/emr/plans'}/>)}/>
                <Route exact path='/patient/:id/emr/plans/add'
                       render={() => <TestFormLayout title="Add Treatment Plans" changeRedirect={this.changeRedirect}
                                                     formProp={formProp} fields={fields}/>}/>


            </Card>
            {this.state.redirect && <Redirect to={'/patient/' + this.props.match.params.id + '/emr/plans'}/>}
        </Row>

    }
}

export default AddorEditPatientTreatmentPlans;
