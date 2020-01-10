import {Card, Form, Row} from "antd";
import React from "react";
import {
    INPUT_FIELD,
    QUILL_TEXT_FIELD,
    SUCCESS_MSG_TYPE,
} from "../../../constants/dataKeys";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {displayMessage, getAPI, interpolate} from "../../../utils/common";
import {
    BLOG_FACILITY, SINGLE_FACILITY,
} from "../../../constants/api";
import {Route} from "react-router";
import {Redirect} from "react-router-dom";


export default class AddFacility extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editBlogData: this.props.editBlogData ? this.props.editBlogData : null
        }
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            if (!this.state.editBlogData) {
                this.loadData();
            }
        }
    }

    loadData() {
        let that = this;
        console.log("i M groot")
        let successFn = function (data) {
            that.setState({
                editBlogData: data,
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(SINGLE_FACILITY, [this.props.match.params.id]), successFn, errorFn);

    }


    render() {
        const fields = [{
            label: "Name",
            key: "name",
            initialValue: this.state.editBlogData ? this.state.editBlogData.name : null,
            type: INPUT_FIELD
        }, {
            label: "content",
            key: "content",
            initialValue: this.state.editBlogData ? this.state.editBlogData.content : null,
            type: QUILL_TEXT_FIELD,
        },];

        let that = this;
        let editformProp;
        if (this.state.editBlogData) {
            editformProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "success");
                    that.props.loadData();
                    that.changeRedirect();
                    if (that.props.history){
                        that.props.history.replace('/web/facilities');
                    };

                },
                errorFn: function () {

                },
                action: interpolate(SINGLE_FACILITY, [this.props.match.params.id]),
                method: "put",

            }
        }
        const TestFormLayout = Form.create()(DynamicFieldsForm);

        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success");
                that.props.loadData();
                that.changeRedirect();
                if (that.props.history){
                    that.props.history.replace('/web/facilities');
                };
            },
            errorFn: function () {

            },
            action: BLOG_FACILITY,
            method: "post",
        }
        let defaultValues = [{key: 'is_active', value: true}];

        return <Row>
            <Card>
                <Route exact path='/web/facilities/edit/:id'
                       render={() => (this.props.match.params.id ?
                           <TestFormLayout defaultValues={defaultValues} title="Edit Facility"
                                           changeRedirect={this.changeRedirect} formProp={editformProp}
                                           fields={fields}/> : <Redirect to={'web/facilities'}/>)}/>
                <Route exact path='/web/facilities/add'
                       render={() => <TestFormLayout title="Add Facility" defaultValues={defaultValues}
                                                     changeRedirect={this.changeRedirect} formProp={formProp}
                                                     fields={fields}/>}/>


            </Card>
            {this.state.redirect && <Redirect to={'/web/facilities'}/>}
        </Row>

    }
}
