import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Modal, Card, Form, Icon, Row, Table, Divider} from "antd";
import {SUCCESS_MSG_TYPE, CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, NUMBER_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {APPOINTMENT_CATEGORIES} from "../../../../constants/api"
import {Link} from "react-router-dom";
import {getAPI, displayMessage, interpolate} from "../../../../utils/common";

class AppointmentCategories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          redirect: false,
          visible: false,
          appointmentCategories:null
        };
        this.loadAppointmentCategories = this.loadAppointmentCategories.bind(this);

    }
    componentDidMount(){
      this.loadAppointmentCategories();
    }
    loadAppointmentCategories(){
        let that = this;
        let successFn =function (data){
            that.setState({
                appointmentCategories:data
            })

        }
        let errorFn = function (){

        }
        getAPI(interpolate(APPOINTMENT_CATEGORIES,[this.props.active_practiceId]), successFn, errorFn)
    }
    changeRedirect(){
      var redirectVar=this.state.redirect;
    this.setState({
      redirect:  !redirectVar,
    })  ;
    }
    editCategory(value){
      this.setState({
        editingId:value.id,
        editingName: value.name,

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
          },{
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <span>
              <a onClick={()=>this.editCategory(record)}>  Edit</a>
                <Divider type="vertical" />
              </span>
            ),
          }];
      const   fields= [{
            label: "Category name",
            key: "name",
            required: true,
            type: INPUT_FIELD
        },];
      const   editfields= [{
              label: "Category name",
              key: "name",
              required: true,
              initialValue:this.state.editingName,
              type: INPUT_FIELD
          },];
      const formProp={
        successFn:function(data){
          that.handleCancel();
          that.loadAppointmentCategories();
          console.log(data);
          console.log("sucess");
          displayMessage(SUCCESS_MSG_TYPE, "success")
        },
        errorFn:function(){

        },
        action: interpolate(APPOINTMENT_CATEGORIES,[this.props.active_practiceId]),
        method: "post",
      }
      const defaultValues = [];
      const editFormDefaultValues = [{"key":"id", "value":this.state.editingId}];
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
            <TestFormLayout defaultValues={defaultValues} formProp={formProp}  fields={fields}/>
            <Divider/>
            <Table columns={columns}  dataSource={this.state.appointmentCategories}/>
            <Modal
             title="ADD Appointment Category"
             visible={this.state.visible}
             footer={null}
             >
              <TestFormLayout defaultValues={editFormDefaultValues} formProp={formProp}  fields={editfields}/>
              <Button key="back" onClick={this.handleCancel}>Return</Button>,

           </Modal>
        </div>
    }
}

export default AppointmentCategories;
