import React from "react";
import {Divider, Statistic, Table} from "antd";
import {PATIENT_APPOINTMENTS_REPORTS} from "../../../constants/api";
import {getAPI} from "../../../utils/common";

export default class CancellationsNumbers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentCancel: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true
        }
        this.loadAppointmentCancellation = this.loadAppointmentCancellation.bind(this);
    }
    componentDidMount() {
        this.loadAppointmentCancellation();
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (this.props.startDate != newProps.startDate || this.props.endDate != newProps.endDate)
            this.setState({
                startDate: newProps.startDate,
                endDate: newProps.endDate
            },function(){
                that.loadAppointmentCancellation();
            })

    }

    loadAppointmentCancellation = () => {
        let that = this;
        let successFn = function (data) {
            console.log(Object.entries(data));
            that.setState({
                appointmentCancel: data.data,
                loading: false
            });

        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        let apiParams={
            type:that.props.type,
            practice:that.props.active_practiceId,
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD'),
        };

        getAPI(PATIENT_APPOINTMENTS_REPORTS,  successFn, errorFn, apiParams);
    };

    render() {
        let i=1;
        const columns = [{
            title: 'S. No',
            key: 'sno',
            render: (item, record) => <span> {i++}</span>,
            width: 50
        },{
            title: 'Appointment Status',
            key:'appointment_status',
            dataIndex:'status',
        }];





        return <div>
            <h2>Cancellations Numbers
                {/*<Button.Group style={{float: 'right'}}>*/}
                {/*<Button><Icon type="mail"/> Mail</Button>*/}
                {/*<Button><Icon type="printer"/> Print</Button>*/}
                {/*</Button.Group>*/}
            </h2>
            <Divider><Statistic title="Total" value={this.state.total} /></Divider>
            <Table loading={this.state.loading} columns={columns} pagination={false}
                             dataSource={this.state.appointmentCancel}/>

        </div>
    }
}
