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
import {
    PRESCRIPTIONS_API,
    DRUG_CATALOG,
    ALL_PRESCRIPTIONS_API,
    INVOICES_API,
    PROCEDURE_CATEGORY, TAXES, PATIENT_CLINIC_NOTES_API
} from "../../../constants/api";
import {getAPI, interpolate, displayMessage} from "../../../utils/common";
import {Redirect} from 'react-router-dom'
import moment from 'moment';


class AddClinicNotes extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
            drug_catalog: this.props.drug_catalog ? this.props.drug_catalog : null,
            procedure_category: this.props.procedure_category ? this.props.procedure_category : null,
            taxes_list: this.props.taxes_list ? this.props.taxes_list : null,
            editClinicNotes: this.props.editClinicNotes ? this.props.editClinicNotes : null,

        }
        this.changeRedirect = this.changeRedirect.bind(this);
        console.log("Working or not");

    }

    componentDidMount() {

    }

    loadDrugCatalog() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                drug_catalog: data
            })

        }
        let errorFn = function () {

        }
        getAPI(interpolate(DRUG_CATALOG, [this.props.active_practiceId]), successFn, errorFn)
    }

    loadProcedureCategory() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                procedure_category: data
            })

        }
        let errorFn = function () {

        }
        getAPI(interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]), successFn, errorFn);
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

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    render() {

        const fields = [{
            label: "Name",
            key: "name",
            initialValue: this.state.editClinicNotes ? this.state.editClinicNotes.name : null,
            type: INPUT_FIELD
        }, {
            label: "chief_complaints",
            key: "chief_complaints",
            initialValue: this.state.editClinicNotes ? this.state.editClinicNotes.chief_complaints : null,
            type: INPUT_FIELD
        }, {
            label: "investigations",
            key: "investigations",
            initialValue: this.state.editClinicNotes ? this.state.editClinicNotes.investigations : null,
            type: INPUT_FIELD,
        }, {
            label: "diagnosis",
            key: "diagnosis",
            initialValue: this.state.editClinicNotes ? this.state.editClinicNotes.diagnosis : null,
            type: INPUT_FIELD,
        }, {
            label: "notes",
            key: "notes",
            initialValue: this.state.editClinicNotes ? this.state.editClinicNotes.notes : null,
            type: INPUT_FIELD,
        }, {
            label: "observations",
            key: "observations",
            initialValue: this.state.editClinicNotes ? this.state.editClinicNotes.observations : null,
            type: INPUT_FIELD,
        }, {
            label: "Active",
            key: "is_active",
            type: SINGLE_CHECKBOX_FIELD,
            initialValue: this.state.editClinicNotes ? this.state.editClinicNotes.is_active : false,
        }];


        let editformProp;
        const TestFormLayout = Form.create()(DynamicFieldsForm);

        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success")

                console.log(data);
            },
            errorFn: function () {

            },
            action: interpolate(PATIENT_CLINIC_NOTES_API, [this.props.match.params.id]),
            method: "post",
        }
        let defaultValues = []
        if (this.state.editClinicNotes) {
            defaultValues = [{"key": "id", "value": this.state.editClinicNotes.id}];
        }
        return <Row>
            <Card>
                <Route exact path='/patient/:id/emr/clinicnotes/edit'
                       render={() => (this.state.editClinicNotes ?
                           <TestFormLayout defaultValues={defaultValues} title="Edit Clinic notes"
                                           changeRedirect={this.changeRedirect} formProp={formProp} fields={fields}/> :
                           <Redirect to={'/patient/' + this.props.match.params.id + '/billing/invoices'}/>)}/>
                <Route exact path='/patient/:id/emr/clinicnotes/add'
                       render={() => <TestFormLayout title="Add Clinic Notes" changeRedirect={this.changeRedirect}
                                                     formProp={formProp} fields={fields}/>}/>


            </Card>
            {this.state.redirect && <Redirect to={'/patient/' + this.props.match.params.id + '/emr/clinicnotes'}/>}
        </Row>

    }
}

export default AddClinicNotes;
