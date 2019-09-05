import React from "react";
import {hideMobile} from "../../../utils/permissionUtils";
import {getAPI, interpolate} from "../../../utils/common";
import {PATIENTS_REPORTS} from "../../../constants/api";
import {Table} from "antd";

export default class NewPatientReports extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            report:[],

        }
        this.loadNewPatient = this.loadNewPatient.bind(this);
    }
    componentDidMount() {
        if (this.props.type=='DETAILED'){
            this.loadNewPatient();
        }
    }
    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                if (that.props.type=='DETAILED'){
                    this.loadNewPatient();
                }
            })
    }
    loadNewPatient() {
        let that = this;

        let successFn = function (data) {
            that.setState({
                report: data.results,
                total:data.count,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams={
            type:that.props.type?that.props.type:'DETAILED',
        }
        if(this.state.startDate){
            apiParams.from_date=this.state.startDate.format('YYYY-MM-DD');
            apiParams.to_date= this.state.endDate.format('YYYY-MM-DD');
        }

        getAPI(interpolate(PATIENTS_REPORTS, [this.props.active_practiceId]), successFn, errorFn,apiParams);
    }
    render() {
        let that=this;
        let i = 1;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            render: (item, record) => <span> {i++}</span>,
            width: 50
        },{
            title: 'Patient Name',
            dataIndex: 'user.first_name',
            key: 'first_name',
        },{
            title:'Patient Number',
            dataIndex:'id',
            key:'id'
        }, {
            title: 'Patient Number',
            dataIndex: 'user.mobile',
            key: 'mobile',
            render: (value) => that.props.activePracticePermissions.PatientPhoneNumber ? value : hideMobile(value)
        },{
            title:'Email',
            key:'email',
            dataIndex:'user.email',
        }, {
            title: 'Gender',
            key: 'gender',
            dataIndex: 'gender',
        }];

        return <div>
            <h2>New Patients Report (Total:{that.props.total?that.props.total:this.state.total})</h2>
            <Table
                loading={that.props.loading?that.props.loading:this.state.loading}
                columns={columns}
                pagination={false}
                dataSource={that.props.report?that.props.report:this.state.report}/>


        </div>
    }
}
