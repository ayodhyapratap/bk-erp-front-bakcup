import React from "react";
import {hideEmail, hideMobile} from "../../../utils/permissionUtils";
import {getAPI, interpolate} from "../../../utils/common";
import {PATIENTS_REPORTS} from "../../../constants/api";
import {Col, Row, Statistic, Table} from "antd";
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";
import CustomizedTable from "../../common/CustomizedTable";

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
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.patient_groups !=newProps.patient_groups
            ||this.props.blood_group !=newProps.blood_group || this.props.blood_group !=newProps.blood_group)
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
               report:data,
           })
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams={
            type:that.props.type?that.props.type:'DETAILED',
            blood_group:that.props.blood_group,
        };
        if (this.props.patient_groups){
            apiParams.groups=this.props.patient_groups.toString();
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
            title: 'Mobile Number',
            key: 'user.mobile',
            dataIndex:'user.mobile',
            render: (value) => that.props.activePracticePermissions.PatientPhoneNumber ? value : hideMobile(value)
        },{
            title:'Email',
            key:'user.email',
            dataIndex:'user.email',
            render:(value)=>that.props.activePracticePermissions.PatientEmailId ? value : hideEmail(value)
        }, {
            title: 'Gender',
            key: 'gender',
            dataIndex: 'gender',
        }];
        return <div>
            <h2>New Patients Report</h2>
            <Row>
                <Col span={12} offset={6} style={{textAlign:"center"}}>
                    <Statistic title="Total Patients" value={this.state.report.length} />
                    <br/>
                </Col>
            </Row>

            <CustomizedTable
                loading={this.state.loading}
                columns={columns}
                dataSource={this.state.report}/>

            {/*<InfiniteFeedLoaderButton loaderFunction={() => this.loadNewPatient(that.state.next)}*/}
            {/*                          loading={this.state.loading}*/}
            {/*                          hidden={!this.state.next}/>*/}

        </div>
    }
}
