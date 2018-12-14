import React from "react";
import {Button, Card, Icon, Steps, Timeline} from "antd";

const Step = Steps.Step;

class PatientTimeline extends React.Component {
    render() {
        return <Card title="Timeline"
                     extra={<Button.Group>
                         <Button>Email Case Sheet</Button>
                         <Button>Dot Matrix Print</Button>
                         <Button>Customize Print</Button>
                         <Button type="primary">Print Case Sheet</Button>
                     </Button.Group>}>

            <Timeline progressDot current={1} direction="vertical">
                <Timeline.Item>Titke</Timeline.Item>
                <Timeline.Item>Titke</Timeline.Item>
                <Timeline.Item>Titke</Timeline.Item>
                <Timeline.Item dot={<Icon type="clock-circle-o" style={{fontSize: '20px'}}/>} color="green">
                    <h3>Technical testing 2015-09-01</h3>
                </Timeline.Item>
            </Timeline>
        </Card>
    }
}

export default PatientTimeline;
