import React from "react";
import {Button, Card, Col, Icon, Radio, Row, Table} from "antd";
import {PATIENTS_REPORTS} from "../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../utils/common";
import moment from "moment"

export default class PatientsReport extends React.Component {
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
     getAPI(interpolate( PATIENTS_REPORTS, [this.props.active_practiceId,"start="+this.props.startDate+"&end="+this.props.endDate]), successFn, errorFn);
  }
    render() {
      const columns = [{
                title: 'Date',
                key: 'date',
                render: (text, record) => (
                  <span>
                {  moment(record.created_at).format('LL')}
                  </span>
                ),
                }, {
                title: 'Scheduled At	',
                key: 'time',
                render: (text, record) => (
                  <span>
                  {  moment(record.created_at).format('HH:mm')}

                  </span>
                ),
                }, {
                title: '	Name',
                dataIndex: 'age',
                key: 'age',
                }, {
                title: 'Patient Number',
                dataIndex: 'age',
                key: 'age',
                },];


        const relatedReport = [
            {name: 'Daily New Patients', value: 'b'},
            {name: 'Expiring Membership', value: 'c'},
            {name: 'Patients First Appointment', value: 'd'},
            {name: 'Monthly New Patients', value: 'e'},
            {name: 'New Membership', value: 'f'},
        ]
        return <div>
            <h2>Patients Report
                <Button.Group style={{float: 'right'}}>
                    <Button><Icon type="mail"/> Mail</Button>
                    <Button><Icon type="printer"/> Print</Button>
                </Button.Group>
            </h2>
            <Card>
                <Row gutter={16}>
                    <Col span={16}>
                      <Table columns={columns} size={'small'} dataSource={this.state.report}/>
                    </Col>
                    <Col span={8}>
                        <Radio.Group buttonStyle="solid" defaultValue="all">
                            <h2>Patients</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="all">
                                New Patients
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
