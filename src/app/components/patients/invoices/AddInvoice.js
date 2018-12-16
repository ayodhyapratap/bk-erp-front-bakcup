import React from "react";
import {Route} from "react-router";

import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {CHECKBOX_FIELD, DATE_PICKER,SINGLE_CHECKBOX_FIELD , NUMBER_FIELD,  SUCCESS_MSG_TYPE, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../constants/dataKeys";
import {
    PRESCRIPTIONS_API,
    DRUG_CATALOG,
    ALL_PRESCRIPTIONS_API,
    INVOICES_API,
    PROCEDURE_CATEGORY, TAXES
} from "../../../constants/api";
import {getAPI,interpolate, displayMessage} from "../../../utils/common";
import { Redirect } from 'react-router-dom'
import moment from 'moment';



class AddInvoice extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect:false,
            drug_catalog:this.props.drug_catalog?this.props.drug_catalog:null,
            procedure_category: this.props.procedure_category?this.props.procedure_category:null,
            taxes_list:this.props.taxes_list?this.props.taxes_list:null,
            editInvoice: this.props.editInvoice?this.props.editInvoice:null,

        }
        this.changeRedirect= this.changeRedirect.bind(this);
        this.loadDrugCatalog =this.loadDrugCatalog.bind(this);
        console.log("Working or not");

    }
    componentDidMount(){
        if(this.props.drug_catalog==null){
            this.loadDrugCatalog();
        }
        if(this.props.procedure_category==null){
            this.loadProcedureCategory()
        }
        if(this.props.taxes_list==null){
            this.loadTaxes();
        }

    }
    loadDrugCatalog(){
        let that = this;
        let successFn =function (data){
            that.setState({
                drug_catalog:data
            })

        }
        let errorFn = function (){

        }
        getAPI(interpolate(DRUG_CATALOG,[this.props.active_practiceId]), successFn, errorFn)
    }
    loadProcedureCategory(){
        let that = this;
        let successFn =function (data){
            that.setState({
                procedure_categry:data
            })

        }
        let errorFn = function (){

        }
        getAPI(interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]), successFn, errorFn);
    }

    loadTaxes(){
        var that = this;
        let successFn = function (data) {
            console.log("get table");
            that.setState({
                taxes_list:data,
            })
        };
        let errorFn = function () {
        };
        getAPI(interpolate( TAXES, [this.props.active_practiceId]), successFn, errorFn);

    }

    changeRedirect(){
        var redirectVar=this.state.redirect;
        this.setState({
            redirect:  !redirectVar,
        })  ;
    }

    render() {
        const drugOption=[]
        if(this.state.drug_catalog){
            this.state.drug_catalog.forEach(function(drug){
                drugOption.push({label:(drug.name+"("+drug.strength+")"), value:drug.id} );
            })
        }
        const procedureOption=[]
        if(this.state.procedure_category){
            this.state.procedure_category.forEach(function(drug){
                procedureOption.push({label:(drug.name), value:drug.id} );
            })
        } const taxesOption=[]
        if(this.state.taxes_list){
            this.state.taxes_list.forEach(function(drug){
                taxesOption.push({label:(drug.name+"("+drug.tax_value+")"), value:drug.id} );
            })
        }
        const  fields= [{
            label: "Drug",
            key: "drug",
            type: SELECT_FIELD,
            initialValue:this.state.editInvoice?this.state.editInvoice.drug:null,
            options: drugOption
        },{
            label: "Procedures",
            key: "procedure",
            type: SELECT_FIELD,
            initialValue:this.state.editInvoice?this.state.editInvoice.procedure:null,
            options: procedureOption
        },{
            label: "Taxes",
            key: "taxes",
            type: SELECT_FIELD,
            initialValue:this.state.editInvoice?this.state.editInvoice.tax:null,
            options: taxesOption,
            mode:"multiple"
        },{
            label: "Unit",
            key: "unit",
            initialValue:this.state.editInvoice?this.state.editInvoice.unit:null,
            type: INPUT_FIELD
        },{
            label: "cost",
            key: "cost",
            initialValue:this.state.editInvoice?this.state.editInvoice.cost:null,
            type: INPUT_FIELD
        },{
            label: "discount",
            key: "discount",
            initialValue:this.state.editInvoice?this.state.editInvoice.discount:null,
            type: INPUT_FIELD,
        },{
            label: "total",
            key: "total",
           initialValue:this.state.editInvoice?this.state.editInvoice.total:null,
            type: INPUT_FIELD,
        }, ];


        let editformProp;
        const TestFormLayout = Form.create()(DynamicFieldsForm);

        const formProp={
            successFn:function(data){
                displayMessage(SUCCESS_MSG_TYPE, "success")

                console.log(data);
            },
            errorFn:function(){

            },
            action:  interpolate(INVOICES_API, [this.props.match.params.id]),
            method: "post",
        }
        let defaultValues=[]
        if(this.state.editInvoice){
         defaultValues = [{"key":"id", "value":this.state.editInvoice.id}];
      }
        return <Row>
            <Card>
                <Route exact path='/patient/:id/billing/invoices/edit'
                      render={() => (this.state.editInvoice?<TestFormLayout defaultValues={defaultValues} title="Edit Invoive" changeRedirect= {this.changeRedirect} formProp= {formProp} fields={fields}/>: <Redirect to={'/patient/'+this.props.match.params.id+'/billing/invoices'} />)}/>
                <Route exact path='/patient/:id/billing/invoices/add'
                       render={() =><TestFormLayout title="Add Invoice" changeRedirect= {this.changeRedirect} formProp= {formProp} fields={fields}/>}/>


            </Card>
            {this.state.redirect&&    <Redirect to={'/patient/'+this.props.match.params.id+'/billing/invoices'} />}
        </Row>

    }
}

export default AddInvoice;
