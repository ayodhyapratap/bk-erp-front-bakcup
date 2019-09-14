import React from "react";
import {Divider, Statistic, Spin,Empty} from "antd";
import {PATIENTS_REPORTS} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import moment, {relativeTimeThreshold} from "moment"
import {ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend}  from 'recharts';
import CustomizedTable from "../../common/CustomizedTable";

export default class MonthlyNewPatients extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            report: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,

        }
        this.loadMonthlyPatients = this.loadMonthlyPatients.bind(this);
    }
    componentDidMount() {
        this.loadMonthlyPatients();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.patient_groups !=newProps.patient_groups
            ||this.props.blood_group !=newProps.blood_group || this.props.offer !=newProps.offer)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                that.loadMonthlyPatients();
            })
    }

    loadMonthlyPatients() {
        let that = this;
        that.setState({
            loading: true
        })
        let successFn = function (data) {
            that.setState({
                report:data.data.reverse(),
                total:data.total,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams={
            from_date: this.props.startDate.format('YYYY-MM-DD'),
            to_date: this.props.endDate.format('YYYY-MM-DD'),
            type:this.props.type,
        };
        if (this.props.patient_groups){
            apiParams.groups=this.props.patient_groups.toString();
        };
        getAPI(PATIENTS_REPORTS,  successFn, errorFn,apiParams);
    }
    render() {
        let that=this;
        let i = 1;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            dataIndex:'sno',
            render: (item, record) => <span> {i++}</span>,
            export:(item,record,index)=>index+1,
            width: 50
        },{
            title: "Month",
            key:'month',
            render:((item, record) => <span>{moment(record.month).format('MMM')} &nbsp;{moment(record.year).format('YYYY')}</span>),
            export:(item,record)=> (moment(record.month).format('MMM YYYY')),
        },{
            title:'Patients',
            key:'count',
            dataIndex:'count'
        }];
        const CustomizedAxisTick = (x, y, value)=>({
            render () {
                // const {x, y, stroke, payload} = this.props;

                return (
                    <g transform={`translate(${x},${y})`}>
                        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{moment(value).format('MMM')}</text>
                    </g>
                );
            }
        });
        const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
            return <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>{value}</text>;
        };
        return <div>
            <h2>Monthly New Patients Report</h2>
            <Spin size="large" spinning={this.state.loading}>
                {this.state.report.length>0?
                <ComposedChart width={1000} height={400} data={this.state.report}
                               margin={{top: 20, right: 20, bottom: 20, left: 20}}>


                    <XAxis dataKey="date" tickFormatter={(value) => {
                        return moment(value).format('MMM YYYY')
                    }} />
                    <YAxis />
                    <Tooltip />
                    {/*<Legend />*/}
                    <Bar dataKey='count' barSize={35} fill='#413ea0' label={renderCustomBarLabel}/>
                </ComposedChart>:<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data to Show"/>}
            </Spin>

            <Divider><Statistic title="Total Patients" value={this.state.total} /></Divider>
            <CustomizedTable
                loading={this.state.loading}
                columns={columns}
                dataSource={this.state.report}/>


        </div>
    }
}
