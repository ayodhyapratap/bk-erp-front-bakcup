import React from "react";
import {Card, Form, Row} from "antd";
import {INPUT_FIELD, QUILL_TEXT_FIELD ,SUCCESS_MSG_TYPE, SINGLE_IMAGE_UPLOAD_FIELD} from "../../../constants/dataKeys";
import {displayMessage, getAPI, interpolate} from "../../../utils/common";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {MANAGE_PRODUCT, MANAGE_SINGLE_PRODUCT} from "../../../constants/api";
import {Route} from "react-router";
import {Redirect} from "react-router-dom";


export default class AddManageProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editProductData: this.props.editProductData ? this.props.editProductData : null
        }
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            if (!this.state.editProductData) {
                this.loadData();
            }
        }
    }

    loadData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                editProductData: data,
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(MANAGE_SINGLE_PRODUCT, [this.props.match.params.id]), successFn, errorFn);

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
            label: "Product Name",
            key: "title",
            initialValue: this.state.editProductData ? this.state.editProductData.title : null,
            type: INPUT_FIELD
        },{
            label: "Product Price",
            key: "price",
            initialValue: this.state.editProductData ? this.state.editProductData.price : null,
            type: INPUT_FIELD
        }, {
            label: "Product Image",
            key: "image",
            type: SINGLE_IMAGE_UPLOAD_FIELD,
        },{
            label: "Content",
            key: "content",
            initialValue: this.state.editProductData ? this.state.editProductData.content : null,
            type: QUILL_TEXT_FIELD,
        },];

        let editformProp;
        if (this.state.editProductData) {
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
                action: interpolate(MANAGE_SINGLE_PRODUCT, [this.props.match.params.id]),
                method: "put",

            }
        }
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        const formProp = {
            successFn: function (data) {
                console.log("formaDta",data);
                displayMessage(SUCCESS_MSG_TYPE, "success");
                that.setState({
                        redirect: true
                    });
                    that.props.loadData();
            },
            errorFn: function () {

            },
            action: MANAGE_PRODUCT,
            method: "post",
        }
        let defaultValues = [];

        return <Row>
            <Card>
                <Route exact path='/web/manageproduct/edit/:id'
                       render={() => (this.props.match.params.id ?
                           <TestFormLayout defaultValues={defaultValues} title="Edit Product"
                                changeRedirect={this.changeRedirect} formProp={editformProp}
                                    fields={fields}/> : <Redirect to={'web/manageproduct'}/>)}/>
                <Route exact path='/web/manageproduct/add'
                       render={() => <TestFormLayout title="Add Product" defaultValues={defaultValues}
                                changeRedirect={this.changeRedirect} formProp={formProp}
                                    fields={fields}/>}/>
            </Card>
            {this.state.redirect && <Redirect to={'/web/manageproduct'}/>}
        </Row>
    }
}
