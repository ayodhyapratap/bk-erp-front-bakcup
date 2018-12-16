import React from "react";
import {Route} from "react-router";

import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {CHECKBOX_FIELD, DATE_PICKER,SINGLE_CHECKBOX_FIELD , NUMBER_FIELD,  SUCCESS_MSG_TYPE, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../constants/dataKeys";
import {PRESCRIPTIONS_API,DRUG_CATALOG, ALL_PRESCRIPTIONS_API} from "../../../constants/api";
import {getAPI,interpolate, displayMessage} from "../../../utils/common";
import { Redirect } from 'react-router-dom'
import moment from 'moment';



class AddorEditPatientPrescriptions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          redirect:false,
          vitalSign:null,
          drug_catalog:this.props.drug_catalog?this.props.drug_catalog:null,

        }
        this.changeRedirect= this.changeRedirect.bind(this);
        this.loadDrugCatalog =this.loadDrugCatalog.bind(this);
        this.loadPrescription =this.loadPrescription.bind(this);
        console.log("Working or not");

    }
    componentDidMount(){
      this.loadDrugCatalog();
      if(this.props.match.params.prescriptionid){
        this.loadPrescription();
      }
    }
    loadDrugCatalog(){
      if(this.state.drug_catalog==null){
        let that = this;
        let successFn =function (data){
          that.setState({
            drug_catalog:data,

          })
        }
        let errorFn = function (){

        }
        getAPI(interpolate(DRUG_CATALOG,[this.props.active_practiceId]), successFn, errorFn)
      }
    }
    loadPrescription(){
      let that = this;
      let successFn =function (data){
        that.setState({
          editPrescription:data
        })
      }
      let errorFn = function (){

      }
      getAPI(interpolate(ALL_PRESCRIPTIONS_API,[this.props.match.params.prescriptionid]), successFn, errorFn)
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
      const  fields= [{
          label: "Drug",
          key: "drug",
          type: SELECT_FIELD,
          initialValue:this.state.editPrescription?this.state.editPrescription.drug:null,
          options: drugOption
      }, {
            label: "Quantity",
            key: "qunatity",
            required: true,
            initialValue:this.state.editPrescription?this.state.editPrescription.quantity:null,
            type: INPUT_FIELD
        },{
            label: "cost",
            key: "cost",
            initialValue:this.state.editPrescription?this.state.editPrescription.cost:null,
            type: INPUT_FIELD
        },{
            label: "total",
            key: "total",
            initialValue:this.state.editPrescription?this.state.editPrescription.total:null,
            type: INPUT_FIELD,
        }, {
            label: "active",
            key: "is_active",
            initialValue:this.state.editPrescription?this.state.editPrescription.is_active:false,
            type: SINGLE_CHECKBOX_FIELD,
        },  {
            label: "Completed",
            key: "is_completed",
            initialValue:this.state.editPrescription?this.state.editPrescription.is_completed:false,
            type: SINGLE_CHECKBOX_FIELD,
        }, ];


        let editformProp;
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        if(this.props.match.params.prescriptionid){
           editformProp={
            successFn:function(data){
              displayMessage(SUCCESS_MSG_TYPE, "success")

              console.log(data);
            },
            errorFn:function(){

            },
            action: interpolate(PRESCRIPTIONS_API, [this.props.match.params.id]),
            method: "put",
          }
        }
          const formProp={
            successFn:function(data){
              displayMessage(SUCCESS_MSG_TYPE, "success")

              console.log(data);
            },
            errorFn:function(){

            },
            action:  interpolate(PRESCRIPTIONS_API, [this.props.match.params.id]),
            method: "post",
          }


          const defaultValues = [{"key":"id", "value":[this.props.match.params.prescriptionid]}];
          return <Row>
                <Card>
                  <Route exact path='/patient/:id/emr/prescriptions/:prescriptionid/edit'
                        render={() => ( <TestFormLayout defaultValues={defaultValues} title="Edit vital sign" changeRedirect= {this.changeRedirect} formProp= {editformProp} fields={fields}/>)}/>
                  <Route exact path='/patient/:id/emr/prescriptions/add'
                        render={() =><TestFormLayout title="Add vital sign" changeRedirect= {this.changeRedirect} formProp= {formProp} fields={fields}/>}/>


                </Card>
                {this.state.redirect&&    <Redirect to={'/patient/'+this.props.match.params.id+'/emr/prescriptions'} />}
            </Row>

    }
}

export default AddorEditPatientPrescriptions;
