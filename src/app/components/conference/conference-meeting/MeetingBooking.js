import React from "react";
import {Button, Card, Icon, Table} from "antd";
import {Route, Switch} from "react-router";
import AddOrEditMeeting from "./AddOrEditMeeting";
import {Link} from "react-router-dom";

export default class MeetingBooking extends React.Component{
    constructor(props){
        super(props);
        this.state={

        }
    }

    render() {
        return(
            <div>
                <Switch>
                    <Route exact path='/meeting-booking/add'
                           render={(route) => <AddOrEditMeeting {...this.state} {...route} loadData={this.loadData}/>}/>

                    <Route exact path={"/meeting-booking/edit/:id"} render={(route)=><AddOrEditMeeting  {...route} {...this.props} {...this.state}/>}/>

                    <Card title="Meeting Booking" extra={
                        <Link to="/meeting-booking/add" ><Button type="primary"><Icon type="plus"/> Add Booking</Button></Link>
                    }>


                        {/*<Table title={"xyz"}/>*/}
                    </Card>
                </Switch>
            </div>
        )
    }
}