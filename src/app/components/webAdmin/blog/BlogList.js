import {Button, Card, Icon, List, Row, Upload} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import { BLOG_POST} from "../../../constants/api";
import {Route, Switch} from "react-router";
import AddPost from "./AddPost";
import {Link} from "react-router-dom";

export default class DiseaseList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            post:null
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
        getAPI(BLOG_POST ,successFn, errorFn);
    }
    render(){
        return<div><Switch>
                <Route exact path='/web/blog/add'
                   render={(route) => <AddPost {...this.state} {...route}/>}/>
            <Route exact path='/web/blog/edit/:id'
                   render={(route) => <AddPost {...this.state} {...route}/>}/>
            <Card title="Disease" extra={<Link to={"/web/blog/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
                <List/>
                <Upload>
                    <Button>
                        <Icon type="upload" /> Click to Upload
                    </Button>
                </Upload>,
            </Card>
        </Switch>
        </div>
    }
}