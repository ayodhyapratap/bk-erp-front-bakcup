import {Avatar, Button, Card, Icon, List, Popconfirm} from "antd";
import React from "react";
import {getAPI, interpolate, patchAPI, postAPI} from "../../../utils/common";
import {BLOG_POST, BLOG_VIDEOS, SINGLE_CONTACT, SINGLE_VIDEO} from "../../../constants/api";
import {Route, Switch} from "react-router";
import {Link} from "react-router-dom";
import AddVideo from "./AddVideo";
import YouTube from 'react-youtube';

export default class VideosList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videos: []
        };
        this.loadData = this.loadData.bind(this);
        this.deleteObject = this.deleteObject.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                videos: data
            })
        }
        let errorFn = function () {

        }
        getAPI(BLOG_VIDEOS, successFn, errorFn);
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
        patchAPI(interpolate(SINGLE_VIDEO, [record.id]), reqData, successFn, errorFn)
    }

    render() {
        let that = this;
        const opts = {
            height: '200',
            width: '300',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                // autoplay: 1
            }
        };
        let _onReady = function (event) {
            // access to player in all event handlers via event.target
            // event.target.pauseVideo();
        }
        return <div><Switch>
            <Route exact path='/web/videos/add'
                   render={(route) => <AddVideo {...this.state} {...route} loadData={this.loadData}/>}/>
            <Route exact path='/web/videos/edit/:id'
                   render={(route) => <AddVideo {...this.state} {...route} loadData={this.loadData}/>}/>
            <Card title="Videos"
                  extra={<Link to={"/web/videos/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
                <List dataSource={this.state.videos}
                      itemLayout="vertical"
                      renderItem={item => <List.Item key={item.id}
                                                     actions={[<Link to={"/web/videos/edit/" + item.id}>Edit</Link>,
                                                         <Popconfirm title="Are you sure delete this item?"
                                                                     onConfirm={() => that.deleteObject(item)}
                                                                     okText="Yes" cancelText="No">
                                                             <a>Delete</a>
                                                         </Popconfirm>]}
                                                     extra={<YouTube videoId={item.link}
                                                                     opts={opts}
                                                                     onReady={_onReady}/>}>
                          <List.Item.Meta
                              avatar={<Avatar style={{backgroundColor: '#87d068'}}>{item.rank}</Avatar>}
                              title={item.name}
                          />
                      </List.Item>}/>
            </Card>
        </Switch>
        </div>
    }
}
