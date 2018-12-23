import {Button, Card, Icon, List} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import {BLOG_POST, BLOG_VIDEOS, LANDING_PAGE_CONTENT, LANDING_PAGE_VIDEO} from "../../../constants/api";
import {Route, Switch} from "react-router";
import {Link} from "react-router-dom";
import AddLandingPageContent from "./AddLandingPageContent";

export default class LandingPageContentList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            videos:null
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
        getAPI(LANDING_PAGE_CONTENT ,successFn, errorFn);
    }
    render(){
        return<div><Switch>
            <Route exact path='/web/landingpagecontent/add'
                   render={(route) => <AddLandingPageContent {...this.state} {...route}/>}/>
            <Route exact path='/web/landingpagecontent/edit/:id'
                   render={(route) => <AddLandingPageContent {...this.state} {...route}/>}/>
            <Card title="Disease" extra={<Link to={"/web/landingpagecontent/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
                <List/>
            </Card>
        </Switch>
        </div>
    }
}