import React from "react";
import {Button, Card, Icon, Layout} from "antd";
import {Route, Switch} from "react-router";
import {Link} from "react-router-dom";
import BedBookingForm from "./BedBookingForm";
import {BED_BOOKING_REPORTS} from "../../constants/api";
import {getAPI,interpolate} from "../../utils/common";
import CustomizedTable from "../common/CustomizedTable";
import moment from "moment";
const {Content} = Layout;

export default class BookingHome extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            loading: true,
            bedBookingReports:[],
        };
        this.loadBedBookingReport = this.loadBedBookingReport.bind(this);
    }
    componentDidMount() {
        this.loadBedBookingReport();
    }

    loadBedBookingReport = () => {
        let that = this;
        this.setState({
            loading:true
        })
        let successFn = function (data) {
            console.log(data);
            that.setState({
                bedBookingReports: data,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        getAPI(interpolate(BED_BOOKING_REPORTS, [this.props.active_practiceId]), successFn, errorFn);
    }
    render() {
        const columns = [{
            title:'Bed Package',
            key:'name',
            dataIndex:'bed_package.name'
        },
        // {
        //     title:'Medicine Package',
        //     key:'name',
        //     data:'medicine.name'
        // },
        {    
            title: 'From ',
            key: 'from_date',
            render: (text, record) => (
                <span>
                {moment(record.from_date).format('LL')}
                  </span>
            ),
        },{
            title: 'To ',
            key: 'to_date',
            render: (text, record) => (
                <span>
                {moment(record.to_date).format('LL')}
                  </span>
            ),
        },{
            title:'Seat/Bed Type',
            key:'seat_type',
            dataIndex:'seat_type'

        },{
            title:'Seat Number',
            key:'seat_no',
            dataIndex:'seat_no'

        },
        // {
        //     title:'No Of Room',
        //     key:'room',
        //     dataIndex:'bed_package.room'
        // },
        {
            title:'Total price',
            key:'total_price',
            dataIndex:'total_price',
            render:(value)=>(<p>{value.toFixed(2)}</p>)

        },{
            title:'Payment Status',
            key:'payment_status',
            dataIndex:'payment_status'

        }];

        return <Content className="main-container" style={{padding: 24, minHeight: 280,}}>
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
                                <CustomizedTable pagination={false} loading={this.state.loading} columns={columns} size={'small'}
                                        dataSource={this.state.bedBookingReports}/>
                            </Card>
                        </div>
                    </Route>
                </Switch>
            </Layout>
        </Content>
        
    }
}
