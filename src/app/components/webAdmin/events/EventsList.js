import {Button, Card, Divider, Icon, List, Table} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import {BLOG_EVENTS, BLOG_POST} from "../../../constants/api";
import {Route, Switch} from "react-router";
import {Link} from "react-router-dom";
import AddEvent from "./AddEvent";
import moment from "moment";

export default class DiseaseList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: null
        };
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                events:data
            })
        }
        let errorFn = function () {

        }
        getAPI(BLOG_EVENTS, successFn, errorFn);
    }

    render() {
        let coloumns = [{
            title: 'Event Title',
            dataIndex: 'title',
            key: 'event_title'
        },{
            title:'Date',
            // dataIndex:'posted_on',
            key:'post_date',
            render:(item)=>{
                return moment(item).format('LLL');
            }
        },{
            title:'Actions',
            render:(item)=>{
                return <div>
                    <Link to={"/web/event/edit/"+item.id}>Edit</Link>
                    <Divider type="vertical"/>
                    <a >Delete</a>
                </div>
            }
        }];
        return <div><Switch>
            <Route exact path='/web/event/add'
                   render={(route) => <AddEvent {...this.state} {...route}/>}/>
            <Route exact path='/web/event/edit/:id'
                   render={(route) => <AddEvent {...this.state} {...route}/>}/>
            <Card title="Events"
                  extra={<Link to={"/web/event/add"}><Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
                <Table dataSource={this.state.events} columns={coloumns}/>
            </Card>
        </Switch>
        </div>
    }
}
