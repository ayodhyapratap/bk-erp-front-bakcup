import React from "react";
import {PATIENTS_REPORTS} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import moment from "moment"
import CustomizedTable from "../../common/CustomizedTable";
import {hideMobile} from "../../../utils/permissionUtils";

export default class MonthlyNewPatients extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            report: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,

        }
        this.report = this.report.bind(this);
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
        const columns = [{
            title: 'Date',
            key: 'date',
            render: (text, record) => (
                <span>
                {moment(record.created_at).format('LL')}
                  </span>
            ),
        }, {
            title: 'Scheduled At',
            key: 'time',
            render: (text, record) => (
                <span>
                  {moment(record.created_at).format('HH:mm')}
                  </span>
            ),
        }, {
            title: 'Name',
            dataIndex: 'patient.user.first_name',
            key: 'patient.user.first_name',
        }, {
            title: 'Patient Number',
            dataIndex: 'patient.user.mobile',
            key: 'patient.user.mobile',
            render: (value) => that.props.activePracticePermissions.PatientPhoneNumber ? value : hideMobile(value)
        },];

        return <div>
            <h2>Monthly New Patients Report (Total:{this.state.total})</h2>
            <CustomizedTable
                loading={this.state.loading}
                columns={columns}
                size={'small'}
                pagination={true}
                dataSource={this.state.report}/>


        </div>
    }
}
