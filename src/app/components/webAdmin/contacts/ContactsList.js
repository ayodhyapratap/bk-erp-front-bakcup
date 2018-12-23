import {Button, Card, Icon, List} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import {BLOG_CONTACTUS} from "../../../constants/api";
import {Route, Switch} from "react-router";
import {Link} from "react-router-dom";
import AddContacts from "./AddContacts";

export default class ContactsList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            contacts:null
        };
        this.loadData=this.loadData.bind(this);
    }
    componentDidMount(){
        this.loadData();
    }
    loadData(){
        let that =this;
        let successFn = function (data) {
            console.log(data);
        }
        let errorFn = function () {

        }
        getAPI(BLOG_CONTACTUS ,successFn, errorFn);
    }
    render(){
        return<div><Switch>
            <Route exact path='/web/contact/add'
                   render={(route) => <AddContacts {...this.state} {...route}/>}/>
            <Route exact path='/web/contact/edit/:id'
                   render={(route) => <AddContacts {...this.state} {...route}/>}/>
            <Card title="Disease" extra={<Link to={"/web/contact/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
                <List/>
            </Card>
        </Switch>
        </div>
    }
}