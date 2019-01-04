import {Button, Card, Icon, List} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import {BLOG_PAGE_SEO, BLOG_POST, BLOG_SLIDER} from "../../../constants/api";
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

    render() {
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
                <List dataSource={this.state.slider}/>
            </Card>
        </Switch>
        </div>
    }
}
