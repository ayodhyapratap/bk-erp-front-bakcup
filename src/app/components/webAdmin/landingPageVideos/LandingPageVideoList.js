import {Avatar, Button, Card, Icon, List} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import {BLOG_POST, BLOG_VIDEOS, LANDING_PAGE_VIDEO} from "../../../constants/api";
import {Route, Switch} from "react-router";
import {Link} from "react-router-dom";
import AddLandingPageVideo from "./AddLandingPageVideo";
import YouTube from 'react-youtube';

export default class LandingPageVideoList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            videos:[]
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
                videos:data
            })
        }
        let errorFn = function () {

        }
        getAPI(LANDING_PAGE_VIDEO ,successFn, errorFn);
    }
    render(){
        const opts = {
            height: '200',
            width: '300',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1
            }
        };
        let _onReady = function(event) {
            // access to player in all event handlers via event.target
            event.target.pauseVideo();
        }
        return<div><Switch>
            <Route exact path='/web/landingpagevideo/add'
                   render={(route) => <AddLandingPageVideo {...this.state} {...route}/>}/>
            <Route exact path='/web/landingpagevideo/edit/:id'
                   render={(route) => <AddLandingPageVideo {...this.state} {...route}/>}/>
            <Card title="Disease" extra={<Link to={"/web/landingpagevideo/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
                <List dataSource={this.state.videos}
                      itemLayout="vertical"
                      renderItem={item => <List.Item key={item.id}

                                                     actions={[<Link to={"/web/videos/edit/"+item.id}>Edit</Link>,
                                                         <a >Delete</a>]}
                                                     extra={<YouTube videoId={item.link}
                                                                     opts={opts}
                                                                     onReady={_onReady}/>}>
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
