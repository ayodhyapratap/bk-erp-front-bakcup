import {Button, Card, Divider, Icon, List, Table} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import {BLOG_PAGE_SEO, BLOG_POST} from "../../../constants/api";
import {Route, Switch} from "react-router";
import AddSEO from "./AddSEO";
import {Link} from "react-router-dom";
import TableData from "../../settings/options/emr/TableData";

export default class SEOList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            pageSEO:null
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
                pageSEO:data
            })
        }
        let errorFn = function () {

        }
        getAPI(BLOG_PAGE_SEO ,successFn, errorFn);
    }
    render(){
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
                {/*<Route exact path='/web/pageseo/add'*/}
                   {/*render={(route) => <AddSEO {...this.state} {...route}/>}/>*/}
            <Route exact path='/web/pageseo/edit/:id'
                   render={(route) => <AddSEO loadData={this.loadData} {...this.state} {...route}/>}/>
            <Card title="Pages SEO"
                  // extra={<Link to={"/web/pageseo/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}
            >
                <Table dataSource={this.state.pageSEO} columns={coloumns}/>
            </Card>
        </Switch>
        </div>
    }
}
