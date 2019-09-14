import React from "react";
import {Table} from "antd";
import {MEMBERSHIP_REPORTS} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import {hideEmail, hideMobile} from "../../../utils/permissionUtils";
import CustomizedTable from "../../common/CustomizedTable";

export default class ExpiringMembership extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            report: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,

        }
        this.loadExpireMembership = this.loadExpireMembership.bind(this);
    }

    componentDidMount() {
        this.loadExpireMembership();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                that.loadExpireMembership();
            })
    }

    loadExpireMembership() {
        let that = this;
        that.setState({
            loading: true
        })
        let successFn = function (data) {
            that.setState({
                report:data,
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
        getAPI(MEMBERSHIP_REPORTS,  successFn, errorFn,apiParams);
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
            title: 'Name',
            dataIndex: 'patient.user.first_name',
            key: 'patient.user.first_name',
            export:(item,record)=>(record.patient.user.first_name),
        }, {
            title: 'Mobile Number',
            key: 'patient.user.mobile',
            dataIndex:'patient.user.mobile',
            render: (value) => that.props.activePracticePermissions.PatientPhoneNumber ? value : hideMobile(value),
            export:(item ,record)=>(record.patient.user.mobile),
        },{
            title: 'Email',
            key: 'patient.user.email',
            dataIndex:'patient.user.email',
            render:(value)=>that.props.activePracticePermissions.PatientEmailId ? value : hideEmail(value),
            export:(item ,record)=>(record.patient.user.email),
        },{
            title:'Gender',
            key:'gender',
            dataIndex:'patient.gender',
            export:(item ,record)=>(record.patient.gender),
        },{
            title:'Start Date',
            key:'start_date',
            dataIndex:'medical_from'

        },{
            title:'Valid Till',
            key:'valid_till',
            dataIndex:'medical_to'
        }];

        return <div>
            <h2>Expiring Membership </h2>
            <CustomizedTable
                loading={this.state.loading}
                columns={columns}
                dataSource={this.state.report}/>


        </div>
    }
}
