import React from "react";
import {Table} from "antd";
import {MEMBERSHIP_REPORTS} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import {hideEmail, hideMobile} from "../../../utils/permissionUtils";

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
            dataIndex: 'patient.user.mobile',
            key: 'patient.user.mobile',
            render: (value) => that.props.activePracticePermissions.PatientPhoneNumber ? value : hideMobile(value),
        },{
            title: 'Email',
            dataIndex: 'patient.user.email',
            key: 'patient.user.email',
            render:(value)=>that.props.activePracticePermissions.PatientEmailId ? value : hideEmail(value),
        },{
            title:'Gender',
            key:'gender',
            dataIndex:'patient.gender'
        }];

        return <div>
            <h2>Expiring Membership </h2>
            <Table
                loading={this.state.loading}
                columns={columns}
                pagination={false}
                dataSource={this.state.report}/>


        </div>
    }
}
