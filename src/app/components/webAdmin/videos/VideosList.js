import {Button, Card, Icon, List} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import {BLOG_POST, BLOG_VIDEOS} from "../../../constants/api";
import {Route, Switch} from "react-router";
import {Link} from "react-router-dom";
import AddVideo from "./AddVideo";

export default class VideosList extends React.Component{
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
        getAPI(BLOG_VIDEOS ,successFn, errorFn);
    }
    render(){
        return<div><Switch>
            <Route exact path='/web/videos/add'
                   render={(route) => <AddVideo {...this.state} {...route}/>}/>
            <Route exact path='web/videos/edit/:id'
                   render={(route) => <AddVideo {...this.state} {...route}/>}/>
            <Card title="Disease" extra={<Link to={"/web/videos/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
                <List/>
            </Card>
        </Switch>
        </div>
    }
}