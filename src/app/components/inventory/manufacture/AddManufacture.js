import {Card, Form, Row} from "antd";
import React from "react";
import {
    INPUT_FIELD,
    SUCCESS_MSG_TYPE,
    TEXT_FIELD,
} from "../../../constants/dataKeys";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {displayMessage, getAPI, interpolate} from "../../../utils/common";
import {
    MANUFACTURER_API, SINGLE_MANUFACTURER_API, SINGLE_VENDOR_API
} from "../../../constants/api";
import {Route} from "react-router";
import {Redirect} from "react-router-dom";


export default class AddManufacture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editData: this.props.editData ? this.props.editData : null
        }
    }

    changeRedirect = () => {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            if (!this.state.editData) {
                this.loadData();
            }
        }
    }

    loadData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                editData: data,
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(SINGLE_MANUFACTURER_API, [this.props.match.params.id]), successFn, errorFn);


    }


    render() {
        let that = this;
        const fields = [{
            label: "Name",
            key: "name",
            initialValue: this.state.editData ? this.state.editData.name : null,
            type: INPUT_FIELD
        },{
            label: 'Details',
            key: 'description',
            type:TEXT_FIELD
        }, 
        ];


        let editformProp;
        if (this.state.editData) {
            editformProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "success");
                    that.props.loadData();
                    console.log(data);
                },
                errorFn: function () {

                },
                action: interpolate(SINGLE_MANUFACTURER_API, [this.props.match.params.id]),
                method: "put",

            }
        }
        const TestFormLayout = Form.create()(DynamicFieldsForm);

        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success");
                that.props.loadData();

                console.log(data);
            },
            errorFn: function () {

            },
            action: MANUFACTURER_API,
            method: "post",
        }
        const defaultValues = [{"key": "practice", "value": this.props.active_practiceId}];
        return <Row>
            <Card>
                <Route exact path='/inventory/manufacture/edit/:id'
                       render={() => (this.props.match.params.id ?
                           <TestFormLayout defaultValues={defaultValues} title="Edit Manufacturer"
                                           changeRedirect={this.changeRedirect} formProp={editformProp}
                                           fields={fields}/> : <Redirect to={'/inventory/manufacture'}/>)}/>
                <Route exact path='/inventory/manufacture/add'
                       render={() => <TestFormLayout title="Add Manufacturer" changeRedirect={this.changeRedirect}
                                                     formProp={formProp} fields={fields}/>}/>


            </Card>
            {this.state.redirect && <Redirect to={'/inventory/manufacture'}/>}
        </Row>

    }
}
