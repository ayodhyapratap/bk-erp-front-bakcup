import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Modal, Card, Form, Icon, Row, Table, Divider} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, NUMBER_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {TAXES} from "../../../../constants/api"
import {Link} from "react-router-dom";
import {getAPI, interpolate} from "../../../../utils/common";

class TaxCatalog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          redirect: false,
          visible: false,
        }
    }

    changeRedirect(){
      var redirectVar=this.state.redirect;
    this.setState({
      redirect:  !redirectVar,
    })  ;
    }
    editTax(value){
      this.setState({
        editingId:value,
        visible: true,
      })
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }


    render() {
      const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: 'tax value',
            dataIndex: 'tax_value',
            key: 'tax_value',
          },{
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <span>
              <a onClick={()=>this.editTax(record.id)}>  Edit</a>
                <Divider type="vertical" />
              </span>
            ),
          }];
      const   fields= [{
            label: "Tax name",
            key: "name",
            required: true,
            type: INPUT_FIELD
        },{
            label: "Tax Value",
            key: "tax_value",
            follow: "INR",
            required: true,
            type: NUMBER_FIELD
      },];
      const   editfields= [{
            label: "id",
            key: "id",
            required: true,
            initialValue: this.state.editingId,
            type: NUMBER_FIELD
        },
        {
              label: "Tax name",
              key: "name",
              required: true,
              type: INPUT_FIELD
          },{
            label: "Tax Value",
            key: "tax_value",
            follow: "INR",
            required: true,
            type: NUMBER_FIELD
      },];
      const formProp={
        successFn:function(data){

          console.log(data);
          console.log("sucess");
        },
        errorFn:function(){

        },
        action: interpolate(TAXES,[this.props.active_practiceId]),
        method: "post",
      }
      const defaultValues = [{"key":"practice", "value":this.props.active_practiceId}]
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
            <TestFormLayout defaultValues={defaultValues} formProp={formProp}  fields={fields}/>
            <Divider/>
            <Table columns={columns}  dataSource={this.props.taxes}/>
            <Modal
             title="Basic Modal"
             visible={this.state.visible}
             footer={null}
             >
              <TestFormLayout defaultValues={defaultValues} formProp={formProp}  fields={editfields}/>
              <Button key="back" onClick={this.handleCancel}>Return</Button>,

           </Modal>
        </div>
    }
}

export default TaxCatalog;
