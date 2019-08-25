import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Card, Form, Row} from "antd";
import {EMAIL_FIELD, INPUT_FIELD, SINGLE_IMAGE_UPLOAD_FIELD, SUCCESS_MSG_TYPE} from "../../../../constants/dataKeys";
import {ALL_PRACTICE, EXTRA_DATA} from "../../../../constants/api";
import {displayMessage, getAPI} from "../../../../utils/common";
import {Redirect} from 'react-router-dom'


class AddPracticeDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
            specialisations: null,
            countries: null,
        }
        this.changeRedirect = this.changeRedirect.bind(this);
    }

    componentDidMount() {
        var that = this;
        let successFn = function (data) {
            let specialisations = {};
            data.specialisation.forEach(function (speciality) {
                specialisations[speciality.id] = speciality
            });
            console.log(specialisations);

            that.setState({
                specialisations: data.specialisation,
                countries: data.country,
            })
        };
        let errorFn = function () {
        };
        getAPI(EXTRA_DATA, successFn, errorFn);
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    render() {

        let specialisationsOptions = []
        if (this.state.specialisations) {
            this.state.specialisations.forEach(function (specialisation) {
                specialisationsOptions.push({label: (specialisation.name), value: specialisation.id});
            })
        }
        const fields = [{
            label: "Practice Logo",
            key: "logo",
            type: SINGLE_IMAGE_UPLOAD_FIELD,
            allowWebcam: false
        }, {
            label: "Practice Name",
            key: "name",
            placeholder: "Practice Name",
            required: true,
            type: INPUT_FIELD
        }, {
            label: "Practice Tagline",
            key: "tagline",
            placeholder: "Practice Tagline",
            required: true,
            type: INPUT_FIELD
        }, {
            label: "Practice Specialisation",
            key: "specialisation",
            placeholder: "Practice Specialisation",
            type: INPUT_FIELD,
            // options: specialisationsOptions,
        }, {
            label: "Practice Street Address",
            key: "address",
            placeholder: "Practice Street Address",
            type: INPUT_FIELD
        }, {
            label: "Practice Locality",
            key: "locality",
            placeholder: "Practice Locality",
            type: INPUT_FIELD
        }, {
            label: "Practice Country",
            key: "country",
            placeholder: "Practice Country",
            type: INPUT_FIELD,
        }, {
            label: "Practice State",
            key: "state",
            placeholder: "Practice State",
            type: INPUT_FIELD,
        }, {
            label: "Practice City",
            key: "city",
            placeholder: "Practice City",
            type: INPUT_FIELD,
        }, {
            label: "Practice PINCODE",
            key: "pincode",
            placeholder: "Practice PINCODE",
            type: INPUT_FIELD
        }, {
            label: "Practice Contact Number",
            key: "contact",
            placeholder: "Practice Contact Number",
            type: INPUT_FIELD
        }, {
            label: "Practice Email",
            key: "email",
            placeholder: "Practice Email",
            type: EMAIL_FIELD
        }, {
            label: "Practice Website",
            key: "website",
            placeholder: "Practice Website",
            type: INPUT_FIELD
        }, {
            label: "GSTIN",
            key: "gstin",
            placeholder: "GSTIN",
            type: INPUT_FIELD
        }, {
            label: "Invoice Prefix",
            placeholder: "DEL/INV/",
            key: "invoice_prefix",
            type: INPUT_FIELD,
            require: true
        }, {
            label: "Payment Prefix",
            placeholder: "DEL/RCPT/",
            key: "payment_prefix",
            type: INPUT_FIELD,
            require: true
        },
        {
            label: "Return Prefix",
            placeholder: "DEL/RET/",
            key: "return_prefix",
            type: INPUT_FIELD,
            require: true
        }];

        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success")

                console.log(data);
            },
            errorFn: function () {

            },
            action: ALL_PRACTICE,
            method: "post",
        }

        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <Row>
            <Card>
                <TestFormLayout title="Practice Details" changeRedirect={this.changeRedirect} formProp={formProp}
                                fields={fields} {...this.props}/>
            </Card>
            {this.state.redirect && <Redirect to='/settings/clinics'/>}
        </Row>
    }
}

export default AddPracticeDetails;
