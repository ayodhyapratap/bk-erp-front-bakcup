import React from "react";
import {hideEmail, hideMobile} from "../../../utils/permissionUtils";
import {getAPI} from "../../../utils/common";
import {PATIENTS_REPORTS} from "../../../constants/api";
import {Col, Row, Select, Statistic} from "antd";
import CustomizedTable from "../../common/CustomizedTable";
import {loadMailingUserListForReportsMail, sendReportMail} from "../../../utils/clinicUtils";

export default class PatientFollowUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            report:[],
            loading:false,
            mailingUsersList: []
        }
        this.loadFollowUpPatient = this.loadFollowUpPatient.bind(this);
    }
    componentDidMount() {
        this.loadFollowUpPatient();
        loadMailingUserListForReportsMail(this);
    }
    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate ||this.props.patient_groups !=newProps.patient_groups
            ||this.props.blood_group !=newProps.blood_group || this.props.blood_group !=newProps.blood_group)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                this.loadFollowUpPatient();
            })
    }
    loadFollowUpPatient() {
        let that = this;
        that.setState({
            loading:true,
        });
        let successFn = function (data) {
            that.setState({
                report:data,
                loading:false
            })
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams={
            follow_start: this.props.startDate.format('YYYY-MM-DD'),
            follow_end: this.props.endDate.format('YYYY-MM-DD'),
            type:this.props.type,
        };
        if (this.props.patient_groups){
            apiParams.groups=this.props.patient_groups.toString();
        }
        if (this.props.blood_group){
            apiParams.blood_group=this.props.blood_group;
        }
        getAPI(PATIENTS_REPORTS,  successFn, errorFn,apiParams);
    }
    sendMail = (mailTo) => {
        let apiParams={
            from_date: this.props.startDate.format('YYYY-MM-DD'),
            to_date: this.props.endDate.format('YYYY-MM-DD'),
            type:this.props.type,
        }
        if (this.props.patient_groups){
            apiParams.groups=this.props.patient_groups.toString();
        }
        if (this.props.blood_group){
            apiParams.blood_group=this.props.blood_group;
        }
        apiParams.mail_to = mailTo;
        sendReportMail(PATIENTS_REPORTS, apiParams)
    }
    render() {
        let that=this;
        const {report} =this.state;
        const reportData = [];
        for (let i = 1; i <= report.length; i++) {
            reportData.push({s_no: i,...report[i-1]});
        };


        const columns = [{
            title: 'S. No',
            key: 's_no',
            dataIndex:'s_no',
            width: 50
        },{
            title: 'Patient Name',
            dataIndex: 'user.first_name',
            key: 'first_name',
        },{
            title:'Patient Number',
            key:'id',
            render:(item ,record)=><span>{record.custom_id?record.custom_id:record.id}</span>,
            exports:(item ,record) =>(record.custom_id?record.custom_id:record.id),
        }, {
            title: 'Mobile Number',
            key: 'user.mobile',
            dataIndex:'user.mobile',
            render: (value) => that.props.activePracticePermissions.PatientPhoneNumber ? value : hideMobile(value),
            exports:(value)=>(value),
        },{
            title:'Email',
            key:'user.email',
            dataIndex:'user.email',
            render:(value)=>that.props.activePracticePermissions.PatientEmailId ? value : hideEmail(value),
            exports:(value)=>(value),
        }, {
            title: 'Gender',
            key: 'gender',
            dataIndex: 'gender',
        }];
        return <div>
            <h2>Patient Follow Up Report
                <span style={{float: 'right'}}>
                    <p><small>E-Mail To:&nbsp;</small>
                <Select onChange={(e) => this.sendMail(e)} style={{width: 200}}>
                    {this.state.mailingUsersList.map(item => <Select.Option
                        value={item.email}>{item.name}</Select.Option>)}
                </Select>
                    </p>
            </span>
            </h2>
            <Row>
                <Col span={12} offset={6} style={{textAlign:"center"}}>
                    <Statistic title="Total Patients" value={this.state.report.length} />
                    <br/>
                </Col>
            </Row>

            <CustomizedTable
                hideReport={true}
                loading={this.state.loading}
                columns={columns}
                dataSource={reportData}/>

        </div>
    }
}
