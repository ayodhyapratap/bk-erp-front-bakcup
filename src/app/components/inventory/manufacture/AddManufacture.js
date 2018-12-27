import {Button, Card, Form, Icon, List, Row} from "antd";
import React from "react";
import {
    DATE_PICKER, FILE_UPLOAD_FIELD,
    INPUT_FIELD,
    QUILL_TEXT_FIELD,
    SELECT_FIELD,
    SUCCESS_MSG_TYPE,
    TEXT_FIELD
} from "../../../constants/dataKeys";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {displayMessage, getAPI, interpolate} from "../../../utils/common";
import {
    BLOG_DISEASE,
    BLOG_POST,
    INVOICES_API, MANUFACTURER_API,
    PRACTICE,
    SINGLE_DISEASE, SINGLE_MANUFACTURER_API,
    SINGLE_PAGE_SEO,
    SINGLE_POST, SINGLE_VENDOR_API
} from "../../../constants/api";
import {Route} from "react-router";
import {Redirect} from "react-router-dom";


export default class AddManufacture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editData : this.props.editData?this.props.editData:null
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
            if(!this.state.editData) {
                this.loadData();
            }
        }
    }

    loadData(){
        let that =this;
        let successFn = function (data) {
            that.setState({
                editData:data,
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(SINGLE_VENDOR_API, [this.props.match.params.id]) ,successFn, errorFn);


    }


    render(){
        const  fields= [{
            label: "Name",
            key: "name",
            initialValue:this.state.editData?this.state.editData.name:null,
            type: INPUT_FIELD
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
                action: interpolate(SINGLE_MANUFACTURER_API, [this.props.match.params.id]),
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
            action:  MANUFACTURER_API,
            method: "post",
        }
        const defaultValues = [{"key":"practice", "value":this.props.active_practiceId}];
        return <Row>
            <Card>
                <Route exact path='/inventory/manufacture/edit/:id'
                       render={() => (this.props.match.params.id?<TestFormLayout defaultValues={defaultValues} title="Edit Manufacture" changeRedirect= {this.changeRedirect} formProp= {editformProp} fields={fields}/>: <Redirect to={'/inventory/manufacture'} />)}/>
                <Route exact path='/inventory/manufacture/add'
                       render={() =><TestFormLayout title="Add Manufacture" changeRedirect= {this.changeRedirect} formProp= {formProp} fields={fields}/>}/>


            </Card>
            {this.state.redirect&&    <Redirect to={'/inventory/manufacture'} />}
        </Row>

    }
}
