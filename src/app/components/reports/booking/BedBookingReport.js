import React from "react";
import {Card,Table} from "antd";
import {BED_BOOKING_REPORTS} from "../../../constants/api";
import {getAPI,interpolate} from "../../../utils/common";
import CustomizedTable from "../../common/CustomizedTable";
import moment from "moment";

export default class BedBookingReport extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,
            bedBookingReports:[],
        };
        this.loadBedBookingReport = this.loadBedBookingReport.bind(this);
    }

    componentDidMount() {
        this.loadBedBookingReport();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadBedBookingReport();
            })

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
        getAPI(interpolate(BED_BOOKING_REPORTS, [this.props.active_practiceId]), successFn, errorFn, {
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD')
        });
    }
    render() {
        const columns = [{
            title:'Package Name',
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
        // }
        
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
        return <div><h2>Seat/Bed Booking Report
        </h2>
            <Card>
                <CustomizedTable pagination={false} loading={this.state.loading} columns={columns} size={'small'}
                        dataSource={this.state.bedBookingReports}/>
            </Card>
        </div>
    }
}
