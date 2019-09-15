import React from "react";
import {Button, Card, Col, Icon, Radio, Row, Table} from "antd";
import {INVOICE_REPORTS} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import moment from "moment"
import CustomizedTable from "../../common/CustomizedTable";

export default class IncomeReport extends React.Component {
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

    report = () => {
        let that = this;
        this.setState({
            loading: true
        })
        let successFn = function (data) {
            console.log(data);
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
        getAPI(interpolate(INVOICE_REPORTS, [this.props.active_practiceId]), successFn, errorFn, {
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
            title: '	Invoice Number	',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: 'Patient',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: 'Treatments & Products',
            dataIndex: 'age',
            key: 'age',
        },];
        return <div>
            <h2>Income Report
            </h2>
            <Card>
                <Row gutter={16}>
                    <Col span={16}>
                        <CustomizedTable loading={this.state.loading} columns={columns} size={'small'}
                                         dataSource={this.state.report}/>
                    </Col>
                    <Col span={8}>
                        <Radio.Group buttonStyle="solid" defaultValue="all">
                            <h2>Patients</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="all">
                                All Invoices
                            </Radio.Button>
                            <p><br/></p>
                            <h2>Related Reports</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="b">
                                Daily Invoiced Income
                            </Radio.Button>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="c">
                                Monthly Invoiced Income
                            </Radio.Button>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="d">
                                Taxed Invoiced Income
                            </Radio.Button>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="e">
                                Invoiced Income For Each Doctor
                            </Radio.Button>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="f">
                                Invoiced Income For Each Procedure
                            </Radio.Button>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="g">
                                Invoiced Income For Each Patient Group
                            </Radio.Button>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="h">
                                Invoiced Income For Each Product
                            </Radio.Button>
                            {/*<p><b>My Groups</b></p>*/}
                            {/*{this.state.patientGroup.map((group) => <Radio.Button*/}
                            {/*style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value={group.id}>*/}
                            {/*{group.name}*/}
                            {/*</Radio.Button>)}*/}

                            {/*<p><br/></p>*/}
                            {/*<p><b>Membership</b></p>*/}
                        </Radio.Group>
                    </Col>
                </Row>
            </Card>
        </div>
    }
}
