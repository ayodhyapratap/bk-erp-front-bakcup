import {Button, Card, Icon, List} from "antd";
import React from "react";

export default class BlogList extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <Card title="Blog" extra={<Button type="primary"><Icon type="plus"/> Add</Button>}>
            <List/>
        </Card>
    }
}
