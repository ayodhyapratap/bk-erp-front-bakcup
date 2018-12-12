import React from "react";
import {Route} from "react-router";
import {} from "react-router-dom";

import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {CHECKBOX_FIELD, DATE_PICKER, NUMBER_FIELD,  SUCCESS_MSG_TYPE, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../constants/dataKeys";
import {PATIENTS_LIST, PATIENT_PROFILE} from "../../../constants/api";
import {getAPI,interpolate, displayMessage} from "../../../utils/common";
import { Redirect, Link } from 'react-router-dom'
import moment from 'moment';


class Appointment extends React.Component{
  constructor(props) {
      super(props);

      this.state = {
        redirect:false,

      }
      this.changeRedirect= this.changeRedirect.bind(this);

  }
  componentDidMount(){
  }

  changeRedirect(){
    var redirectVar=this.state.redirect;
      this.setState({
        redirect:  !redirectVar,
      })  ;
  }
  render(){
    const TestFormLayout = Form.create()(DynamicFieldsForm);
      return <Card  extra={<Link to="/calendar/create">
           <Button type="primary" >
               <Icon type="edit"/>&nbsp;Edit Patient Profile</Button>
       </Link>}>
      </Card>
  }

}

export default Appointment;
