import React from "react";
import {Tag} from "antd";
import {BED_BOOKING_REPORTS, BED_PACKAGES} from "../../../constants/api";
import {getAPI} from "../../../utils/common";
import CustomizedTable from "../../common/CustomizedTable";
import moment from "moment";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";

export default class BedBookingReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: false,
            bedBookingReports: [],
            packages: [],

        };
        this.loadBedBookingReport = this.loadBedBookingReport.bind(this);
    }

    componentDidMount() {
        this.loadBedBookingReport();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate || this.props.bed_packages != newProps.bed_packages || this.props.payment_status != newProps.payment_status
            || this.props.type != newProps.type)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                that.loadBedBookingReport();
            })

    }

    loadBedBookingReport = (page = 1) => {
        let that = this;
        this.setState({
            loading: true
        })
        let successFn = function (data) {
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
        let apiParams = {
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
            page: page,
            practice: this.props.active_practiceId
        }
        if (this.props.payment_status) {
            apiParams.payment_status = this.props.payment_status
        }
        if (this.props.type) {
            apiParams.type = this.props.type
        }
        if (this.props.bed_packages) {
            apiParams.bed_packages = this.props.bed_packages.join(',');
        }
        getAPI(BED_BOOKING_REPORTS, successFn, errorFn, apiParams);
    };

    render() {
        let that = this;
        let i = 1;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            render: (item, record) => <span> {i++}</span>,
            export: (item, record) => {
                i++
            },
            width: 50
        }, {
            title: 'Patient Name',
            key: 'patient',
            dataIndex: 'patient',
            render:(patient)=>patient ? <span>{patient.user.first_name}&nbsp;({patient.custom_id})</span> : null
        },{
            title: 'Package Name',
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

        },
            // {
            //     title:'No Of Room',
            //     key:'room',
            //     dataIndex:'bed_package.room'
            // }

            {
                title: 'Total price',
                key: 'total_price',
                dataIndex: 'total_price',
                render: (value) => (<p>{value.toFixed(2)}</p>)

            }, {
                title: 'Payment Status',
                key: 'payment_status',
                dataIndex: 'payment_status'

            }];
        return <div><h2>Seat/Bed Booking Report
        </h2>
            <CustomizedTable hideReport={true} pagination={false} columns={columns}
                             dataSource={this.state.bedBookingReports}/>
            <InfiniteFeedLoaderButton
                loaderFunction={() => this.loadBedBookingReport(this.state.nextReport)}
                loading={this.state.loading}
                hidden={!this.state.nextReport}/>
        </div>
    }
}
