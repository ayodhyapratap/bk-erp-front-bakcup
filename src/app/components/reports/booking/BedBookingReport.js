import React from "react";
import {Card, Tag,Button,Form,Checkbox,Select,Input} from "antd";
import {BED_BOOKING_REPORTS,BED_PACKAGES} from "../../../constants/api";
import {getAPI ,interpolate} from "../../../utils/common";
import CustomizedTable from "../../common/CustomizedTable";
import moment from "moment";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";
import {PAYMENT_STATUS,OPD_IPD } from "../../../constants/hardData"

class BedBookingReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,
            bedBookingReports: [],
            packages: [],

        };
        this.loadBedBookingReport = this.loadBedBookingReport.bind(this);
        // this.filterReport =this.filterReport.bind(this);
        
    }

    componentDidMount() {
        this.loadBedBookingReport();
        this.loadPackages();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                that.loadBedBookingReport();
            })

    }
    loadPackages = () => {
        let that = this;
        let successFn = function (data) {
            that.setState({
                packages: data
            })
        }
        let errorFn = function () {
        }
        getAPI(interpolate(BED_PACKAGES, [this.props.active_practiceId]), successFn, errorFn);

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
        let apiParams={
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
            page: page,
            practice: this.props.active_practiceId
        }
        if(this.state.payment_status){
            apiParams.payment_status=this.state.payment_status
        }
        if(this.state.type){
            apiParams.type =this.state.type
        }
        if(this.state.bed_packages){
            
            apiParams.bed_packages=this.state.bed_packages.join()
        }
        getAPI(BED_BOOKING_REPORTS, successFn, errorFn, apiParams);
    }
    filterReport(type ,value){
      this.setState(function(prevState){
        return {[type]: value}
      },function(){
        this.loadBedBookingReport();
      });
    }
    filterBedPackages(type ,value){
        this.setState(function(prevState){
            let bed_packages={};
            return {bed_packages:value}
        },function(){
            this.loadBedBookingReport();
        });
    }
    render() {
        console.log("state",this.state)
        const {getFieldDecorator} =this.props.form;
        let that=this;
        const columns = [{
            title: 'Package Name',
            key: 'name',
            dataIndex: 'bed_package.name'
        },
            {
                title: 'Medicine Package',
                key: 'medicine',
                dataIndex: 'medicines',
                render: (text, record) => <span>{text.map((item) =>
                    <Tag>{item.name}</Tag>
                )}</span>
            },
            {
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
            <Card bodyStyle={{padding:0}} 
                extra={<div>
                    <Form layout="inline">
                        <Form.Item label="Payment Status">
                            <Select placeholder="Payment Status" style={{minWidth:150}}  onChange={(value)=> that.filterReport("payment_status",value)}>
                                {PAYMENT_STATUS.map(option => <Select.Option value={option.value}>{option.label}</Select.Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Type">
                            <Select style={{minWidth:150}} onChange={(value) =>this.filterReport("type",value)}>
                                {OPD_IPD.map(option =><Select.Option value={option.value}>{option.label}</Select.Option> )}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Bed Package">
                            <Select style={{minWidth:150}} onChange={(value) =>this.filterBedPackages('bed_packages' ,value)} mode="multiple">
                                {that.state.packages.map(option => <Select.Option value={option.id}>{option.name}</Select.Option>)}
                            </Select>
                        </Form.Item>


                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{margin: 5}}>
                            Submit
                        </Button>
                    </Form.Item>
                    </Form>
                </div>}>
                <CustomizedTable pagination={false} loading={this.state.loading} columns={columns} size={'small'}
                                 dataSource={this.state.bedBookingReports}/>
                <InfiniteFeedLoaderButton
                    loaderFunction={() => this.loadBedBookingReport(this.state.nextReport)}
                    loading={this.state.loading}
                    hidden={!this.state.nextReport}/>
            </Card>
        </div>
    }
}
export default Form.create()(BedBookingReport)