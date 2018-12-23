import {Button, Card, Icon, List} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import {BLOG_POST, BLOG_VIDEOS, LANDING_PAGE_VIDEO} from "../../../constants/api";
import {Route, Switch} from "react-router";
import {Link} from "react-router-dom";
import AddLandingPageVideo from "./AddLandingPageVideo";

export default class LandingPageVideoList extends React.Component{
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
        getAPI(LANDING_PAGE_VIDEO ,successFn, errorFn);
    }
    render(){
        return<div><Switch>
            <Route exact path='/web/landingpagevideo/add'
                   render={(route) => <AddLandingPageVideo {...this.state} {...route}/>}/>
            <Route exact path='/web/landingpagevideo/edit/:id'
                   render={(route) => <AddLandingPageVideo {...this.state} {...route}/>}/>
            <Card title="Disease" extra={<Link to={"/web/landingpagevideo/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
                <List/>
            </Card>
        </Switch>
        </div>
    }
}