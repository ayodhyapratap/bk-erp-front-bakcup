import {Button, Card, Icon, List} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import {BLOG_PAGE_SEO, BLOG_POST} from "../../../constants/api";
import {Route, Switch} from "react-router";
import AddSEO from "./AddSEO";
import {Link} from "react-router-dom";

export default class SEOList extends React.Component{
    constructor(props){
        super(props);
        this.state={
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
        getAPI(BLOG_PAGE_SEO ,successFn, errorFn);
    }
    render(){
        return<div><Switch>
                <Route exact path='/web/pageseo/add'
                   render={(route) => <AddSEO {...this.state} {...route}/>}/>
            <Route exact path='/web/pageseo/edit/:id'
                   render={(route) => <AddSEO {...this.state} {...route}/>}/>
            <Card title="Disease" extra={<Link to={"/web/pageseo/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
                <List/>
            </Card>
        </Switch>
        </div>
    }
}