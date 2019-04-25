import React from 'react';
import {Form, Row, Card} from "antd";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {INPUT_FIELD, NUMBER_FIELD, SUCCESS_MSG_TYPE, MULTI_SELECT_FIELD} from "../../../constants/dataKeys";
import {displayMessage, interpolate, getAPI} from "../../../utils/common";
import {Link,Redirect, Route, Switch} from "react-router-dom";
import {PRESCRIPTION_TEMPLATE, LABTEST_API, DRUG_CATALOG} from "../../../constants/api";
export default class PrescriptionTemplate extends React.Component {
	constructor(props){
		super(props);
		this.state={
			redirect: false,
			drugList: [],
            labList: [],
		}
		this.changeRedirect = this.changeRedirect.bind(this);
		this.loadDrug =this.loadDrug.bind(this);
		this.loadLab = this.loadLab.bind(this);
	}

	componentDidMount() {
        this.loadDrug();
        this.loadLab();
    }
	loadLab() {
        var that = this;
        let successFn = function (data) {
            that.setState({
                labList: data,
            })
        };
        let errorFn = function () {

        };
        getAPI(interpolate(LABTEST_API, [that.props.active_practiceId]), successFn, errorFn);
    }

    loadDrug() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                drugList: data
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(DRUG_CATALOG, [this.props.active_practiceId]), successFn, errorFn);
    }

	changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
            editFields: {},
        });
    }
	render(){ 
		let that =this;
		const TestFormLayout = Form.create()(DynamicFieldsForm);
        const fields = [{
            label: "Template Name",
            key: "name",
            type: INPUT_FIELD,
            // required: true
        },{
            label: "Schedule",
            key: "schedule",
            type: NUMBER_FIELD,
            // required: true
        },{
        	label:"Advice",
        	key: "advice_data",
        	type: INPUT_FIELD,
        },{
        	label: "Drugs",
        	key:"drug",
        	type:MULTI_SELECT_FIELD,
        	options: this.state.drugList.map(drug => ({label: drug.name, value: drug.id})),
        },{
        	label:"Labs",
        	key:"labs",
        	type:MULTI_SELECT_FIELD,
        	options: this.state.labList.map(lab => ({label: lab.name, value: lab.id})),
        }
        ];
        const formProp = {
            successFn: function (data) {
            	displayMessage(SUCCESS_MSG_TYPE, "success");
            	console.log("data",data);
            },
            errorFn: function () {

            },
            action: interpolate(PRESCRIPTION_TEMPLATE, [that.props.active_practiceId]),
            method: "post",
        };
        const defaultValues = [];
        if(this.props.currentPatient)
            defaultValues.push({key: 'practice', value: this.props.active_practiceId});
		return <Row>
            <Card>
                <Route exact path='/patient/:id/prescriptions/template/add'
                       render={() => <TestFormLayout title="Add Template" changeRedirect={this.changeRedirect}
                                                     formProp={formProp} fields={fields}/>}/>
               
            </Card>
            {this.state.redirect && <Redirect to={"/patient/"+ this.props.match.params.id + "/emr/prescriptions/add"}/>}
        </Row>
	}

}