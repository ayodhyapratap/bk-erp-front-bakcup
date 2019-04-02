import React from "react";
import {Button, Card, Col, Icon, Radio, Row, Table} from "antd";
import {PAYMENTS_REPORTS} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import moment from "moment";
import CustomizedTable from "../../common/CustomizedTable";

export default class PaymentsReport extends React.Component {
  constructor(props) {
      super(props);
      this.state={
        report:[],
      }
      this.report=this.report.bind(this);
      this.report();
  }
  report(){
    let that =this;
      let successFn = function (data) {
        console.log(data);
        that.setState({
          report:data.data,
        });
      };
      let errorFn = function () {
      };
     getAPI(interpolate( PAYMENTS_REPORTS, [this.props.active_practiceId,"start="+this.props.startDate+"&end="+this.props.endDate]), successFn, errorFn);
  }
    render() {
      const columns = [{
                title: 'Date',
                key: 'date',
                render: (text, record) => (
                  <span>
                {  moment(record.shedule_at).format('LL')}
                  </span>
                ),
                }, {
                title: 'Scheduled At	',
                key: 'time',
                render: (text, record) => (
                  <span>
                  {  moment(record.shedule_at).format('HH:mm')}

                  </span>
                ),
                }, {
                title: 'Patient',
                dataIndex: 'age',
                key: 'age',
                }, {
                title: 'Receipt Number',
                dataIndex: 'age',
                key: 'age',
                }, {
                title: 'Invoice(s)',
                dataIndex: 'age',
                key: 'age',
                }, {
                title: 'Treatments & Products',
                dataIndex: 'age',
                key: 'age',
                }, {
                title: 'Amount Paid (INR)	',
                dataIndex: 'patient_name',
                key: 'patient_name',
                }, {
                title: 'Advance Amount (INR)',
                dataIndex: 'address',
                key: 'address',
                }, {
                title: 'Payment Info	',
                dataIndex: 'address',
                key: 'address',
                }, {
                title: 'Vendor Fees (INR)',
                dataIndex: 'address',
                key: 'address',
              }];

        const relatedReport = [{name: 'Refund Payments', value: 'b'},
            {name: 'Payment Received From Each Patient Group', value: 'c'},
            {name: 'Patients With Unsettled Advance, As Of Today', value: 'd'},
            {name: 'Modes Of Payment', value: 'e'},
            {name: 'Payment Received Per Day', value: 'f'},
            {name: 'Payment Received Per Doctor', value: 'g'},
            {name: 'Payment Received Per Month', value: 'h'},
            {name: 'Payment Settlement', value: 'i'},
            {name: 'Payment Settlement Per Doctor', value: 'j'},
            {name: 'Credit Notes', value: 'k'},
            {name: 'Credit Amount Per Doctor', value: 'l'},
        ]
        return <div>
            <h2>Payments Report
            </h2>
            <Card>
                <Row gutter={16}>
                    <Col span={16}>
                    <CustomizedTable columns={columns} size={'small'} dataSource={this.state.report}/>
                    </Col>
                    <Col span={8}>
                        <Radio.Group buttonStyle="solid" defaultValue="all">
                            <h2>Patients</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="all">
                                All Payments
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
