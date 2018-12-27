import {Avatar, Button, Card, Icon, List} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import {BLOG_POST, BLOG_VIDEOS, LANDING_PAGE_CONTENT, LANDING_PAGE_VIDEO} from "../../../constants/api";
import {Route, Switch} from "react-router";
import {Link} from "react-router-dom";
import AddLandingPageContent from "./AddLandingPageContent";

export default class LandingPageContentList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            pageContent:[]
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
                pageContent:data
            })
        }
        let errorFn = function () {

        }
        getAPI(LANDING_PAGE_CONTENT ,successFn, errorFn);
    }
    render(){
        return<div><Switch>
            <Route exact path='/web/landingpagecontent/add'
                   render={(route) => <AddLandingPageContent {...this.state} {...route}/>}/>
            <Route exact path='/web/landingpagecontent/edit/:id'
                   render={(route) => <AddLandingPageContent {...this.state} {...route}/>}/>
            <Card title="Landing Page Content" extra={<Link to={"/web/landingpagecontent/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
                <List dataSource={this.state.pageContent}
                      itemLayout="vertical"
                      renderItem={item => <List.Item key={item.id}

                                                     actions={[<Link to={"/web/landingpagecontent/edit/"+item.id}>Edit</Link>,
                                                         <a >Delete</a>]}
                                                     extra={<img src={item.image} style={{width:'300px'}}/>}>
                          <List.Item.Meta
                              avatar={<Avatar style={{ backgroundColor: '#87d068' }} >{item.rank}</Avatar>}
                              title={item.title}
                              description={item.content}
                          />
                      </List.Item>}/>
            </Card>
        </Switch>
        </div>
    }
}
