import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Modal, Card, Form, Icon, Row, Table, Divider} from "antd";
import {SUCCESS_MSG_TYPE, CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, NUMBER_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {TAXES} from "../../../../constants/api"
import {Link} from "react-router-dom";
import {getAPI, displayMessage, interpolate} from "../../../../utils/common";

class TaxCatalog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          redirect: false,
          visible: false,
          taxes:null
        };
        this.loadData = this.loadData.bind(this);

    }
    componentDidMount(){
      this.loadData();
    }
    loadData(){
      var that = this;
        let successFn = function (data) {
          console.log("get table");
          that.setState({
            taxes:data,
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
    editTax(value){
      this.setState({
        editingId:value.id,
        editingName: value.name,
        editingValue:value.tax_value,

        visible: true,
      })
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }


    render() {
      let that =this;
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
              <a onClick={()=>this.editTax(record)}>  Edit</a>
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
              label: "Tax name",
              key: "name",
              required: true,
              initialValue:this.state.editingName,
              type: INPUT_FIELD
          },{
            label: "Tax Value",
            key: "tax_value",
            follow: "INR",
            required: true,
            initialValue:this.state.editingValue,

            type: NUMBER_FIELD
      },];
      const formProp={
        successFn:function(data){
          that.handleCancel();
          that.loadData();
          console.log(data);
          console.log("sucess");
          displayMessage(SUCCESS_MSG_TYPE, "success")
        },
        errorFn:function(){

        },
        action: interpolate(TAXES,[this.props.active_practiceId]),
        method: "post",
      }
      const defaultValues = [{"key":"practice", "value":this.props.active_practiceId}];
      const editFormDefaultValues = [{"key":"practice", "value":this.props.active_practiceId}, {"key":"id", "value":this.state.editingId}];
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
            <TestFormLayout defaultValues={defaultValues} formProp={formProp}  fields={fields}/>
            <Divider/>
            <Table columns={columns}  dataSource={this.state.taxes}/>
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

export default TaxCatalog;
