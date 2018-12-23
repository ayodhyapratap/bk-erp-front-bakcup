import {Button, Card, Icon, List} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import {BLOG_EVENTS, BLOG_POST} from "../../../constants/api";
import {Route, Switch} from "react-router";
import {Link} from "react-router-dom";
import AddEvent from "./AddEvent";

export default class DiseaseList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            events:null
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
        getAPI(BLOG_EVENTS ,successFn, errorFn);
    }
    render(){
        return<div><Switch>
            <Route exact path='/web/event/add'
                   render={(route) => <AddEvent {...this.state} {...route}/>}/>
            <Route exact path='web/event/edit/:id'
                   render={(route) => <AddEvent {...this.state} {...route}/>}/>
            <Card title="Disease" extra={<Link to={"/web/event/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
                <List/>
            </Card>
        </Switch>
        </div>
    }
}