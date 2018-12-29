import {Button, Card, Divider, Icon, List, Row, Table, Upload} from "antd";
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
            that.setState({
                post:data
            })
        }
        let errorFn = function () {

        }
        getAPI(BLOG_POST ,successFn, errorFn);
    }
    render(){
        let coloumns = [{
            title: 'Blog Title',
            dataIndex: 'title',
            key: 'post_title'
        },{
            title:'Date',
            dataIndex:'posted_on',
            key:'post_date'
        },{
            title:'Actions',
            render:(item)=>{
                return <div>
                    <Link to={"/web/blog/edit/"+item.id}>Edit</Link>
                    <Divider type="vertical"/>
                    <a >Delete</a>
                </div>
            }
        }];
        return<div><Switch>
                <Route exact path='/web/blog/add'
                   render={(route) => <AddPost {...this.state} {...route}/>}/>
            <Route exact path='/web/blog/edit/:id'
                   render={(route) => <AddPost {...this.state} {...route}/>}/>
            <Card title="Blogs" extra={<Link to={"/web/blog/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
               <Table dataSource={this.state.post} columns={coloumns}/>
            </Card>
        </Switch>
        </div>
    }
}
