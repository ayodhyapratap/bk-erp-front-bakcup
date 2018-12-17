import React from "react";
import {Button, Card, Col, Icon, Radio, Row, Table} from "antd";

export default class PatientsReport extends React.Component {
    render() {
        const relatedReport = [
            {name: 'Daily New Patients', value: 'b'},
            {name: 'Expiring Membership', value: 'c'},
            {name: 'Patients First Appointment', value: 'd'},
            {name: 'Monthly New Patients', value: 'e'},
            {name: 'New Membership', value: 'f'},
        ]
        return <div>
            <h2>Appointments Report
                <Button.Group style={{float: 'right'}}>
                    <Button><Icon type="mail"/> Mail</Button>
                    <Button><Icon type="printer"/> Print</Button>
                </Button.Group>
            </h2>
            <Card>
                <Row gutter={16}>
                    <Col span={16}>
                        <Table dataSource={[]}/>
                    </Col>
                    <Col span={8}>
                        <Radio.Group buttonStyle="solid" defaultValue="all">
                            <h2>Patients</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="all">
                                All Appointemnts
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
