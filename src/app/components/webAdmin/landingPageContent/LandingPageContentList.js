import {Avatar, Button, Card, Icon, List, Popconfirm} from "antd";
import React from "react";
import {getAPI, interpolate, patchAPI, postAPI, makeFileURL} from "../../../utils/common";
import {
    BLOG_POST,
    BLOG_VIDEOS,
    LANDING_PAGE_CONTENT,
    LANDING_PAGE_VIDEO,
    SINGLE_LANDING_PAGE_CONTENT
} from "../../../constants/api";
import {Route, Switch} from "react-router";
import {Link} from "react-router-dom";
import AddLandingPageContent from "./AddLandingPageContent";

export default class LandingPageContentList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            pageContent:[],
            loading:true
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
                pageContent:data,
                loading:false
            })
        }
        let errorFn = function () {
          that.setState({
            loading:false
          })

        }
        getAPI(LANDING_PAGE_CONTENT ,successFn, errorFn);
    }
    deleteObject(record) {
        let that = this;
        let reqData = {};
        reqData.is_active = false;
        let successFn = function (data) {
            that.loadData();
        }
        let errorFn = function () {
        };
        patchAPI(interpolate(SINGLE_LANDING_PAGE_CONTENT, [record.id]), reqData, successFn, errorFn)
    }
    render(){
        let that = this;
        return<div><Switch>
            <Route exact path='/web/landingpagecontent/add'
                   render={(route) => <AddLandingPageContent {...this.state} {...route}/>}/>
            <Route exact path='/web/landingpagecontent/edit/:id'
                   render={(route) => <AddLandingPageContent {...this.state} {...route}/>}/>
            <Card title="Landing Page Content" extra={<Link to={"/web/landingpagecontent/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
                <List loading={this.state.loading} dataSource={this.state.pageContent}
                      itemLayout="vertical"
                      renderItem={item => <List.Item key={item.id}

                                                     actions={[<Link to={"/web/landingpagecontent/edit/"+item.id}>Edit</Link>,
                                                         <Popconfirm title="Are you sure delete this item?"
                                                                     onConfirm={() => that.deleteObject(item)} okText="Yes" cancelText="No">
                                                             <a>Delete</a>
                                                         </Popconfirm>]}
                                                     extra={<img src={makeFileURL(item.image)} style={{width:'300px'}}/>}>
                          <List.Item.Meta
                              avatar={<Avatar style={{ backgroundColor: '#87d068' }} >{item.rank}</Avatar>}
                              title={item.title}
                              description={<div dangerouslySetInnerHTML={{ __html: item.content }}/>}

                              
                          />
                      </List.Item>}/>
            </Card>
        </Switch>
        </div>
    }
}
