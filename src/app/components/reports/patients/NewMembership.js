import React from "react";
import {Table} from "antd";
import {MEMBERSHIP_REPORTS} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import {hideMobile ,hideEmail} from "../../../utils/permissionUtils";

export default class NewMembership extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            report: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true,

        }
        this.loadNewMembership = this.loadNewMembership.bind(this);
    }
    componentDidMount() {
        this.loadNewMembership();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                that.loadNewMembership();
            })
    }

    loadNewMembership() {
        let that = this;
        that.setState({
            loading: true
        })
        let successFn = function (data) {
            that.setState({
                report: data,
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
            apiParams.from_date=this.state.startDate.format('YYYY-MM-DD');
            apiParams.to_date= this.state.endDate.format('YYYY-MM-DD');
        }
        if(this.props.type){
            apiParams.type=this.props.type;
        }
        getAPI(MEMBERSHIP_REPORTS,  successFn, errorFn,apiParams);
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
            title: 'Name',
            dataIndex: 'patient.user.first_name',
            key: 'patient.user.first_name',
        }, {
            title: 'Mobile Number',
            key: 'patient.user.mobile',
            render: (value) => that.props.activePracticePermissions.PatientPhoneNumber ? value : hideMobile(value)
        },{
            title: 'Email',
            key: 'patient.user.email',
            render:(value)=>that.props.activePracticePermissions.PatientEmailId ? value : hideEmail(value)
        },{
            title:'Membership Type',
            key:'membership_type',
            dataIndex:'medical_membership.name'
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
            <h2>New Membership </h2>
            <Table
                loading={this.state.loading}
                columns={columns}
                pagination={false}
                dataSource={this.state.report}/>


        </div>
    }
}
