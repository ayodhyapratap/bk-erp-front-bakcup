import {Avatar, Button, Card, Icon, List, Popconfirm} from "antd";
import React from "react";
import {getAPI, interpolate, patchAPI, postAPI} from "../../../utils/common";
import {
    BLOG_POST,
    BLOG_VIDEOS,
    LANDING_PAGE_VIDEO,
    SINGLE_LANDING_PAGE_CONTENT,
    SINGLE_LANDING_PAGE_VIDEO
} from "../../../constants/api";
import {Route, Switch} from "react-router";
import {Link} from "react-router-dom";
import AddLandingPageVideo from "./AddLandingPageVideo";
import YouTube from 'react-youtube';

export default class LandingPageVideoList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            videos:[],
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
                videos:data,
                loading:false
            })
        }
        let errorFn = function () {
          that.setState({
            loading:false
          })

        }
        getAPI(LANDING_PAGE_VIDEO ,successFn, errorFn);
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
        patchAPI(interpolate(SINGLE_LANDING_PAGE_VIDEO, [record.id]), reqData, successFn, errorFn)
    }
    render(){
        let that = this;
        const opts = {
            height: '200',
            width: '300',
            // playerVars: { // https://developers.google.com/youtube/player_parameters
            //     autoplay: 1
            // }
        };
        return<div><Switch>
            <Route exact path='/web/landingpagevideo/add'
                   render={(route) => <AddLandingPageVideo {...this.state} loadData={this.loadData} {...route}/>}/>
            <Route exact path='/web/landingpagevideo/edit/:id'
                   render={(route) => <AddLandingPageVideo {...this.state} loadData={this.loadData} {...route}/>}/>
            <Card title="Landing Page Video" extra={<Link to={"/web/landingpagevideo/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
                <List loading={this.state.loading} dataSource={this.state.videos}
                      itemLayout="vertical"
                      renderItem={item => <List.Item key={item.id}

                                                     actions={[<Link to={"/web/landingpagevideo/edit/"+item.id}>Edit</Link>,
                                                         <Popconfirm title="Are you sure delete this item?"
                                                                     onConfirm={() => that.deleteObject(item)} okText="Yes" cancelText="No">
                                                             <a>Delete</a>
                                                         </Popconfirm>]}
                                                     extra={<YouTube videoId={item.link}
                                                                     opts={opts}/>}>
                          <List.Item.Meta
                              avatar={<Avatar style={{ backgroundColor: '#87d068' }} >{item.rank}</Avatar>}
                              title={item.name}
                          />
                      </List.Item>}/>
            </Card>
        </Switch>
        </div>
    }
}
