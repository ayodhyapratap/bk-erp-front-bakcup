import React from "react";
import {Button, Card, Icon, Table} from "antd";
import {getAPI} from "../../../utils/common";
import {INVENTORY_API} from "../../../constants/api";
import {Link, Route, Switch} from "react-router-dom";
import AddorEditInventoryItem from "./AddorEditInventoryItem";

export default class InventoryItemList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inventoryItemList: []
        }
        this.loadData = this.loadData.bind(this);
    }

    loadData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                inventoryItemList: data
            })
        }
        let errorFn = function () {
        }
        getAPI(INVENTORY_API, successFn, errorFn);
    }

    render() {
        return <div>
            <Switch>
                <Route path="/inventory/add" component={AddorEditInventoryItem}/>
                <Route>
                    <Card title="Inventory List"
                          extra={<Link to="/inventory/add"><Button><Icon type="plus"/> Add</Button></Link>}>
                        <Table dataSource={this.state.inventoryItemList}/>
                    </Card>
                </Route>
            </Switch>

        </div>
    }


}
