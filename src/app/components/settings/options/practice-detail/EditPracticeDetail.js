import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {PRACTICE} from "../../../../constants/api";
import {getAPI,interpolate} from "../../../../utils/common";
import { Redirect } from 'react-router-dom'



class EditPracticeDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            practiceDetail: null,
            specialisations: null,

        };
        this.changeRedirect= this.changeRedirect.bind(this);

    }
    changeRedirect(){
      var redirectVar=this.state.redirect;
    this.setState({
      redirect:  !redirectVar,
    })  ;
    }

    componentDidMount() {
      var that = this;
        let successFn = function (data) {
          let specialisations = {};
          data.specialisations.forEach(function(speciality){
            specialisations[speciality.id] = speciality
          });
          console.log(specialisations);

          that.setState({
          practiceDetail: data,
          specialisations:specialisations,
          })
        };
        let errorFn = function () {
        };
        getAPI(interpolate(PRACTICE, [this.props.practiceId]), successFn, errorFn);

      }


    render() {
      if(this.state.practiceDetail!=null){
      const fields= [{
            label: "Practice Name",
            key: "name",
            required: true,
            initialValue: this.state.practiceDetail.name ,
            type: INPUT_FIELD
        }, {
            label: "Practice Tagline",
            key: "tagline",
            required: true,
            initialValue: this.state.practiceDetail.tagline ,
            type: INPUT_FIELD
        }, {
            label: "Practice Specialisation",
            key: "specialisation",
            initialValue: this.state.practiceDetail.specialisation ,
            type: SELECT_FIELD,
            options: [{label: "1", value: "1"}, {label: "2", value: "2"}, {label: "3", value: "13"}]
        }, {
            label: "Practice Street Address",
            key: "address",
            initialValue: this.state.practiceDetail.address ,
            type: INPUT_FIELD
        }, {
            label: "Practice locality",
            initialValue: this.state.practiceDetail.locality ,
            key: "locality",
            type: INPUT_FIELD
        }, {
            label: "Practice City",
            initialValue: this.state.practiceDetail.City ,
            key: "city",
            type: SELECT_FIELD,
            options: [{label: "Hello", value: "1"}, {label: "New", value: "13"}, {label: "World", value: "14"}]
        }, {
            label: "Practice state",
            key: "state",
            initialValue: this.state.practiceDetail.state ,
            type: SELECT_FIELD,
            options: [{label: "Hello", value: "1"}, {label: "New", value: "13"}, {label: "World", value: "14"}]
        }, {
            label: "Practice Country",
            key: "country",
            initialValue: this.state.practiceDetail.country ,
            type: SELECT_FIELD,
            options: [{label: "Hello", value: "12"}, {label: "New", value: "13"}, {label: "World", value: "14"}]
        }, {
            label: "Practice PINCODE",
            key: "pincode",
            initialValue: this.state.practiceDetail.pincode ,
            type: INPUT_FIELD
        }, {
            label: "Practice Contact Number",
            key: "contact",
            initialValue: this.state.practiceDetail.contact ,
            type: INPUT_FIELD
        }, {
            label: "Practice Email",
            key: "email",
            initialValue: this.state.practiceDetail.email ,
            type: INPUT_FIELD
        }, {
            label: "Practice website",
            key: "website",
            initialValue: this.state.practiceDetail.website ,
            type: INPUT_FIELD
        }, {
            label: "Timezone",
            key: "timezone",
            initialValue: this.state.practiceDetail.timezone ,
            type: SELECT_FIELD,
            options: [{label: "Hello", value: "12"}, {label: "New", value: "13"}, {label: "World", value: "14"}]
        }, {
            label: "GSTIN",
            initialValue: this.state.practiceDetail.gstin ,
            key: "gstin",
            type: INPUT_FIELD
        },];
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        const formProp={
          successFn:function(data){
            console.log(data);
          },
          errorFn:function(){

          },
          action: interpolate(PRACTICE, [this.props.practiceId]),
          method: "put",
        };


        return <Row>
            <Card>
             <TestFormLayout title="Edit Practice Details" changeRedirect={this.changeRedirect} formProp= {formProp} fields={fields}/>
              {this.state.redirect&&    <Redirect to='/settings/clinics' />}
             </Card>
        </Row>}
        else return<Card loading={true}/>
    }
}

export default EditPracticeDetail;
