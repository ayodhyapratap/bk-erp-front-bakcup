import React from "react";
import {Modal, Select, Table} from "antd";
import {PATIENT_APPOINTMENTS_REPORTS} from "../../../constants/api";
import {getAPI} from "../../../utils/common";
import moment from "moment"
import CustomizedTable from "../../common/CustomizedTable";
import {loadMailingUserListForReportsMail, sendReportMail} from "../../../utils/clinicUtils";
const { confirm } = Modal;

export default class AverageWaitingOrEngagedTimeMonthWise extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentMonthWait: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: false,
            mailingUsersList: []
        }
        this.loadAppointmentMonthWait = this.loadAppointmentMonthWait.bind(this);

    }

    componentDidMount() {
        this.loadAppointmentMonthWait();
        loadMailingUserListForReportsMail(this);
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate || this.props.categories != newProps.categories
            || this.props.doctors != newProps.doctors || this.props.exclude_cancelled != newProps.exclude_cancelled)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            }, function () {
                that.loadAppointmentMonthWait();
            })

    }

    loadAppointmentMonthWait = () => {
        let that = this;
        that.setState({
            loading: true,
        });
        let successFn = function (data) {
            that.setState({
                appointmentMonthWait: data,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams = {
            type: that.props.type,
            practice: that.props.active_practiceId,
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
            exclude_cancelled: this.props.exclude_cancelled ? true : false,
        };
        // if (this.props.exclude_cancelled){
        //     apiParams.exclude_cancelled=this.props.exclude_cancelled;
        // }
        if (this.props.categories) {
            apiParams.categories = this.props.categories.toString();
        }
        if (this.props.doctors) {
            apiParams.doctors = this.props.doctors.toString();
        }

        getAPI(PATIENT_APPOINTMENTS_REPORTS, successFn, errorFn, apiParams);
    };
    sendMail = (mailTo) => {
        let apiParams={
            type:this.props.type,
            practice:this.props.active_practiceId,
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
            exclude_cancelled:this.props.exclude_cancelled?true:false,
        };
        // if (this.props.exclude_cancelled){
        //     apiParams.exclude_cancelled=this.props.exclude_cancelled;
        // }
        if(this.props.categories){
            apiParams.categories=this.props.categories.toString();
        }
        if(this.props.doctors){
            apiParams.doctors=this.props.doctors.toString();
        }
        apiParams.mail_to = mailTo;
        sendReportMail(PATIENT_APPOINTMENTS_REPORTS, apiParams)
    }


    showConfirmMail = (mailTo)=>{
        let that = this;
        confirm({
            title: 'Are you sure send mail?',
            content: 'Email Id :'+ mailTo,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                that.sendMail(mailTo);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    render() {
        const {appointmentMonthWait} = this.state;
        const appointmentMonthWaitData = [];
        for (let i = 1; i <= appointmentMonthWait.length; i++) {
            appointmentMonthWaitData.push({s_no: i, ...appointmentMonthWait[i - 1]});
        }
        ;

        const columns = [{
            title: 'S. No',
            key: 's_no',
            dataIndex: 's_no',
            width: 50
        }, {
            title: 'Appointment Time Month',
            key: 'date',
            dataIndex: 'date',
            render: (text, record) => (
                <span>
                {moment(record.date).format('DD MMM YYYY')}
                  </span>
            ),
            export: (item, record) => (moment(record.date).format('DD MMM YYYY')),
        }, {
            title: 'Avg. waiting Time(hh:mm:ss)',
            key: 'wait',
            dataIndex: 'wait',
            render: (text, record) => (
                <span>
                  {record.wait ? moment().add(record.wait, 'second').fromNow() : ''}
                </span>
            ),
            export: (item, record) => (record.wait ? moment().add(record.wait, 'second').fromNow() : ''),
        }, {
            title: 'Avg. engaged Time(hh:mm:ss)',
            key: 'engage',
            dataIndex: 'engage',
            render: (text, record) => (
                <span>
                  {record.engage ? moment().add(record.engage, 'second').fromNow() : ''}
                </span>
            ),
            export: (item, record) => (record.engage ? moment().add(record.engage, 'second').fromNow() : ''),
        }, {
            title: 'Avg. stay Time (hh:mm:ss)',
            key: 'stay',
            dataIndex: 'stay',
            render: (stay, record) => (<span>
                {record.stay ? moment().add(record.stay, 'second').fromNow() : ''}
            </span>),
            export: (item, record) => (record.stay ? moment().add(record.stay, 'second').fromNow() : ''),
        }];


        return <div>
            <h2>Average Waiting/engaged Time Month Wise
                <span style={{float: 'right'}}>
                    <p><small>E-Mail To:&nbsp;</small>
                <Select onChange={(e) => this.showConfirmMail(e)} style={{width: 200}}>
                    {this.state.mailingUsersList.map(item => <Select.Option
                        value={item.email}>{item.name}</Select.Option>)}
                </Select>
                    </p>
            </span>
            </h2>
            <CustomizedTable hideReport={true} loading={this.state.loading} columns={columns}
                             dataSource={appointmentMonthWaitData}/>

        </div>
    }
}
