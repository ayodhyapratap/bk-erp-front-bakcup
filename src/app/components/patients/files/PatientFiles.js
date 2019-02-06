import React from "react";
import {Button, Card, Col, Icon, List, Modal, Radio, Row} from "antd";
import {getAPI, interpolate} from "../../../utils/common";
import {ALL_PATIENT_FILES, EMR_FILETAGS, PATIENT_FILES} from "../../../constants/api";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Form} from "antd/lib/index";
import {MULTI_SELECT_FIELD, SINGLE_IMAGE_UPLOAD_FIELD} from "../../../constants/dataKeys";

class PatientFiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            tags: [],
            showAddModal: false
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
        else
            getAPI(ALL_PATIENT_FILES, successFn, errorFn);
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

    triggerAddModal(option) {
        this.setState({
            showAddModal: !!option
        })
    }

    render() {
        let that = this;
        const PatientFilesForm = Form.create()(DynamicFieldsForm);
        const fields = [{
            key: 'file_type',
            label: 'File',
            type: SINGLE_IMAGE_UPLOAD_FIELD
        }, {
            key: 'file_tags',
            label: 'Tags',
            type: MULTI_SELECT_FIELD,
            options: this.state.tags.map(tag => ({label: tag.name, value: tag.id}))
        }];
        const formProps = {
            method: 'post',
            successFn: function () {
                that.triggerAddModal(false);
                that.loadData()
            },
            errorFn: function () {
            },
            action: interpolate(PATIENT_FILES, [this.props.match.params.id])
        }
        const defaultFields = [{key: 'is_active', value: true}, {key: 'patient', value: this.props.match.params.id}]
        return <Card title="Files"
                     extra={<Button.Group>
                         <Button onClick={() => this.triggerAddModal(true)}><Icon type="plus"/>Add</Button>
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
                            style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value={tag.id}>
                            {tag.name}
                        </Radio.Button>)}

                        <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value="c">
                            Recently Added
                        </Radio.Button>
                        {/*<p><br/></p>*/}
                        {/*<h2>Generated Files</h2>*/}
                        {/*<Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value="d">*/}
                            {/*Chengdu*/}
                        {/*</Radio.Button>*/}
                        {/*<Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}*/}
                                      {/*value="none">*/}
                            {/*Untagged Files</Radio.Button>*/}
                    </Radio.Group>
                </Col>
                <Col span={18}>
                    <List
                        grid={{gutter: 16, column: 3}}
                        dataSource={this.state.files}
                        renderItem={item => (
                            <List.Item style={{textAlign:'center'}}>
                                <img src={item.file_type} alt="" style={{maxWidth:'100%',height:'100px'}}/>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
            <Modal visible={this.state.showAddModal}
                   onCancel={() => this.triggerAddModal(false)}
                   footer={null}>
                <PatientFilesForm title="Add Files"
                                  fields={fields}
                                  defaultFields={defaultFields}
                                  formProp={formProps}/>
            </Modal>
        </Card>
    }
}

export default PatientFiles;
