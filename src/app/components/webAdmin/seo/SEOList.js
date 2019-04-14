import { Card, Table, Button, Icon,Divider,Popconfirm } from "antd";
import React from "react";
import {getAPI, interpolate, patchAPI} from "../../../utils/common";
import {BLOG_PAGE_SEO, SINGLE_PAGE_SEO} from "../../../constants/api";
import {Route, Switch} from "react-router";
import AddSEO from "./AddSEO";
import {Link} from "react-router-dom";

export default class SEOList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            pageSEO:null,
            loading:true
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
                pageSEO:data,
                loading:false
            })
        }
        let errorFn = function () {
            that.setState({
                loading:false
            })

        }
        getAPI(BLOG_PAGE_SEO ,successFn, errorFn);
    }
  
    render(){
        let that = this;
        let coloumns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },{
            title: 'Title',
            dataIndex: 'title',
            key: 'title'
        },{
            title: 'SEO Descriptions',
            dataIndex: 'meta_description',
            key: 'meta_description'
        },{
            title: 'SEO Keywords',
            dataIndex: 'keywords',
            key: 'keywords'
        },
            {
                title:'Actions',
                render:(item)=>{
                    return <div>
                        <Link to={"/web/pageseo/edit/"+item.id}>Edit</Link>
                    </div>
                }
            }];
        return<div><Switch>
                <Route exact path='/web/pageseo/edit/:id'
                   render={(route) => <AddSEO loadData={this.loadData} {...this.state} {...route}/>}/>
     
                <Card title="Pages SEO">
                <Table loading={this.state.loading} dataSource={this.state.pageSEO} columns={coloumns}/>
            </Card>
        </Switch>
        </div>
    }
}
