import React from "react";
import {Table, Divider, Statistic, Empty, Spin} from "antd";
import {EMR_REPORTS} from "../../../constants/api";
import {getAPI, interpolate} from "../../../utils/common";
import moment from "moment";
import {ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart} from 'recharts';
import CustomizedTable from "../../common/CustomizedTable";

export default class MonthlyTreatmentCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treatmentMonthly: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true
        }
        this.loadTreatmentMonthly = this.loadTreatmentMonthly.bind(this);
    }
    componentDidMount() {
        this.loadTreatmentMonthly();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.doctors!=newProps.doctors ||this.props.is_complete!=newProps.is_complete)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadTreatmentMonthly();
            })

    }

    loadTreatmentMonthly = () => {
        let that = this;

        let successFn = function (data) {
            that.setState({
                treatmentMonthly: data.data.reverse(),
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
            type:that.props.type,
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
            is_complete:this.props.is_complete?true:false,
        };
        if(this.props.doctors){
            apiParams.doctors=this.props.doctors.toString();
        }
        getAPI(interpolate(EMR_REPORTS, [that.props.active_practiceId]), successFn, errorFn, apiParams);
    };

    render() {
        let i=1;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            render: (item, record) => <span> {i++}</span>,
            width: 50
        },{
            title: 'Month',
            key: 'date',
            render: (text, record) => (
                <span>
                {moment(record.date).format('MMMM YYYY')}
                  </span>
            ),
        },{
            title:'Total Treatments',
            key:'count',
            dataIndex:'count'
        }];

        const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
            return <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>{value}</text>;
        };
        return <div>
            <h2>Monthly Treatments Count
                {/*<Button.Group style={{float: 'right'}}>*/}
                {/*<Button><Icon type="mail"/> Mail</Button>*/}
                {/*<Button><Icon type="printer"/> Print</Button>*/}
                {/*</Button.Group>*/}
            </h2>
            <Spin size="large" spinning={this.state.loading}>
                {this.state.treatmentMonthly.length>0?
                <ComposedChart width={1000} height={400} data={this.state.treatmentMonthly}
                               margin={{top: 20, right: 20, bottom: 20, left: 20}}>


                    <XAxis dataKey="date" tickFormatter={(value) => {
                        return moment(value).format('MMM YY')
                    }} />
                    <YAxis />
                    <Tooltip />
                    {/*<Legend />*/}
                    <Bar dataKey='count' barSize={35} fill='#0059b3' stroke="#0059b3" label={renderCustomBarLabel}/>
                </ComposedChart>:<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data to Show"/>}
            </Spin>

            <Divider><Statistic title="Total" value={this.state.total} /></Divider>
            <CustomizedTable loading={this.state.loading} columns={columns}  dataSource={this.state.treatmentMonthly}/>

        </div>
    }
}
