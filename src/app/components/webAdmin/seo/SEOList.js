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
            pageSEO:null
        };
        this.loadData=this.loadData.bind(this);
        this.deleteObject = this.deleteObject.bind(this);
    }
    componentDidMount(){
        this.loadData();
    }
    loadData(){
        let that =this;
        let successFn = function (data) {
            that.setState({
                pageSEO:data
            })
        }
        let errorFn = function () {

        }
        getAPI(BLOG_PAGE_SEO ,successFn, errorFn);
    }
    deleteObject(record) {
        let that = this;
        let reqData = {};
        reqData.is_active = false;
        let successFn = function (data) {
            that.loadData();
        };
        let errorFn = function () {
        };
        patchAPI(interpolate(SINGLE_PAGE_SEO, [record.id]), reqData, successFn, errorFn)
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
                          <Divider type="vertical"/>
                        <Popconfirm title="Are you sure delete this item?"
                                onConfirm={() => that.deleteObject(item)} okText="Yes" cancelText="No">
                             <a>Delete</a>
                        </Popconfirm>
                    </div>
                }
            }];
        return<div><Switch>
                <Route exact path='/web/pageseo/add'
                   render={(route) => <AddSEO {...this.state} {...route}/>}/>
                <Route exact path='/web/pageseo/edit/:id'
                   render={(route) => <AddSEO loadData={this.loadData} {...this.state} {...route}/>}/>
              
                
                <Card title="Pages SEO"
                   extra={<Link to={"/web/pageseo/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}
            >
                <Table dataSource={this.state.pageSEO} columns={coloumns}/>
            </Card>
        </Switch>
        </div>
    }
}
