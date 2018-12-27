import {Button, Card, Divider, Icon, List, Row, Table, Upload} from "antd";
import React from "react";
import {getAPI} from "../../../utils/common";
import {manufacture_API, MANUFACTURER_API} from "../../../constants/api";
import {Route, Switch} from "react-router";
import AddManufacture from "./AddManufacture";
import {Link} from "react-router-dom";

export default class ManufactureList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            active_practiceId:this.props.active_practiceId,
            manufactures:null
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
                manufactures:data
            })
        }
        let errorFn = function () {

        }
        getAPI(MANUFACTURER_API ,successFn, errorFn);
    }
    render(){
        return<div><Switch>
                <Route exact path='/inventory/manufacture/add'
                   render={(route) => <AddManufacture {...this.state} {...route}/>}/>
            <Route exact path='/inventory/manufacture/edit/:id'
                   render={(route) => <AddManufacture {...this.state} {...route}/>}/>
            <Card title="manufactures" extra={<Link to={"/inventory/manufacture/add"}> <Button type="primary"><Icon type="plus"/> Add</Button></Link>}>

            </Card>
        </Switch>
        </div>
    }
}
