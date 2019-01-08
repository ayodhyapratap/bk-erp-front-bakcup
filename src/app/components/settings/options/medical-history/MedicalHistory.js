import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Modal, Card, Form, Icon, Row, Table, Divider, Popconfirm} from "antd";
import {SUCCESS_MSG_TYPE, CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, NUMBER_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {MEDICAL_HISTORY} from "../../../../constants/api"
import {Link} from "react-router-dom";
import {getAPI, displayMessage, interpolate, postAPI} from "../../../../utils/common";

class MedicalHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          redirect: false,
          visible: false,
          history:null
        };
        this.loadData = this.loadData.bind(this);
        this.deleteObject = this.deleteObject.bind(this);

    }
    componentDidMount(){
      this.loadData();
    }
    loadData(){
      var that = this;
        let successFn = function (data) {
          console.log("get table");
          that.setState({
            history:data,
          })
        };
        let errorFn = function () {
        };
       getAPI(interpolate( MEDICAL_HISTORY, [this.props.active_practiceId]), successFn, errorFn);
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


        visible: true,
      })
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    deleteObject(record) {
        let that = this;
        let reqData = record;
        reqData.is_active = false;
        let successFn = function (data) {
            that.loadData();
        }
        let errorFn = function () {
        };
        postAPI(interpolate(MEDICAL_HISTORY, [this.props.active_practiceId]), reqData, successFn, errorFn)
    }



    render() {
      let that =this;
      const columns = [{
            title: 'Expance Name',
            dataIndex: 'name',
            key: 'name',
          },{
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <span>
              <a onClick={()=>this.editTax(record)}>  Edit</a>
                <Divider type="vertical" />
                <Popconfirm title="Are you sure delete this?"
                            onConfirm={() => that.deleteObject(record)} okText="Yes" cancelText="No">
                  <a>Delete</a>
              </Popconfirm>
              </span>
            ),
          }];
      const   fields= [{
            label: "Medical History",
            key: "name",
            required: true,
            type: INPUT_FIELD
        },];
      const   editfields= [{
              label: "Medical history ",
              key: "name",
              required: true,
              initialValue:this.state.editingName,
              type: INPUT_FIELD
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
        action: interpolate(MEDICAL_HISTORY,[this.props.active_practiceId]),
        method: "post",
      }
      const defaultValues = [];
      const editFormDefaultValues = [{"key":"id", "value":this.state.editingId}];
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
        <Card>
              <TestFormLayout title="Medical History" defaultValues={defaultValues}  formProp={formProp}  fields={fields}/>
              <Divider/>
              <Table columns={columns}  dataSource={this.state.history}/>
            </Card>
            <Modal
             title="Basic Modal"
             visible={this.state.visible}
             footer={null}
             >
              <TestFormLayout title="Change history" defaultValues={editFormDefaultValues} formProp={formProp}  fields={editfields}/>
              <Button key="back" onClick={this.handleCancel}>Return</Button>,

           </Modal>
        </div>
    }
}

export default MedicalHistory;
