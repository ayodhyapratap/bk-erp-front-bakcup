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
    BLOG_DISEASE,
    BLOG_POST, BLOG_VIDEOS,
    INVOICES_API, LANDING_PAGE_CONTENT, LANDING_PAGE_VIDEO,
    PRACTICE,
    SINGLE_DISEASE, SINGLE_LANDING_PAGE_CONTENT, SINGLE_LANDING_PAGE_VIDEO, SINGLE_PAGE_SEO,
    SINGLE_POST,
    SINGLE_VIDEO
} from "../../../constants/api";
import {Route} from "react-router";
import {Redirect} from "react-router-dom";


export default class AddLandingPageContent extends React.Component {
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
        getAPI(interpolate(SINGLE_LANDING_PAGE_CONTENT, [this.props.match.params.id]) ,successFn, errorFn);


    }


    render(){
        const  fields= [{
            label: "Title",
            key: "title",
            initialValue:this.state.editBlogData?this.state.editBlogData.title:null,
            type: INPUT_FIELD
        },{
            label: "Image",
            key: "image",
            initialValue:this.state.editBlogData?this.state.editBlogData.image:null,
            type: INPUT_FIELD,
        },{
            label: "content",
            key: "content",
            initialValue:this.state.editBlogData?this.state.editBlogData.total:null,
            type: QUILL_TEXT_FIELD,
        }, ];


        let editformProp;
        if(this.state.editBlogData) {
            editformProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "success");
                    console.log(data);
                },
                errorFn: function () {

                },
                action: interpolate(SINGLE_LANDING_PAGE_CONTENT, [this.props.practiceId]),
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
            action:  interpolate(LANDING_PAGE_CONTENT, [this.props.match.params.id]),
            method: "post",
        }
        let defaultValues=[];

        return <Row>
            <Card>
                <Route exact path='/web/landingpagecontent/edit/:id'
                       render={() => (this.props.match.params.id?<TestFormLayout defaultValues={defaultValues} title="Edit Content" changeRedirect= {this.changeRedirect} formProp= {editformProp} fields={fields}/>: <Redirect to={'/web/landingpagecontent'} />)}/>
                <Route exact path='/web/landingpagecontent/add'
                       render={() =><TestFormLayout title="Add Content" changeRedirect= {this.changeRedirect} formProp= {formProp} fields={fields}/>}/>


            </Card>
            {this.state.redirect&&    <Redirect to={'/web/landingpagecontent'} />}
        </Row>

    }
}
