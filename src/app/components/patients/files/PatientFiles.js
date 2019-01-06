import React from "react";
import {Button, Card, Col, Icon, List, Radio, Row} from "antd";
import {getAPI, interpolate} from "../../../utils/common";
import {ALL_PATIENT_FILES, EMR_FILETAGS, PATIENT_FILES} from "../../../constants/api";

class PatientFiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            tags: []
        };
        this.loadData = this.loadData.bind(this);
    }

    componentWillMount() {
        this.loadData();
        this.loadTags()
    }

    loadData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                files: data
            })
        }
        let errorFn = function () {
        }
        if (this.props.match.params.id)
            getAPI(interpolate(PATIENT_FILES, [this.props.match.params.id]), successFn, errorFn);
        // else
        //     getAPI(ALL_PATIENT_FILES, successFn, errorFn);
    }

    loadTags() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                tags: data
            })
        }
        let errorFn = function () {
        }
        getAPI(interpolate(EMR_FILETAGS, [this.props.active_practiceId]), successFn, errorFn);
    }

    render() {
        return <Card title="Files"
                     extra={<Button.Group>
                         <Button>Email</Button>
                         <Button><Icon type="plus"/>Add</Button>
                     </Button.Group>}>
            <Row>
                <Col span={6}
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
                            All Files</Radio.Button>
                        {this.state.tags.map(tag => <Radio.Button
                            style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value={tag}>
                            {tag}
                        </Radio.Button>)}

                        <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value="c">
                            Recently Added
                        </Radio.Button>
                        <p><br/></p>
                        <h2>Generated Files</h2>
                        <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value="d">
                            Chengdu
                        </Radio.Button>
                        <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                      value="none">
                            Untagged Files</Radio.Button>
                    </Radio.Group>
                </Col>
                <Col span={18}>
                    <List
                        grid={{gutter: 16, column: 4}}
                        dataSource={this.state.files}
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
