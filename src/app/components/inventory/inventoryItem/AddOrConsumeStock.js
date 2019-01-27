import React from "react";
import AddInventoryForm from "./AddInventoryForm";
import {Card, Form, Row} from "antd";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {CHECKBOX_FIELD, INPUT_FIELD,SUCCESS_MSG_TYPE, NUMBER_FIELD, SELECT_FIELD} from "../../../constants/dataKeys";
import {STOCK_ENTRY} from "../../../constants/api";
import {INVENTORY_ITEM_TYPE} from "../../../constants/hardData";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import {Link, Redirect, Switch} from "react-router-dom";
import {Route} from "react-router";


export default class AddOrConsumeStock extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
          itemId:this.props.itemId,
          actionType: this.props.actionType
        };
        this.changeRedirect = this.changeRedirect.bind(this);

    }

    changeRedirect(){
        var redirectVar=this.state.redirect;
        this.setState({
            redirect:  !redirectVar,
        })  ;
    }

      render() {
        let that= this;
        let fields = [];
        const AddInventoryFormLayout = Form.create()(DynamicFieldsForm);


      const formProp={
          successFn:function(data){
              displayMessage(SUCCESS_MSG_TYPE, "success");
              that.props.showAddOrConsumeModal(false);
              console.log(data);
          },
          errorFn:function(){

          },
          action:  STOCK_ENTRY,
          method: "post",
      }
      let defaultAddValues = [{"key":"inventory_item", "value":this.state.itemId},{"key":"item_add_type", "value":this.state.actionType}];
      let defaultConsumeValues = [{"key":"inventory_item", "value":this.state.itemId},{"key":"item_type", "value":this.state.actionType}];
      if(this.state.actionType=="ADD"){
        fields = [ {
             label: 'Quantity',
             key: 'quantity',
             type: NUMBER_FIELD,
         },{
            label: 'Unit Cost',
            key: 'unit_cost',
            type: NUMBER_FIELD,
        },{
          label: 'Batch Number',
          key: 'batch_number',
          type: INPUT_FIELD,
      },{
        label: 'Total',
        key: 'total_cost',
        type: NUMBER_FIELD,
    },];
        return <Row>
            <Card>
              <AddInventoryFormLayout defaultValues={defaultAddValues} title="Add item Stock" changeRedirect= {this.changeRedirect} formProp= {formProp} fields={fields}/>
            </Card>
        </Row>
      }

      if(this.state.actionType=="CONSUME"){
        fields = [ {
             label: 'Quantity',
             key: 'quantity',
             type: NUMBER_FIELD,
         },{
          label: 'Batch Number',
          key: 'batch_number',
          type: INPUT_FIELD,
      },];
        return <Row>
            <Card>
              <AddInventoryFormLayout title="Consume Item Stock" defaultValues={defaultConsumeValues} changeRedirect= {this.changeRedirect} formProp= {formProp} fields={fields}/>
            </Card>
        </Row>
      }




    }
}
