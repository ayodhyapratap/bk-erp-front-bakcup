import React from "react";
import {hideEmail, hideMobile} from "../../../utils/permissionUtils";
import {getAPI, interpolate} from "../../../utils/common";
import {PATIENTS_REPORTS} from "../../../constants/api";
import {Table} from "antd";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";

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
    loadNewPatient(page=1) {
        let that = this;

        let successFn = function (data) {
            that.setState(function (prevState) {
                if (data.current == 1) {
                    return {
                        report: [...data.results],
                        next: data.next,
                        total:data.count,
                        loading: false
                    }
                }

            })
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams={
            page: page,
            type:that.props.type?that.props.type:'DETAILED',
        }
        if(this.state.startDate){
            apiParams.from_date=this.state.startDate.format('YYYY-MM-DD');
            apiParams.to_date= this.state.endDate.format('YYYY-MM-DD');
        }

        getAPI(PATIENTS_REPORTS,  successFn, errorFn,apiParams);
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
            key: 'mobile',
            render: (value) => that.props.activePracticePermissions.PatientPhoneNumber ? value : hideMobile(value)
        },{
            title:'Email',
            key:'email',
            render:(value)=>that.props.activePracticePermissions.PatientEmailId ? value : hideEmail(value)
        }, {
            title: 'Gender',
            key: 'gender',
            dataIndex: 'gender',
        }];
        return <div>

            {this.state.report?<>
                <h2>New Patients Report (Total:{this.state.total})</h2>
                <Table
                    loading={this.state.loading}
                    columns={columns}
                    pagination={false}
                    dataSource={this.state.report}/>

                <InfiniteFeedLoaderButton loaderFunction={() => this.loadNewPatient(that.state.next)}
                                          loading={this.state.loading}
                                          hidden={!this.state.next}/>

            </>:<>
                <h2>New Patients Report (Total:{that.props.total})</h2>
                <Table
                    loading={that.props.loading}
                    columns={columns}
                    pagination={false}
                    dataSource={that.props.report}/>

                <InfiniteFeedLoaderButton loaderFunction={() => that.props.loadNewPatient(that.props.next)}
                                          loading={that.props.loading}
                                          hidden={!that.props.next}/>
                </>}

        </div>
    }
}
