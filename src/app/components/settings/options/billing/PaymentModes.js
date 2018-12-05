import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Modal, Card, Form, Icon, Row, Table, Divider} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, NUMBER_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {PAYMENT_MODES} from "../../../../constants/api"
import {Link} from "react-router-dom";
import {getAPI, interpolate} from "../../../../utils/common";

class TaxCatalog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          redirect: false,
          visible: false,
          modes:null,
        }
    }
    componentDidMount() {
      var that = this;
        let successFn = function (data) {
          console.log("get table");
          that.setState({
            modes:data,
          })
        };
        let errorFn = function () {
        };
        getAPI(interpolate( PAYMENT_MODES, [2]), successFn, errorFn);
      }
    changeRedirect(){
      var redirectVar=this.state.redirect;
    this.setState({
      redirect:  !redirectVar,
    })  ;
    }
    editPayment(value){
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
            title: 'Mode Of Payment',
            dataIndex: 'mode',
            key: 'mode',
          }, {
            title: 'payment type',
            dataIndex: 'payment_type',
            key: 'payment_type',
          },{
            title: 'Fees',
            dataIndex: 'fee',
            key: 'fee',
          },{
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <span>
              <a onClick={()=>this.editPayment(record.id)}>  Edit</a>
                <Divider type="vertical" />
              </span>
            ),
          }];
      const   fields= [{
            label: "Mode of payment",
            key: "mode",
            required: true,
            type: INPUT_FIELD
        },{
            label: "Payment Type",
            key: "payment_type",
            follow: "INR",
            required: true,
            type: NUMBER_FIELD
      },{
            label: "Vendor Fee",
            key: "fee",
            required: true,
            type: INPUT_FIELD
        },];
      const   editfields= [{
            label: "id",
            key: "id",
            required: true,
            initialValue: this.state.editingId,
            type: NUMBER_FIELD
        },
        {
              label: "Mode of payment",
              key: "mode",
              required: true,
              type: INPUT_FIELD
          },{
              label: "Payment Type",
              key: "payment_type",
              follow: "INR",
              required: true,
              type: NUMBER_FIELD
        },{
              label: "Vendor Fee",
              key: "fee",
              required: true,
              type: INPUT_FIELD
          },];
      const formProp={
        successFn:function(data){

          console.log(data);
          console.log("sucess");
        },
        errorFn:function(){

        },
        action: interpolate(PAYMENT_MODES,[2]),
        method: "post",
      }
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
            <TestFormLayout formProp={formProp}  fields={fields}/>
            <Divider/>
            <Table columns={columns}  dataSource={this.state.modes}/>
            <Modal
             title="Basic Modal"
             visible={this.state.visible}
             footer={null}
             >
              <TestFormLayout formProp={formProp}  fields={editfields}/>
              <Button key="back" onClick={this.handleCancel}>Return</Button>,
           </Modal>
        </div>
    }
}

export default TaxCatalog;
