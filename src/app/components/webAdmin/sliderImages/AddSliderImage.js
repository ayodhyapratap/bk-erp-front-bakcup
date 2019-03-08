import {Card, Form, Row} from "antd";
import React from "react";
import {
    SINGLE_IMAGE_UPLOAD_FIELD,
    INPUT_FIELD,
    SUCCESS_MSG_TYPE,
    NUMBER_FIELD
} from "../../../constants/dataKeys";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {displayMessage, getAPI, interpolate} from "../../../utils/common";
import {
    BLOG_SLIDER, SINGLE_SLIDER
} from "../../../constants/api";
import {Route} from "react-router";
import {Redirect} from "react-router-dom";


export default class AddSliderImage extends React.Component {
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
        getAPI(interpolate(SINGLE_SLIDER, [this.props.match.params.id]), successFn, errorFn);

    }


    render() {
        const fields = [{
            label: "Name",
            key: "name",
            initialValue: this.state.editBlogData ? this.state.editBlogData.name : null,
            type: INPUT_FIELD
        }, {
            label: "Page Title ",
            key: "title",
            initialValue: this.state.editBlogData ? this.state.editBlogData.title : null,
            type: INPUT_FIELD
        }, {
            label: "Rank ",
            key: "rank",
            initialValue: this.state.editBlogData ? this.state.editBlogData.rank : null,
            type: NUMBER_FIELD
        }, {
            label: "Slider Image ",
            key: "silder_image",
            initialValue: this.state.editBlogData ? this.state.editBlogData.silder_image : null,
            type: SINGLE_IMAGE_UPLOAD_FIELD
        },];

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
                action: interpolate(SINGLE_SLIDER, [this.props.match.params.id]),
                method: "put",

            }
        }
        const TestFormLayout = Form.create()(DynamicFieldsForm);

        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success");
                that.props.loadData();
                that.changeRedirect();
                console.log(data);
            },
            errorFn: function () {

            },
            action: BLOG_SLIDER,
            method: "post",
        }
        let defaultValues = [{key: 'is_active', value: true}];

        return <Row>
            <Card>
                <Route exact path='/web/slider-image/edit/:id'
                       render={() => (this.props.match.params.id ?
                           <TestFormLayout defaultValues={defaultValues} title="Edit Slider Image"
                                           changeRedirect={this.changeRedirect} formProp={editformProp}
                                           fields={fields}/> : <Redirect to={'web/silder-image'}/>)}/>
                <Route exact path='/web/slider-image/add'
                       render={() => <TestFormLayout title="Add Slider Image" defaultValues={defaultValues}
                                                     changeRedirect={this.changeRedirect}
                                                     formProp={formProp} fields={fields}/>}/>


            </Card>
            {this.state.redirect && <Redirect to={'/web/slider-image'}/>}
        </Row>

    }
}
