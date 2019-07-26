import React from "react";
import {Button, Card, Icon, Layout, Tag} from "antd";
import {Route, Switch} from "react-router";
import {Link} from "react-router-dom";
import BedBookingForm from "./BedBookingForm";
import {BED_BOOKING_REPORTS} from "../../../constants/api";
import {getAPI, interpolate} from "../../../utils/common";
import CustomizedTable from "../../common/CustomizedTable";
import moment from "moment";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";

const {Content} = Layout;

export default class BookingHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            bedBookingReports: [],
            patient: this.props.currentPatient || {}
        };
        this.loadBedBookingReport = this.loadBedBookingReport.bind(this);
    }

    componentDidMount() {
        this.loadBedBookingReport();
    }

    loadBedBookingReport = (page = 1) => {
        let that = this;
        this.setState({
            loading: true
        })
        let successFn = function (data) {
            console.log(data);
            if (data.current == 1)
                that.setState({
                    bedBookingReports: data.results,
                    loading: false,
                    nextReport: data.next
                });
            else
                that.setState(function (prevState) {
                        return {
                            bedBookingReports: [...prevState.bedBookingReports, ...data.results],
                            loading: false,
                            nextReport: data.next
                        }
                    }
                );
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        getAPI(interpolate(BED_BOOKING_REPORTS, [this.props.active_practiceId]), successFn, errorFn, {
            page: page,
            patients: this.state.patient.id
        });
    }

    render() {
        const columns = [{
            title: 'Bed Package',
            key: 'name',
            dataIndex: 'bed_package.name'
        }, {
            title: 'Medicine Package',
            key: 'medicine',
            dataIndex: 'medicines',
            render: (text, record) => <span>{text.map((item) =>
                <Tag>{item.name}</Tag>
            )}</span>
        }, {
            title: 'From ',
            key: 'from_date',
            render: (text, record) => (
                <span>
                {moment(record.from_date).format('LL')}
                  </span>
            ),
        }, {
            title: 'To ',
            key: 'to_date',
            render: (text, record) => (
                <span>
                {moment(record.to_date).format('LL')}
                  </span>
            ),
        }, {
            title: 'Seat/Bed Type',
            key: 'seat_type',
            dataIndex: 'seat_type'

        }, {
            title: 'Seat Number',
            key: 'seat_no',
            dataIndex: 'seat_no'

        }, {
            title: 'Total price',
            key: 'total_price',
            dataIndex: 'total_price',
            render: (value) => (<p>{value.toFixed(2)}</p>)

        }, {
            title: 'Payment Status',
            key: 'payment_status',
            dataIndex: 'payment_status'

        }];

        return <Content className="main-container" style={{minHeight: 280,}}>
            <Layout>
                <Switch>
                    <Route path={"/patient/:patient/booking/bed-booking"}
                           render={() => <BedBookingForm {...this.props} bedBooking={true}
                                                         loadData={this.loadBedBookingReport}/>}/>

                    <Route>
                        <div>
                            <h2>Bed Booking Management
                                <Link to={"/patient/" + this.state.patient.id + "/booking/bed-booking"}>
                                    <Button type="primary" style={{float: 'right'}}>
                                        <Icon type="plus"/>&nbsp;Book A Seat
                                    </Button>
                                </Link>
                            </h2>
                            <Card>
                                <CustomizedTable pagination={false} hideReport={true}
                                                 loading={this.state.loading}
                                                 columns={columns} size={'small'}
                                                 dataSource={this.state.bedBookingReports}/>
                                <InfiniteFeedLoaderButton
                                    loaderFunction={() => this.loadBedBookingReport(this.state.nextReport)}
                                    loading={this.state.loading}
                                    hidden={!this.state.nextReport}/>
                            </Card>
                        </div>
                    </Route>
                </Switch>
            </Layout>
        </Content>

    }
}
