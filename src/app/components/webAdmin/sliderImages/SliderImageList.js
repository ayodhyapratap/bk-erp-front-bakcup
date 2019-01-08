import {Avatar, Button, Card, Icon, List, Popconfirm} from "antd";
import React from "react";
import {getAPI, interpolate, patchAPI} from "../../../utils/common";
import {BLOG_PAGE_SEO, BLOG_POST, BLOG_SLIDER, SINGLE_LANDING_PAGE_VIDEO, SINGLE_SLIDER} from "../../../constants/api";
import {Route, Switch} from "react-router";
import AddSliderImage from "./AddSliderImage";
import {Link} from "react-router-dom";

export default class SliderImageList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            slider: []
        };
        this.loadData = this.loadData.bind(this);
        this.deleteObject = this.deleteObject.bind(this)
    }

    componentWillMount() {
        this.loadData();
    }

    loadData() {
        let that = this;
        let successFn = function (data) {
            console.log(data);
            that.setState({
                slider: data
            })
        }
        let errorFn = function () {

        }
        getAPI(BLOG_SLIDER, successFn, errorFn);
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
        patchAPI(interpolate(SINGLE_SLIDER, [record.id]), reqData, successFn, errorFn)
    }

    render() {
        let that = this;
        return <div><Switch>
            <Route exact path='/web/slider-image/add'
                   render={(route) => <AddSliderImage {...this.state} {...route} loadData={this.loadData}/>}/>
            <Route exact path='/web/slider-image/edit/:id'
                   render={(route) => <AddSliderImage {...this.state} {...route} loadData={this.loadData}/>}/>
            <Card title="Slider Image" extra={<Link to={"/web/slider-image/add"}>
                <Button type="primary">
                    <Icon type="plus"/> Add
                </Button>
            </Link>}>
                <List itemLayout="vertical" dataSource={this.state.slider} renderItem={item =>
                    <List.Item key={item.id}
                               extra={<img src={item.silder_image}
                                           alt=""
                                           style={{
                                               maxWidth: '100%',
                                               width: '400px'
                                           }}
                               />}
                               actions={[<Link to={'/web/slider-image/edit/' + item.id}>Edit</Link>,
                                   <Popconfirm title="Are you sure delete this item?"
                                               onConfirm={() => that.deleteObject(item)} okText="Yes" cancelText="No">
                                       <a>Delete</a>
                                   </Popconfirm>]}>
                        <List.Item.Meta
                            avatar={<Avatar>{item.rank}</Avatar>}
                            title={item.title}
                            description={item.name}
                        />
                    </List.Item>}/>
            </Card>
        </Switch>
        </div>
    }
}
