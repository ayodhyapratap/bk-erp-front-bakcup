import {Button, Card, Icon, List} from "antd";
import React from "react";

export default class EventsList extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <Card title="Events" extra={<Button type="primary"><Icon type="plus"/> Add</Button>}>
            <List/>
        </Card>
    }
}
