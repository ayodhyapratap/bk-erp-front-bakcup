import React from "react";
import {Button, Card, Col, Icon, Radio, Row, Table} from "antd";
import {EXPENSE_REPORT} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import moment from "moment"
import CustomizedTable from "../../common/CustomizedTable";

export default class ExpensesReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            report: [],
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            loading: true
        }
        this.report = this.report.bind(this);
        this.report();
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
        this.setState({
            loading: true
        })
        let successFn = function (data) {
            that.setState({
                report: data.data,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        getAPI(interpolate(EXPENSE_REPORT, [this.props.active_practiceId]), successFn, errorFn, {
            start: this.state.startDate.format('YYYY-MM-DD'),
            end: this.state.endDate.format('YYYY-MM-DD')
        });
    }


    render() {
        const columns = [{
            title: 'Date',
            key: 'date',
            render: (text, record) => (
                <span>
                {moment(record.created_at).format('LL')}
                  </span>
            ),
        }, {
            title: 'Scheduled At	',
            key: 'time',
            render: (text, record) => (
                <span>
                  {moment(record.created_at).format('HH:mm')}

                  </span>
            ),
        }, {
            title: '	Expense Type',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: 'Expense Amount (INR)',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: 'Mode Of Payment',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: 'Vendor',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: 'Notes',
            dataIndex: 'patient_name',
            key: 'patient_name',
        },];


        const relatedReport = [
            {name: 'Daily Expenses', value: 'b'},
            {name: 'Expenses For Each Type', value: 'c'},
            {name: 'Monthly Expenses', value: 'd'},];

        return <div>
            <h2>Expenses Report
            </h2>
            <Card>
                <Row gutter={16}>
                    <Col span={16}>
                        <CustomizedTable loading={this.state.loading} columns={columns} size={'small'}
                                         dataSource={this.state.report}/>
                    </Col>
                    <Col span={8}>
                        <Radio.Group buttonStyle="solid" defaultValue="all">
                            <h2>Appointments</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="all">
                                All Expenses
                            </Radio.Button>
                            <p><br/></p>
                            <h2>Related Reports</h2>
                            {relatedReport.map((item) => <Radio.Button
                                style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                value={item.value}>
                                {item.name}
                            </Radio.Button>)}
                        </Radio.Group>
                    </Col>
                </Row>
            </Card>
        </div>
    }
}
