import { Card, Form,Row} from "antd";
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
    BLOG_POST,
    SINGLE_POST
} from "../../../constants/api";
import {Route} from "react-router";
import {Redirect} from "react-router-dom";
import moment from "moment";


export default class AddPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editBlogData : this.props.editBlogData?this.props.editBlogData:null
        }
    }
    changeRedirect(){
        var redirectVar=this.state.redirect;
        this.setState({
            redirect:  !redirectVar,
        })  ;
    }

    componentDidMount(){
        if(this.props.match.params.id){
            if(!this.state.editBlogData) {
                this.loadData();
            }
        }
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
        getAPI(interpolate(SINGLE_POST, [this.props.match.params.id]) ,successFn, errorFn);


    }


    render(){
        let that =this;
        const  fields= [{
            label: "Blog Title",
            key: "title",
            required:true,
            initialValue:this.state.editBlogData?this.state.editBlogData.title:null,
            type: INPUT_FIELD
        },{
            label: "Blog Domain ",
            key: "domain",
            initialValue:this.state.editBlogData?this.state.editBlogData.domain:null,
            type: INPUT_FIELD
        },{
            label: "Blog URL ",
            key: "slug",
            required:true,
            initialValue:this.state.editBlogData?this.state.editBlogData.slug:null,
            type: INPUT_FIELD
        },{
            label: "Blog Image",
            key: "featured_image",
            initialValue:this.state.editBlogData?this.state.editBlogData.featured_image:null,
            type: SINGLE_IMAGE_UPLOAD_FIELD,
        },{
            label: "Posted On",
            key: "posted_on",
            initialValue:this.state.editBlogData?moment(this.state.editBlogData.posted_on):null,
            type: DATE_PICKER

        },{
            label: "SEO Description",
            key: "meta_description",
            initialValue:this.state.editBlogData?this.state.editBlogData.meta_description:null,
            type: INPUT_FIELD,
        },{
            label: "SEO Keywords",
            key: "keywords",
            required:true,
            initialValue:this.state.editBlogData?this.state.editBlogData.keywords:null,
            type: TEXT_FIELD,
        },{
            label: "Content",
            key: "content",
            required:true,
            initialValue:this.state.editBlogData?this.state.editBlogData.content:null,
            type: QUILL_TEXT_FIELD,
        }, ];


        let editformProp;
        if(this.state.editBlogData) {
            editformProp = {
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
                action: interpolate(SINGLE_POST, [this.props.match.params.id]),
                method: "put",

            }
        }
        const TestFormLayout = Form.create()(DynamicFieldsForm);

        const formProp={
            successFn:function(data){
                displayMessage(SUCCESS_MSG_TYPE, "success");
                that.setState({
                        redirect: true
                    });
                    that.props.loadData();
                console.log(data);
            },
            errorFn:function(){

            },
            action:  BLOG_POST,
            method: "post",
        }
        let defaultValues=[];

        return <Row>
            <Card>
                <Route exact path='/web/blog/edit/:id'
                       render={() => (this.props.match.params.id?<TestFormLayout defaultValues={defaultValues} title="Edit Post" changeRedirect= {this.changeRedirect} formProp= {editformProp} fields={fields}/>: <Redirect to={'/web/blog'} />)}/>
                <Route exact path='/web/blog/add'
                       render={() =><TestFormLayout title="Add Post" changeRedirect= {this.changeRedirect} formProp= {formProp} fields={fields}/>}/>


            </Card>
            {this.state.redirect&&    <Redirect to={'/web/blog'} />}
        </Row>

    }
}
