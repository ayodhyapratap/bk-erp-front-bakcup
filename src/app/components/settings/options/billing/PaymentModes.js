import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Modal, Card, Form, Icon, Row, Table, Divider} from "antd";
import {CHECKBOX_FIELD, SUCCESS_MSG_TYPE, INPUT_FIELD, RADIO_FIELD, NUMBER_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {PAYMENT_MODES} from "../../../../constants/api"
import {Link} from "react-router-dom";
import {getAPI, displayMessage, interpolate} from "../../../../utils/common";

class PaymentModes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          redirect: false,
          visible: false,
          modes:null,
        }
        this.loadData= this.loadData.bind(this);
    }
    componentDidMount() {
      this.loadData();
        }
    loadData(){
      var that = this;
        let successFn = function (data) {
          console.log("get table");
          that.setState({
            modes:data,
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
    editPayment(value){
      this.setState({
        editingId:value.id,
        editingmode:value.mode,
        editingType:value.payment_type,
        editingFee:value.fee,
        visible: true,
      })
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }


    render() {
      let that =this;
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
              <a onClick={()=>this.editPayment(record)}>  Edit</a>
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
              label: "Mode of payment",
              key: "mode",
              required: true,
              initialValue:this.state.editingmode,
              type: INPUT_FIELD
          },{
              label: "Payment Type",
              key: "payment_type",
              follow: "INR",
              required: true,
              initialValue:this.state.editingType,
              type: NUMBER_FIELD
        },{
              label: "Vendor Fee",
              key: "fee",
              required: true,
              initialValue:this.state.editingFee,
              type: INPUT_FIELD
          },];
      const formProp={
        successFn:function(data){
          that.handleCancel();
          that.loadData();
          console.log(data);
          console.log("sucess");
          displayMessage(SUCCESS_MSG_TYPE, "sucess")
        },
        errorFn:function(){

        },
        action: interpolate(PAYMENT_MODES,[this.props.active_practiceId]),
        method: "post",
      }
      const defaultValues = [{"key":"practice", "value":this.props.active_practiceId}];
      const editFormDefaultValues = [{"key":"practice", "value":this.props.active_practiceId}, {"key":"id", "value":this.state.editingId}];

        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
            <TestFormLayout defaultValues={defaultValues} formProp={formProp}  fields={fields}/>
            <Divider/>
            <Table columns={columns}  dataSource={this.state.modes}/>
            <Modal
             title="Basic Modal"
             visible={this.state.visible}
             footer={null}
             >
              <TestFormLayout defaultValues={editFormDefaultValues} formProp={formProp}  fields={editfields}/>
              <Button key="back" onClick={this.handleCancel}>Return</Button>,
           </Modal>
        </div>
    }
}

export default PaymentModes;
