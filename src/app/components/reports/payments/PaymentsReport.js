import React from "react";
import {Button, Card, Col, Icon, Radio, Row, Table} from "antd";

export default class PaymentsReport extends React.Component {
    render() {
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
