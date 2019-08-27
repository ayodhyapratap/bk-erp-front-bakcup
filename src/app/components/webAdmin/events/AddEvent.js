import {Card, Form, Row} from "antd";
import React from "react";
import {
    DATE_PICKER, SINGLE_IMAGE_UPLOAD_FIELD,
    INPUT_FIELD,
    QUILL_TEXT_FIELD,
    SUCCESS_MSG_TYPE,
    TEXT_FIELD
} from "../../../constants/dataKeys";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {displayMessage, getAPI, interpolate} from "../../../utils/common";
import {
    BLOG_EVENTS,
    SINGLE_EVENTS,
} from "../../../constants/api";
import {Route} from "react-router";
import {Redirect} from "react-router-dom";


export default class AddEvent extends React.Component {
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
        let successFn = function (data) {
            that.setState({
                editBlogData: data,
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(SINGLE_EVENTS, [this.props.match.params.id]), successFn, errorFn);


    }


    render() {
        const fields = [{
            label: "Event Title",
            key: "title",
            initialValue: this.state.editBlogData ? this.state.editBlogData.title : null,
            type: INPUT_FIELD
        }, {
            label: "Event Date",
            key: "event_date",
            initialValue: this.state.editBlogData ? this.state.editBlogData.event_date : null,
            type: DATE_PICKER,

        }, {
            label: "Event Image",
            key: "event_image",
            initialValue: this.state.editBlogData ? this.state.editBlogData.event_image : null,
            type: SINGLE_IMAGE_UPLOAD_FIELD,
        }, {
            label: "SEO Description",
            key: "meta_description",
            initialValue: this.state.editBlogData ? this.state.editBlogData.meta_description : null,
            type: INPUT_FIELD,
        }, {
            label: "SEO Keywords",
            key: "keywords",
            required:true,
            initialValue: this.state.editBlogData ? this.state.editBlogData.keywords : null,
            type: TEXT_FIELD,
        }, {
            label: "URL",
            key: "domain",
            initialValue: this.state.editBlogData ? this.state.editBlogData.domain : null,
            type: INPUT_FIELD,
        }, {
            label: "Content",
            key: "content",
            initialValue: this.state.editBlogData ? this.state.editBlogData.content : null,
            type: QUILL_TEXT_FIELD,
        }];

        let that = this;
        let editformProp;
        if (this.state.editBlogData) {
            editformProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "success");
                    console.log(data);
                    that.props.loadData();
                    that.changeRedirect();
                },
                errorFn: function () {

                },
                action: interpolate(SINGLE_EVENTS, [this.props.match.params.id]),
                method: "put",

            }
        }
        const TestFormLayout = Form.create()(DynamicFieldsForm);

        let formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success");
                that.props.loadData();
                that.changeRedirect();
                console.log(data);
            },
            errorFn: function () {

            },
            action: BLOG_EVENTS,
            method: "post",
        }
        let defaultValues = [{key: 'is_active', value: true}];

        return <Row>
            <Card>
                <Route exact path='/web/event/edit/:id'
                       render={() => (this.props.match.params.id ?
                           <TestFormLayout defaultValues={defaultValues} title="Edit Event"
                                           changeRedirect={this.changeRedirect} formProp={editformProp}
                                           fields={fields}/> : <Redirect to={'/web/event'}/>)}/>
                <Route exact path='/web/event/add'
                       render={() => <TestFormLayout defaultValues={defaultValues} title="Add Event"
                                                     changeRedirect={this.changeRedirect}
                                                     formProp={formProp} fields={fields}/>}/>


            </Card>
            {this.state.redirect && <Redirect to={'/web/event'}/>}
        </Row>

    }
}
