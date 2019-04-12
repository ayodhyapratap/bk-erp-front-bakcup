import React from "react";
import {Card, Form, Row} from "antd";
import {INPUT_FIELD, QUILL_TEXT_FIELD ,SUCCESS_MSG_TYPE, SINGLE_IMAGE_UPLOAD_FIELD} from "../../../constants/dataKeys";
import {displayMessage, getAPI, interpolate} from "../../../utils/common";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {MANAGE_THERAPY, MANAGE_SINGLE_THERAPY} from "../../../constants/api";
import {Route} from "react-router";
import {Redirect} from "react-router-dom";


export default class AddManageTherapy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editTherapyData: this.props.editTherapyData ? this.props.editTherapyData : null
        }
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            if (!this.state.editTherapyData) {
                this.loadData();
            }
        }
    }

    loadData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                editTherapyData: data,
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(MANAGE_SINGLE_THERAPY, [this.props.match.params.id]), successFn, errorFn);

    }
   
    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    render() {
        let that = this;
        const fields = [{
            label: "Therapy Name",
            key: "title",
            initialValue: this.state.editTherapyData ? this.state.editTherapyData.title : null,
            type: INPUT_FIELD
        },{
            label: "Therapy Image",
            key: "image",
            type: SINGLE_IMAGE_UPLOAD_FIELD,
        },{
            label: "Content",
            key: "content",
            initialValue: this.state.editTherapyData ? this.state.editTherapyData.content : null,
            type: QUILL_TEXT_FIELD,
        },];

        let editformProp;
        if (this.state.editTherapyData) {
            editformProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "success");
                    that.setState({
                        redirect: true
                    });
                    that.props.loadData();
                },
                errorFn: function () {

                },
                action: interpolate(MANAGE_SINGLE_THERAPY, [this.props.match.params.id]),
                method: "put",

            }
        }
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success");
                that.setState({
                        redirect: true
                    });
                    that.props.loadData();
            },
            errorFn: function () {

            },
            action: MANAGE_THERAPY,
            method: "post",
        }
        let defaultValues = [];

        return <Row>
            <Card>
                <Route exact path='/web/managetherapy/edit/:id'
                       render={() => (this.props.match.params.id ?
                           <TestFormLayout defaultValues={defaultValues} title="Edit Therapy"
                                changeRedirect={this.changeRedirect} formProp={editformProp}
                                    fields={fields}/> : <Redirect to={'web/managetherapy'}/>)}/>
                <Route exact path='/web/managetherapy/add'
                       render={() => <TestFormLayout title="Add Therapy" defaultValues={defaultValues}
                                changeRedirect={this.changeRedirect} formProp={formProp}
                                    fields={fields}/>}/>
            </Card>
            {this.state.redirect && <Redirect to={'/web/managetherapy'}/>}
        </Row>
    }
}
