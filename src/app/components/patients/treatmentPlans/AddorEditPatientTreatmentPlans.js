import React from "react";
import {Route} from "react-router";

import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {CHECKBOX_FIELD, DATE_PICKER,SINGLE_CHECKBOX_FIELD , NUMBER_FIELD,  SUCCESS_MSG_TYPE, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../constants/dataKeys";
import {TREATMENTPLANS_API,PROCEDURE_CATEGORY, ALL_TREATMENTPLANS_API} from "../../../constants/api";
import {getAPI,interpolate, displayMessage} from "../../../utils/common";
import { Redirect } from 'react-router-dom'
import moment from 'moment';



class AddorEditPatientTreatmentPlans extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          redirect:false,
          vitalSign:null,
          procedure_categry:this.props.procedure_categry?this.props.procedure_categry:null,

        }
        this.changeRedirect= this.changeRedirect.bind(this);
        this.loadDrugCatalog =this.loadDrugCatalog.bind(this);
        this.loadtreatmentPlans =this.loadtreatmentPlans.bind(this);
        console.log("Working or not");

    }
    componentDidMount(){
      this.loadDrugCatalog();
      if(this.props.match.params.treatmentPlansid){
      //  this.loadPrescription();
      }
    }
    loadDrugCatalog(){
      if(this.state.procedure_categry==null){
        let that = this;
        let successFn =function (data){
          that.setState({
            procedure_categry:data,

          })
        }
        let errorFn = function (){

        }
        getAPI(interpolate(PROCEDURE_CATEGORY,[this.props.active_practiceId]), successFn, errorFn)
      }
    }
    loadtreatmentPlans(){
      let that = this;
      let successFn =function (data){
        that.setState({
          edittreatmentPlans:data
        })
      }
      let errorFn = function (){

      }
      getAPI(interpolate(TREATMENTPLANS_API,[this.props.match.params.treatmentPlansid]), successFn, errorFn)
    }
      changeRedirect(){
        var redirectVar=this.state.redirect;
      this.setState({
        redirect:  !redirectVar,
      })  ;
      }

    render() {
      const drugOption=[]
      if(this.state.procedure_categry){
        this.state.procedure_categry.forEach(function(drug){
          drugOption.push({label:(drug.name), value:drug.id} );
        })
      }
      const  fields= [{
          label: "Procedure",
          key: "procedure",
          type: SELECT_FIELD,
          initialValue:this.state.edittreatmentPlans?this.state.edittreatmentPlans.drug:null,
          options: drugOption
      }, {
            label: "Quantity",
            key: "qunatity",
            required: true,
            initialValue:this.state.edittreatmentPlans?this.state.edittreatmentPlans.quantity:null,
            type: INPUT_FIELD
        },{
            label: "cost",
            key: "cost",
            initialValue:this.state.edittreatmentPlans?this.state.edittreatmentPlans.cost:null,
            type: INPUT_FIELD
        },{
            label: "total",
            key: "total",
            initialValue:this.state.edittreatmentPlans?this.state.edittreatmentPlans.total:null,
            type: INPUT_FIELD,
        }, {
            label: "active",
            key: "is_active",
            initialValue:this.state.edittreatmentPlans?this.state.edittreatmentPlans.is_active:false,
            type: SINGLE_CHECKBOX_FIELD,
        },  {
            label: "Completed",
            key: "is_completed",
            initialValue:this.state.edittreatmentPlans?this.state.edittreatmentPlans.is_completed:false,
            type: SINGLE_CHECKBOX_FIELD,
        }, ];


        let editformProp;
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        if(this.props.match.params.treatmentPlansid){
           editformProp={
            successFn:function(data){
              displayMessage(SUCCESS_MSG_TYPE, "success")

              console.log(data);
            },
            errorFn:function(){

            },
            action: interpolate(TREATMENTPLANS_API, [this.props.match.params.id]),
            method: "post",
          }
        }
          const formProp={
            successFn:function(data){
              displayMessage(SUCCESS_MSG_TYPE, "success")

              console.log(data);
            },
            errorFn:function(){

            },
            action:  interpolate(TREATMENTPLANS_API, [this.props.match.params.id]),
            method: "post",
          }


          const defaultValues = [{"key":"id", "value":[this.props.match.params.treatmentPlansid]}];
          return <Row>
                <Card>
                  <Route exact path='/patient/:id/emr/planss/:treatmentPlansid/edit'
                        render={() => ( <TestFormLayout defaultValues={defaultValues} title="Edit Treatment Plans" changeRedirect= {this.changeRedirect} formProp= {editformProp} fields={fields}/>)}/>
                  <Route exact path='/patient/:id/emr/plans/add'
                        render={() =><TestFormLayout title="Add Treatment Plans" changeRedirect= {this.changeRedirect} formProp= {formProp} fields={fields}/>}/>


                </Card>
                {this.state.redirect&&    <Redirect to={'/patient/'+this.props.match.params.id+'/emr/plans'} />}
            </Row>

    }
}

export default AddorEditPatientTreatmentPlans;
