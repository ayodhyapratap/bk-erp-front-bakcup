import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {
    CHECKBOX_FIELD,
    SUCCESS_MSG_TYPE,
    INPUT_FIELD,
    EMAIL_FIELD,
    RADIO_FIELD,
    SELECT_FIELD,
    COUNTRY_FIELD, STATE_FIELD, CITY_FIELD, SINGLE_IMAGE_UPLOAD_FIELD, NUMBER_FIELD
} from "../../../../constants/dataKeys";
import {ALL_PRACTICE, EXTRA_DATA} from "../../../../constants/api";
import {getAPI, displayMessage} from "../../../../utils/common";
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
            type: SINGLE_IMAGE_UPLOAD_FIELD
        }, {
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
            type: INPUT_FIELD,
            // options: specialisationsOptions,
        }, {
            label: "Practice Street Address",
            key: "address",
            type: INPUT_FIELD
        }, {
            label: "Practice Locality",
            key: "locality",
            type: INPUT_FIELD
        }, {
            label: "Practice Country",
            key: "country",
            type: INPUT_FIELD,
        }, {
            label: "Practice State",
            key: "state",
            type: INPUT_FIELD,
        }, {
            label: "Practice City",
            key: "city",
            type: INPUT_FIELD,
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
            type: EMAIL_FIELD
        }, {
            label: "Practice Website",
            key: "website",
            type: INPUT_FIELD
        },
            //     {
            //     label: "Timezone",
            //     key: "timezone",
            //     type: SELECT_FIELD,
            //     options: [{label: "GMT +05:30", value: 12}],
            //     initialValue:12
            // },
            {
                label: "GSTIN",
                key: "gstin",
                type: INPUT_FIELD
            }, {
                label: "Normal Bed Count",
                key: "normal_seats",
                type: NUMBER_FIELD,
                min: 0
            }, {
                label: "Tatkal Bed Count",
                key: "tatkal_seats",
                type: NUMBER_FIELD,
                min: 0
            },];

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
