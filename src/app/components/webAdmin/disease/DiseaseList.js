import {Button, Card, Divider, Icon, List, Table} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import {BLOG_DISEASE} from "../../../constants/api";
import {Route, Switch} from "react-router";
import AddDisease from "./AddDisease";
import {Link} from "react-router-dom";

export default class DiseaseList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disease: null
        };
        this.loadDiseases = this.loadDiseases.bind(this);
    }

    componentDidMount() {
        this.loadDiseases();
    }

    loadDiseases() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                disease: data
            })
        }
        let errorFn = function () {

        }
        getAPI(BLOG_DISEASE, successFn, errorFn);
    }

    render() {
        let coloumns = [{
            title: 'Disease Name',
            dataIndex: 'disease_name',
            key: 'disease_name'
        },{
            title:'Disease Type',
            dataIndex:'disease_type',
            key:'disease_type'
        },{
            title:'Actions',
            render:(item)=>{
                return <div>
                    <Link to={"/web/disease/edit/"+item.id}>Edit</Link>
                    <Divider type="vertical"/>
                    <a >Delete</a>
                </div>
            }
        }];
        return <div><Switch>
            <Route exact path='/web/disease/add'
                   render={(route) => <AddDisease{...this.state} {...route}/>}/>
            <Route exact path='/web/disease/edit/:id'
                   render={(route) => <AddDisease{...this.state} {...route}/>}/>
            <Card title="Disease"
                  extra={<Link to={"/web/disease/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>
                <Table columns={coloumns} dataSource={this.state.disease}/>

            </Card>
        </Switch>
        </div>
    }
}
