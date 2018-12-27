import {Button, Card, Divider, Icon, List, Row, Table, Upload} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import {LAB_API, VENDOR_API} from "../../../constants/api";
import {Route, Switch} from "react-router";
import AddLab from "./AddLab";
import {Link} from "react-router-dom";

export default class LabList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            active_practiceId:this.props.active_practiceId,
            lab:null
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
                lab:data
            })
        }
        let errorFn = function () {

        }
        getAPI(LAB_API ,successFn, errorFn);
    }
    render(){
        return<div><Switch>
                <Route exact path='/inventory/lab/add'
                   render={(route) => <AddLab {...this.state} {...route}/>}/>
            <Route exact path='/inventory/expenses/lab/:id'
                   render={(route) => <AddLab {...this.state} {...route}/>}/>
            <Card title="Lab" extra={<Link to={"/inventory/lab/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>

            </Card>
        </Switch>
        </div>
    }
}
