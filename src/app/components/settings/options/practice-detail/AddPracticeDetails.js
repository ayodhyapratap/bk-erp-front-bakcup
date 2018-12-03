import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {PRACTICE} from "../../../../constants/api";
import {getAPI} from "../../../../utils/common";
const formProp={
  successFn:function(data){
    console.log(data);
  },
  errorFn:function(){

  },
  action: PRACTICE,
}

class AddPracticeDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fields: [{
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
            },],

        }
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
        getAPI(PRACTICE, successFn, errorFn);
      }

    render() {
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <Row>
            <Card>
                <TestFormLayout title="Practice Details" formProp= {formProp} fields={this.state.fields}/>
            </Card>
        </Row>
    }
}

export default AddPracticeDetails;
