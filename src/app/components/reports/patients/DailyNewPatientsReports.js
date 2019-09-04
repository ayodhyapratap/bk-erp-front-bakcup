import React from "react";
import {PATIENTS_REPORTS} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import moment from "moment"
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Label,Legend} from 'recharts';

export default class DailyNewPatientReports extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            report: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,

        }
        this.report = this.report.bind(this);
        this.report();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                that.report();
            })
    }

    report() {
        let that = this;
        that.setState({
            loading: true
        })
        let successFn = function (data) {
            that.setState({
                report: data.data,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams={

        }
        if(this.state.startDate){
            apiParams.start=this.state.startDate.format('YYYY-MM-DD');
            apiParams.end= this.state.endDate.format('YYYY-MM-DD');
        }
        if(this.props.filterReport){
            apiParams.filterReport=this.props.filterReport;
        }
        getAPI(interpolate(PATIENTS_REPORTS, [this.props.active_practiceId]), successFn, errorFn,apiParams);
    }
    render() {
        let that=this;

        const data = [
            {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
            {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
            {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
            {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
            {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
            {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
            {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
            {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
            {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
        ];
        return <div>
            <h2>Daily New Patients Report</h2>
            <LineChart width={1000} height={300} data={data}
                       margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <XAxis dataKey="name">
                    <Label value="Data Range" offset={0} margin={{top:10}} position="insideBottom" />
                </XAxis>
                <YAxis label={{ value: 'Total Patients', angle: -90, position: 'insideLeft' }} />

                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Line type="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={4}/>
            </LineChart>

        </div>
    }
}
