import React from "react";
import {Button, Card, Col, Icon, Radio, Row, Table} from "antd";

export default class AppointmentsReport extends React.Component{
    render(){
        const relatedReport = [
            {name:'Appointments For Each Category',value:'b'},
            {name:'Cancellation Numbers',value:'c'},
            {name:'Average Waiting/engaged Time Day Wise',value:'d'},
            {name:'Average Waiting/engaged Time Month Wise',value:'e'},
            {name:'Reasons For Cancellations',value:'f'},
            {name:'Daily Appointment Count',value:'g'},
            {name:'Appointments For Each Doctor',value:'h'},
            {name:'Monthly Appointment Count',value:'i'},
            {name:'Appointment For Each Patient Group',value:'j'},]
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
                            <h2>Appointments</h2>
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
