import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {CHECKBOX_FIELD, SUCCESS_MSG_TYPE, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {ALL_PRACTICE} from "../../../../constants/api";
import {getAPI, displayMessage} from "../../../../utils/common";
import { Redirect } from 'react-router-dom'



class AddPracticeDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          redirect:false,
        }
        this.changeRedirect= this.changeRedirect.bind(this);
    }
    componentDidMount() {
      var that = this;
        let successFn = function (data) {
          let specialisations = {};
          data[0].specialisations.forEach(function(speciality){
            specialisations[speciality.id] = speciality
          });
          console.log(specialisations);

          that.setState({
          practiceList: data,
          specialisations:specialisations,
          })
        };
        let errorFn = function () {
        };
        getAPI(ALL_PRACTICE, successFn, errorFn);
      }

      changeRedirect(){
        var redirectVar=this.state.redirect;
      this.setState({
        redirect:  !redirectVar,
      })  ;
      }

    render() {
      const  fields= [{
            label: "Practice Name",
            key: "name",
            required: true,
            type: INPUT_FIELD
        }, {
            label: "Practice Tagline",
            key: "tagline",
            required: true,
            type: INPUT_FIELD
        }, {
            label: "Practice Specialisation",
            key: "specialisation",
            type: SELECT_FIELD,
            options: [{label: "Hello", value: "1"}, {label: "New", value: "2"}, {label: "World", value: "13"}]
        }, {
            label: "Practice Street Address",
            key: "address",
            type: INPUT_FIELD
        }, {
            label: "Practice locality",
            key: "locality",
            type: INPUT_FIELD
        }, {
            label: "Practice City",
            key: "city",
            type: SELECT_FIELD,
            options: [{label: "Hello", value: "1"}, {label: "New", value: "13"}, {label: "World", value: "14"}]
        }, {
            label: "Practice state",
            key: "state",
            type: SELECT_FIELD,
            options: [{label: "Hello", value: "1"}, {label: "New", value: "13"}, {label: "World", value: "14"}]
        }, {
            label: "Practice Country",
            key: "country",
            type: SELECT_FIELD,
            options: [{label: "Hello", value: "12"}, {label: "New", value: "13"}, {label: "World", value: "14"}]
        }, {
            label: "Practice PINCODE",
            key: "pincode",
            type: INPUT_FIELD
        }, {
            label: "Practice Contact Number",
            key: "contact",
            type: INPUT_FIELD
        }, {
            label: "Practice Email",
            key: "email",
            type: INPUT_FIELD
        }, {
            label: "Practice website",
            key: "website",
            type: INPUT_FIELD
        }, {
            label: "Timezone",
            key: "timezone",
            type: SELECT_FIELD,
            options: [{label: "Hello", value: "12"}, {label: "New", value: "13"}, {label: "World", value: "14"}]
        }, {
            label: "GSTIN",
            key: "gstin",
            type: INPUT_FIELD
        },];

        const formProp={
          successFn:function(data){
            displayMessage(SUCCESS_MSG_TYPE, "success")

            console.log(data);
          },
          errorFn:function(){

          },
          action: ALL_PRACTICE,
          method: "post",
        }

        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <Row>
            <Card>
                <TestFormLayout title="Practice Details" changeRedirect= {this.changeRedirect} formProp= {formProp} fields={fields}/>
            </Card>
            {this.state.redirect&&    <Redirect to='/settings/clinics' />}
        </Row>
    }
}

export default AddPracticeDetails;
