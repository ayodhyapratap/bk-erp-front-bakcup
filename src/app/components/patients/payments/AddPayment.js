import React from "react";
import {Route} from "react-router";

import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {CHECKBOX_FIELD, DATE_PICKER,SINGLE_CHECKBOX_FIELD , NUMBER_FIELD,  SUCCESS_MSG_TYPE, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../constants/dataKeys";
import {
    PRESCRIPTIONS_API,
    PATIENT_PAYMENTS_API,
    PAYMENT_MODES,
    INVOICES_API,
    PROCEDURE_CATEGORY, TAXES
} from "../../../constants/api";
import {getAPI,interpolate, displayMessage} from "../../../utils/common";
import { Redirect } from 'react-router-dom'
import moment from 'moment';



class AddPayment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect:false,
            invoices:this.props.invoices?this.props.invoices:null,
            paymentModes: this.props.paymentModes?this.props.paymentModes:null,
            editInvoice: this.props.editInvoice?this.props.editInvoice:null,

        }
        this.changeRedirect= this.changeRedirect.bind(this);
          console.log("Working or not");

    }
    componentDidMount(){

        if(this.props.invoices==null){
            this.loadInvoices()
        }
        if(this.props.paymentModes==null){
            this.loadPaymentModes();
        }

    }

    loadInvoices(){
        let that = this;
        let successFn =function (data){
            that.setState({
                invoices:data
            })
        }
        let errorFn = function (){

        }
        getAPI(interpolate(INVOICES_API, [this.props.match.params.id]), successFn, errorFn);
    }
    loadPaymentModes(){
      var that = this;
        let successFn = function (data) {
          console.log("get table");
          that.setState({
            paymentModes:data,
          })
        };
        let errorFn = function () {
        };
        getAPI(interpolate( PAYMENT_MODES, [this.props.active_practiceId]), successFn, errorFn);
    }

    changeRedirect(){
        var redirectVar=this.state.redirect;
        this.setState({
            redirect:  !redirectVar,
        })  ;
    }


    render() {
      const invoicesOption=[]
      if(this.state.invoices){
          this.state.invoices.forEach(function(drug){
              invoicesOption.push({label:(drug.id), value:drug.id} );
          })
      }
      const paymentModesOptions=[]
      if(this.state.paymentModes){
          this.state.paymentModes.forEach(function(drug){
              paymentModesOptions.push({label:(drug.mode), value:drug.id} );
          })
      }
        const  fields= [{
            label: "Invoice Id",
            key: "invoice",
            type: SELECT_FIELD,
            initialValue:this.state.editInvoice?this.state.editInvoice.invoice:null,
            options: invoicesOption
        },{
            label: "Amount",
            key: "amount",
            type: INPUT_FIELD,
            initialValue:this.state.editInvoice?this.state.editInvoice.invoice:null,
        },{
            label: "Payment Mode",
            key: "payment_mode",
            type: SELECT_FIELD,
            initialValue:this.state.editInvoice?this.state.editInvoice.payment_mode:null,
            options: paymentModesOptions
        },
        {
           label: "Advance",
           key: "is_advance",
           initialValue:this.state.editInvoice?this.state.editInvoice.is_advance:false,
           type: SINGLE_CHECKBOX_FIELD,
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
            action:  interpolate(PATIENT_PAYMENTS_API, [this.props.match.params.id]),
            method: "post",
        }
        let defaultValues=[{"key":"practice", "value":this.props.active_practiceId}];
        if(this.state.editInvoice){
         defaultValues.push({"key":"id", "value":this.state.editInvoice.id});
      }
        return <Row>
            <Card>
                <Route exact path='/patient/:id/billing/payments/edit'
                      render={() => (this.state.editInvoice?<TestFormLayout defaultValues={defaultValues} title="Edit payment" changeRedirect= {this.changeRedirect} formProp= {formProp} fields={fields}/>: <Redirect to={'/patient/'+this.props.match.params.id+'/billing/invoices'} />)}/>
                <Route exact path='/patient/:id/billing/payments/add'
                       render={() =><TestFormLayout title="Add payment" changeRedirect= {this.changeRedirect} formProp= {formProp} fields={fields}/>}/>


            </Card>
            {this.state.redirect&&    <Redirect to={'/patient/'+this.props.match.params.id+'/billing/payments'} />}
        </Row>

    }
}

export default AddPayment;
