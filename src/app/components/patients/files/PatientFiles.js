import React from "react";
import {Button, Card, Col, Icon, List, Modal, Radio, Row, Checkbox, Menu, Dropdown, Input} from "antd";
import {getAPI, postAPI, interpolate, makeFileURL} from "../../../utils/common";
import {ALL_PATIENT_FILES, EMR_FILETAGS, PATIENT_FILES,MEDICAL_CERTIFICATE_API} from "../../../constants/api";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Form} from "antd/lib/index";
import {MULTI_SELECT_FIELD, SINGLE_IMAGE_UPLOAD_FIELD, INPUT_FIELD} from "../../../constants/dataKeys";
import {Redirect, Link} from 'react-router-dom';

class PatientFiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            tags: [],
            showAddModal: false,
            loading: true,
            selectedFiles: {},
            selectedTags: [],
            filterSearchTag: null,
            showAddMedicalModel:false
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
                files: data,
                loading: false
            })
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })
        }
        let queryParams = {};
        if (this.state.filterSearchTag) {
            queryParams.tag = this.state.filterSearchTag
        } else if (this.state.filterSearchTag == '') {
            queryParams.notag = true
        }
        if (this.props.match.params.id)
            getAPI(interpolate(PATIENT_FILES, [this.props.match.params.id]), successFn, errorFn, queryParams);
        else
            getAPI(ALL_PATIENT_FILES, successFn, errorFn, queryParams);
    }

    loadTags() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                tags: data,
                loading: false
            })
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })
        }
        getAPI(interpolate(EMR_FILETAGS, [this.props.active_practiceId]), successFn, errorFn);
    }

    triggerAddModal(option) {
        this.setState({
            showAddModal: !!option
        })
    }
    triggerAddMedicalCertificateModal(option){
        this.setState({
            showAddMedicalModel: !! option
        })
    }

    filesCompleteToggle(id, option) {
        this.setState(function (prevState) {
            let selected = {...prevState.selectedFiles}
            if (option) {
                selected[id] = !!option
            } else {
                delete selected[id];
            }
            return {selectedFiles: {...selected}}
        });
    }

    tagsCompleteToggle = (e) => {

        this.setState({
            selectedTags: e,
        })
    }

    filesWithTags() {
        let that = this;
        let reqData = {
            id: Object.keys(this.state.selectedFiles),
            file_tags: this.state.selectedTags,
        };
        let successFn = function () {
            that.setState({
                selectedFiles: {}
            })
            that.loadData()
        }
        let errorFn = function () {

        }
        postAPI(interpolate(PATIENT_FILES, [this.props.match.params.id]), reqData, successFn, errorFn)
    }

    filterTags = (e) => {
        let that = this;
        this.setState({
            filterSearchTag: e.target.value
        }, function () {
            that.loadData();
        })
    }

    render() {
        let that = this;
        const PatientFilesForm = Form.create()(DynamicFieldsForm);
        const  PatientMedicalCertificateForm = Form.create()(DynamicFieldsForm);
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

        const medicalFields=[{
            key:'name',
            label:'name',
            type:INPUT_FIELD,
        }, {
            key: 'file_tags',
            label: 'Tags',
            type: MULTI_SELECT_FIELD,
            options: this.state.tags.map(tag => ({label: tag.name, value: tag.id}))
        }];
        const medicalFormProps = {
            method: 'post',
            successFn:function(){
                that.triggerAddMedicalCertificateModal(false);
                that.loadData();
            },
            errorFn:function(){

            },
            action:interpolate(MEDICAL_CERTIFICATE_API,[this.props.match.params.id])
        }
        const tagsMenu = (
            <Menu>
                <Menu.Item>
                    <Checkbox.Group options={this.state.tags.map(tag => ({label: tag.name, value: tag.id}))}
                                    onChange={this.tagsCompleteToggle}>
                    </Checkbox.Group>
                    <Button onClick={() => this.filesWithTags()} style={{float: 'right'}}>Done</Button>
                </Menu.Item>

            </Menu>
        );

        const defaultFields = [{key: 'is_active', value: true}, {key: 'patient', value: this.props.match.params.id}]
        return <Card title="Files"
                     extra={<Button.Group>
                            <Link to={"/patient/"+ this.props.match.params.id + "/emr/create-medicalCertificate"}> <Button type="primary">
                                <Icon type="plus"/>&nbsp;Add Medical Certificate</Button> </Link>

                         <Button onClick={() => this.triggerAddMedicalCertificateModal(true)}><Icon type="plus"/>Add Certificate</Button>
                         <Dropdown overlay={tagsMenu} trigger={['click']} placement="bottomLeft">
                             <Button><Icon type="plus"/>AddFile/remove</Button>
                         </Dropdown>

                         <Button onClick={() => this.triggerAddModal(true)}><Icon type="plus"/>Add</Button>
                     </Button.Group>}>
            <Row gutter={8}>
                <Col span={6}
                     style={{
                         height: 'calc(100vh - 55px)',
                         overflow: 'auto',
                         paddingRight: '10px',
                         // backgroundColor: '#e3e5e6',
                         borderRight: '1px solid #ccc'
                     }}>
                    <Radio.Group buttonStyle="solid" defaultValue="all" onChange={this.filterTags}>
                        <h2>Uploaded Files</h2>
                        <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                      value={null}>
                            All Files</Radio.Button>
                        {this.state.tags.map(tag => <Radio.Button
                            style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value={tag.id}>
                            {tag.name}
                        </Radio.Button>)}

                        <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value="">
                            Untagged Files
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
                    <List loading={this.state.loading}
                          grid={{gutter: 16, column: 3}}
                          dataSource={this.state.files}
                          renderItem={item => (
                              <List.Item style={{textAlign: 'center'}} key={item.id}>
                                  <div style={{
                                      width: '100%',
                                      height: '150px',
                                      border: '1px solid #bbb',
                                      background: '#fff url("' + makeFileURL(item.file_type) + '") no-repeat center center',
                                      backgroundSize:'cover',

                                  }}>
                                      <Checkbox key={item.id}
                                                style={{
                                                    position: 'absolute',
                                                    top: 5,
                                                    left: 5,
                                                    boxShadow: '0 0px 5px #000 '
                                                }}
                                                onChange={(e) => that.filesCompleteToggle(item.id, e.target.checked)}
                                                checked={that.state.selectedFiles[item.id]}/>
                                      {/*<img src={makeFileURL(item.file_type)} alt=""*/}
                                      {/*style={{maxWidth: '100%', height: '100px'}}/>*/}
                                  </div>
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

            {/* <Modal visible={this.state.showAddMedicalModel}
                    onCancel={()=> this.triggerAddMedicalCertificateModal(false)}
                    footer={null}>
                    <PatientMedicalCertificateForm title="Add Medical Certificate"
                                  fields={medicalFields}
                                  defaultFields={defaultFields}
                                  formProp={medicalFormProps}/>     
            </Modal> */}

        </Card>
    }
}

export default PatientFiles;
