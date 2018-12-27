import {Button, Card, Form, Icon, List, Row} from "antd";
import React from "react";
import {
    DATE_PICKER,
    INPUT_FIELD, NUMBER_FIELD,
    QUILL_TEXT_FIELD,
    SELECT_FIELD, SINGLE_CHECKBOX_FIELD,
    SUCCESS_MSG_TYPE,
    TEXT_FIELD
} from "../../../constants/dataKeys";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {displayMessage, getAPI, interpolate} from "../../../utils/common";
import {
    BLOG_CONTACTUS,
    INVOICES_API,
    PRACTICE,
    SINGLE_CONTACT,
    SINGLE_DISEASE, SINGLE_PAGE_SEO,
    SINGLE_POST
} from "../../../constants/api";
import {Route} from "react-router";
import {Redirect} from "react-router-dom";


export default class AddContacts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editBlogData : this.props.editBlogData?this.props.editBlogData:null
        }
    }
    componentDidMount(){
        if(this.props.match.params.id){
            if(!this.state.editBlogData) {
                this.loadData();
            }
        }
    }
    changeRedirect(){
        var redirectVar=this.state.redirect;
        this.setState({
            redirect:  !redirectVar,
        })  ;
    }

    loadData(){
        let that =this;
        let successFn = function (data) {
            that.setState({
                editBlogData:data,
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(SINGLE_CONTACT, [this.props.match.params.id]) ,successFn, errorFn);

    }


    render(){
        const  fields= [{
            label: "Name",
            key: "name",
            initialValue:this.state.editBlogData?this.state.editBlogData.name:null,
            type: INPUT_FIELD
        },{
            label: "Rank ",
            key: "contact_rank",
            initialValue:this.state.editBlogData?this.state.editBlogData.contact_rank:null,
            type: NUMBER_FIELD
        },{
            label: "Phone Number ",
            key: "phone_no",
            initialValue:this.state.editBlogData?this.state.editBlogData.phone_no:null,
            type: INPUT_FIELD,
        },{
            label: "Address",
            key: "address",
            initialValue:this.state.editBlogData?this.state.editBlogData.address:null,
            type: TEXT_FIELD,
            minRows:3,
        },{
            label: "Active",
            key: "is_active",
            initialValue:this.state.editBlogData?this.state.editBlogData.is_active:null,
            type: SINGLE_CHECKBOX_FIELD,
            minRows:3,
        },];


        let editformProp;
        if(this.state.editBlogData) {
            editformProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "success");
                    console.log(data);
                },
                errorFn: function () {

                },
                action: interpolate(SINGLE_CONTACT,[this.props.match.params.id]),
                method: "put",

            }
        }
        const TestFormLayout = Form.create()(DynamicFieldsForm);

        const formProp={
            successFn:function(data){
                displayMessage(SUCCESS_MSG_TYPE, "success");

                console.log(data);
            },
            errorFn:function(){

            },
            action:  BLOG_CONTACTUS,
            method: "post",
        }
        let defaultValues=[];

        return <Row>
            <Card>
                <Route exact path='/web/contact/edit/:id'
                       render={() => (this.props.match.params.id?<TestFormLayout defaultValues={defaultValues} title="Edit Contact" changeRedirect= {this.changeRedirect} formProp= {editformProp} fields={fields}/>: <Redirect to={'/web/contact'} />)}/>
                <Route exact path='/web/contact/add'
                       render={() =><TestFormLayout title="Add Contact" changeRedirect= {this.changeRedirect} formProp= {formProp} fields={fields}/>}/>


            </Card>
            {this.state.redirect&&    <Redirect to={'/web/blog'} />}
        </Row>

    }
}
