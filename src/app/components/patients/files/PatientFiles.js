import React from "react";
import {Button, Card, Col, Icon, List, Radio, Row} from "antd";

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
                <Col span={8}
                     style={{
                         height: 'calc(100vh - 55px)',
                         overflow: 'auto',
                         paddingRight: '10px',
                         // backgroundColor: '#e3e5e6',
                         borderRight: '1px solid #ccc'
                     }}>
                    <Radio.Group buttonStyle="solid" defaultValue="all">
                        <h2>Uploaded Files</h2>
                        <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                      value="all">
                            All Patents</Radio.Button>
                        <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value="b">
                            Recently Visited
                        </Radio.Button>
                        <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value="c">
                            Recently Added
                        </Radio.Button>
                        <p><br/></p>
                        <h2>Generated Files</h2>
                        <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value="d">
                            Chengdu
                        </Radio.Button>
                    </Radio.Group>
                </Col>
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
