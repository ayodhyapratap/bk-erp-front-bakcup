import React from "react";
import {Button, Card, Col, Icon, List, Row} from "antd";

class PatientFiles extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const data = [
            {
                title: 'Title 1',
            },
            {
                title: 'Title 2',
            },
            {
                title: 'Title 3',
            },
            {
                title: 'Title 4',
            },
        ];
        return <Card title="Files"
                     extra={<Button.Group>
                         <Button>Email</Button>
                         <Button><Icon type="plus"/>Add</Button>
                     </Button.Group>}>
            <Row>
                <Col span={8}></Col>
                <Col span={16}>
                    <List
                        grid={{gutter: 16, column: 4}}
                        dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <Card bodyStyle={{padding: '5px'}} hoverable cover={<img alt="example"
                                                                                         src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>}>{item.title}</Card>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>

        </Card>
    }
}

export default PatientFiles;
