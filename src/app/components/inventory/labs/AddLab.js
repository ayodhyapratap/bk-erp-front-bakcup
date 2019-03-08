import {Button, Card, Form, Icon, List, Row} from "antd";
import React from "react";
import {
    DATE_PICKER, FILE_UPLOAD_FIELD,
    INPUT_FIELD,
    QUILL_TEXT_FIELD,
    SELECT_FIELD,
    SUCCESS_MSG_TYPE,
    TEXT_FIELD
} from "../../../constants/dataKeys";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {displayMessage, getAPI, interpolate} from "../../../utils/common";
import {
    BLOG_DISEASE,
    BLOG_POST, EXPENSE_TYPE, EXPENSES_API,
    INVOICES_API, LAB_API, PATIENTS_LIST, PAYMENT_MODES,
    PRACTICE,
    SINGLE_DISEASE, SINGLE_EXPENSES_API, SINGLE_LAB_API,
    SINGLE_PAGE_SEO,
    SINGLE_POST, SINGLE_VENDOR_API, VENDOR_API
} from "../../../constants/api";
import {Route} from "react-router";
import {Redirect} from "react-router-dom";


export default class AddLab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editData: this.props.editData ? this.props.editData : null
        }
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });

    }

    componentDidMount() {
        if (this.props.match.params.id) {
            if (!this.state.editData) {
                this.loadData();
            }
        }
        this.getPatientListData();


    }


    loadData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                editData: data,
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(SINGLE_EXPENSES_API, [this.props.match.params.id]), successFn, errorFn);


    }

    getPatientListData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                patientListData: data
            })
        };
        let errorFn = function () {

        };
        getAPI(PATIENTS_LIST, successFn, errorFn);
    }


    render() {

        const patientOptions = []
        if (this.state.patientListData && this.state.patientListData.length) {
            this.state.patientListData.forEach(function (drug) {
                patientOptions.push({label: (drug.name), value: drug.id});
            })
        }
        const fields = [{
            label: "Job number ",
            key: "job_no",
            initialValue: this.state.editData ? this.state.editData.job_no : null,
            type: INPUT_FIELD
        }, {
            label: "Doctor Name ",
            key: "job_no",
            initialValue: this.state.editData ? this.state.editData.doctor_name : null,
            type: INPUT_FIELD
        }, {
            label: "Name ",
            key: "name",
            initialValue: this.state.editData ? this.state.editData.name : null,
            type: INPUT_FIELD
        }, {
            label: "Status ",
            key: "status",
            initialValue: this.state.editData ? this.state.editData.status : null,
            type: INPUT_FIELD
        }, {
            label: "Due Date",
            key: "due_date",
            type: DATE_PICKER,
            initialValue: this.state.editData ? this.state.editData.due_date : null,
            format: "YYYY/MM/DD HH:mm"
        }, {
            label: "patient",
            key: "patient",
            type: SELECT_FIELD,
            initialValue: this.state.editData ? this.state.editData.patient : null,
            options: patientOptions
        },];


        let editformProp;
        if (this.state.editBlogData) {
            editformProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "success");
                    console.log(data);
                },
                errorFn: function () {

                },
                action: interpolate(SINGLE_LAB_API, [this.props.match.params.id]),
                method: "put",

            }
        }
        const TestFormLayout = Form.create()(DynamicFieldsForm);

        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success");

                console.log(data);
            },
            errorFn: function () {

            },
            action: LAB_API,
            method: "post",
        }
        const defaultValues = [{"key": "practice", "value": this.props.active_practiceId}];
        return <Row>
            <Card>
                <Route exact path='/inventory/lab/edit/:id'
                       render={() => (this.props.match.params.id ?
                           <TestFormLayout defaultValues={defaultValues} title="Edit Lab"
                                           changeRedirect={this.changeRedirect} formProp={editformProp}
                                           fields={fields}/> : <Redirect to={'/inventory/lab'}/>)}/>
                <Route exact path='/inventory/lab/add'
                       render={() => <TestFormLayout title="Add lab" changeRedirect={this.changeRedirect}
                                                     formProp={formProp} fields={fields}/>}/>


            </Card>
            {this.state.redirect && <Redirect to={'/inventory/lab'}/>}
        </Row>

    }
}
