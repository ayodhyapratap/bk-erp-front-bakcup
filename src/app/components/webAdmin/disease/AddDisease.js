import {Card, Form, Row} from "antd";
import React from "react";
import {
    SINGLE_IMAGE_UPLOAD_FIELD,
    INPUT_FIELD,
    QUILL_TEXT_FIELD,
    SELECT_FIELD,
    SUCCESS_MSG_TYPE,
    TEXT_FIELD, MULTI_IMAGE_UPLOAD_FIELD
} from "../../../constants/dataKeys";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {displayMessage, getAPI, interpolate} from "../../../utils/common";
import {BLOG_DISEASE, SINGLE_DISEASE} from "../../../constants/api";
import {Route} from "react-router";
import {Redirect} from "react-router-dom";
import {DISEASE_TYPES} from "../../../constants/hardData";


export default class AddDisease extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editBlogData: this.props.editBlogData ? this.props.editBlogData : null
        }
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            if (!this.state.editBlogData) {
                this.loadData();
            }
        }
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    loadData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                editBlogData: data,
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(SINGLE_DISEASE, [this.props.match.params.id]), successFn, errorFn);


    }


    render() {
        let that = this;
        const fields = [{
            label: "Disease Type",
            key: "disease_type",
            initialValue: this.state.editBlogData ? this.state.editBlogData.disease_type : null,
            type: SELECT_FIELD,
            options: DISEASE_TYPES
        }, {
            label: "Disease Name",
            key: "disease_name",
            initialValue: this.state.editBlogData ? this.state.editBlogData.disease_name : null,
            type: INPUT_FIELD
        }, {
            label: "Disease Main Image",
            key: "main_image",
            initialValue: this.state.editBlogData ? this.state.editBlogData.main_image : null,
            type: SINGLE_IMAGE_UPLOAD_FIELD,
        }, {
            label: "Disease Side Image",
            key: "side_image",
            initialValue: this.state.editBlogData ? this.state.editBlogData.side_image : [],
            type: MULTI_IMAGE_UPLOAD_FIELD,
        }, {
            label: "SEO Description",
            key: "meta_description",
            initialValue: this.state.editBlogData ? this.state.editBlogData.meta_description : null,
            type: TEXT_FIELD,
        }, {
            label: "SEO Keywords",
            key: "keywords",
            initialValue: this.state.editBlogData ? this.state.editBlogData.keywords : null,
            type: TEXT_FIELD,
        }, {
            label: "URL",
            key: "domain",
            initialValue: this.state.editBlogData ? this.state.editBlogData.domain : null,
            type: INPUT_FIELD,
            required: true
        }, {
            label: "Content",
            key: "content",
            initialValue: this.state.editBlogData ? this.state.editBlogData.content : null,
            type: QUILL_TEXT_FIELD,
        },];


        let editformProp;
        if (this.state.editBlogData) {
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
                action: interpolate(SINGLE_DISEASE, [this.props.match.params.id]),
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
                    console.log(data);
            },
            errorFn: function () {

            },
            action: BLOG_DISEASE,
            method: "post",
        }
        let defaultValues = [];

        return <Row>
            <Card>
                <Route exact path='/web/disease/edit/:id'
                       render={() => (this.props.match.params.id ?
                           <TestFormLayout defaultValues={defaultValues} title="Edit Disease"
                                           changeRedirect={this.changeRedirect} formProp={editformProp}
                                           fields={fields}/> : <Redirect to={'/web/disease'}/>)}/>
                <Route exact path='/web/disease/add'
                       render={() => <TestFormLayout title="Add Disease" changeRedirect={this.changeRedirect}
                                                     formProp={formProp} fields={fields}/>}/>


            </Card>
            {this.state.redirect && <Redirect to={'/web/disease'}/>}
        </Row>

    }
}
