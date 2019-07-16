import React from "react";
import {Button, Card, Icon, Layout} from "antd";
import {Route, Switch} from "react-router";
import {Link} from "react-router-dom";
import BedBookingForm from "./BedBookingForm";

const {Content} = Layout;

export default class BookingHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return <Content className="main-container" style={{
            // margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            // marginLeft: '200px'
        }}>
            <Layout>
                <Switch>


                    <Route path={"/booking/bed-booking"} render={() => <BedBookingForm {...this.props}/>}/>
                    <Route>
                        <div>
                            <h2>Bed Booking Management
                                <Link to="/booking/bed-booking">
                                    <Button type="primary" style={{float: 'right'}}>
                                        <Icon type="plus"/>&nbsp;Book A Seat
                                    </Button>
                                </Link>
                            </h2>
                            <Card>

                            </Card>
                        </div>
                    </Route>
                </Switch>
            </Layout>
        </Content>
    }
}
