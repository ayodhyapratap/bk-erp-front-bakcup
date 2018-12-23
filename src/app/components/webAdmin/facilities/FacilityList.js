import {Button, Card, Icon, List} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import {BLOG_FACILITY, BLOG_PAGE_SEO, BLOG_POST, BLOG_SLIDER} from "../../../constants/api";
import {Route, Switch} from "react-router";
import AddFacility from "./AddFacility";
import {Link} from "react-router-dom";

export default class FacilityList extends React.Component{
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
        getAPI(BLOG_FACILITY ,successFn, errorFn);
    }
    render(){
        return<div><Switch>
                <Route exact path='/web/facilities/add'
                   render={(route) => <AddFacility {...this.state} {...route}/>}/>
            <Route exact path='/web/facilities/edit/:id'
                   render={(route) => <AddFacility {...this.state} {...route}/>}/>
            <Card title="Facilities" extra={<Link to={"/web/facilities/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
                <List/>
            </Card>
        </Switch>
        </div>
    }
}