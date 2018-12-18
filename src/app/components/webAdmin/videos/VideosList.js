import {Button, Card, Icon, List} from "antd";
import React from "react";

export default class VideosList extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <Card title="Videos" extra={<Button type="primary"><Icon type="plus"/> Add</Button>}>
            <List/>
        </Card>
    }
}
