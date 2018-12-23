import {Button, Card, Form, Icon, List, Row} from "antd";
import React from "react";
import {INPUT_FIELD, SELECT_FIELD, SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {displayMessage, interpolate} from "../../../utils/common";
import {INVOICES_API} from "../../../constants/api";
import {Route} from "react-router";
import {Redirect} from "react-router-dom";


export default class AddDisease extends React.Component {
    constructor(props) {
        super(props);
    }


    render(){
        const  fields= [{
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
        let defaultValues=[];
        if(this.state.editInvoice){
            defaultValues.push({"key":"id", "value":this.state.editInvoice.id});
        }
        return <Row>
            <Card>
                <Route exact path=''
                       render={() => (this.state.editInvoice?<TestFormLayout defaultValues={defaultValues} title="Edit Invoive" changeRedirect= {this.changeRedirect} formProp= {formProp} fields={fields}/>: <Redirect to={'/patient/'+this.props.match.params.id+'/billing/invoices'} />)}/>
                <Route exact path='/patient/:id/billing/invoices/add'
                       render={() =><TestFormLayout title="Add Invoice" changeRedirect= {this.changeRedirect} formProp= {formProp} fields={fields}/>}/>


            </Card>
            {this.state.redirect&&    <Redirect to={'web/disease'} />}
        </Row>

    }
}
