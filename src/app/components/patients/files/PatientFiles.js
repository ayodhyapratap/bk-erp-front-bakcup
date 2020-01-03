import React from "react";
import {
    Button,
    Card,
    Col,
    Icon,
    List,
    Modal,
    Radio,
    Row,
    Checkbox,
    Menu,
    Dropdown,
    Input,
    Popconfirm,
    Affix, Tag
} from "antd";
import {getAPI, postAPI, putAPI, interpolate, makeFileURL, displayMessage} from "../../../utils/common";
import {
    ALL_PATIENT_FILES,
    EMR_FILETAGS,
    PATIENT_FILES,
    MEDICAL_CERTIFICATE_API,
    MEDICAL_CERTIFICATE_PDF,
    ALL_MEDICAL_CERITICATE_API,
    PATIENT_MAILEDFILES
} from "../../../constants/api";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Form} from "antd/lib/index";
import {MULTI_SELECT_FIELD, SINGLE_IMAGE_UPLOAD_FIELD, INPUT_FIELD} from "../../../constants/dataKeys";
import {Redirect, Link} from 'react-router-dom';
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";
import Meta from "antd/lib/card/Meta";
import {BACKEND_BASE_URL} from "../../../config/connect";
import ModalImage from "react-modal-image";
import {ERROR_MSG_TYPE, SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";
import moment from "moment";

class PatientFiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            tags: [],
            showAddModal: false,
            loading: true,
            selectedFiles: {},
            selectedTags: {},
            filterSearchTag: null,
            showAddMedicalModel: false,
            // filterSearchMedical:''
            medicalCertificate: [],
            visible: false,
            filesData: {},
            mailedfiles: []
        };
        this.loadData = this.loadData.bind(this);
        this.loadMedicalCertificate = this.loadMedicalCertificate.bind(this);
    }

    componentWillMount() {
        this.loadData();
        // this.loadTags();
        this.loadMedicalCertificate();
    }

    loadData(page = 1) {
        let that = this;
        this.setState({
            loading: true
        })
        let successFn = function (data) {
            that.setState(function (prevState) {
                let lastPatient = null;
                if (data.current == 1) {
                    let newData = data.results.map(file => {
                        if (moment(file.created_at).format('YYYYMMDD') != moment(lastPatient).format('YYYYMMDD')) {
                            lastPatient = moment(file.created_at);
                            return {...file, newDate: true}
                        }
                        return {...file, newDate: false}
                    });
                    return {
                        files: newData,
                        total: data.count,
                        loadMoreFiles: data.next,
                        loading: false,
                    }
                } else {
                    let newData = data.results.map(file => {
                        if (moment(file.created_at).format('YYYYMMDD') != moment(lastPatient).format('YYYYMMDD')) {
                            lastPatient = moment(file.created_at);
                            return {...file, newDate: true}
                        }
                        return {...file, newDate: false}
                    });
                    return {
                        files: [...prevState.files, ...newData],
                        loadMoreFiles: data.next,
                        loading: false
                    }
                }

            })
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })
        }
        let apiParams = {
            page: page,
            practice: this.props.active_practiceId,
        };

        if (this.props.match.params.id) {
            apiParams.patient = this.props.match.params.id;
        }
        if (this.props.showAllClinic && this.props.match.params.id) {
            delete (apiParams.practice)
        }
        if (this.state.filterSearchTag) {
            apiParams.tag = this.state.filterSearchTag
        } else if (this.state.filterSearchTag == '') {
            apiParams.notag = true
        }
        getAPI(PATIENT_FILES, successFn, errorFn, apiParams);

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

    loadMedicalCertificate(page = 1) {
        let that = this;
        that.setState({
            loading: true
        });
        let successFn = function (data) {
            if (data.current == 1) {

                that.setState({
                    total: data.count,
                    medicalCertificate: data.results,
                    loading: false,
                    loadMoreCertificate: data.next
                })
            } else {
                that.setState(function (prevState) {
                    return {
                        total: data.count,
                        medicalCertificate: [...prevState.medicalCertificate, ...data.results],
                        loading: false,
                        loadMoreCertificate: data.next
                    }
                })
            }
        }


        //     that.setState({
        //         medicalCertificate: data.results,
        //         loading:false
        //     })
        // }
        let errorFn = function () {
            that.setState({
                loading: false
            })

        }
        if (this.props.currentPatient) {
            getAPI(interpolate(MEDICAL_CERTIFICATE_API, [this.props.active_practiceId, this.props.currentPatient.id, page]), successFn, errorFn);
        }
        if (this.props.showAllClinic && this.props.currentPatient) {
            getAPI(interpolate(ALL_MEDICAL_CERITICATE_API, [this.props.currentPatient.id, page]), successFn, errorFn);
        } else {
            getAPI(interpolate(ALL_MEDICAL_CERITICATE_API, [this.props.active_practiceId, page]), successFn, errorFn);
        }

    }

    loadMailedFiles = (page = 1) => {
        let that = this;
        let successFn = function (data) {
            that.setState(function (prevState) {
                if (data.current == 1) {
                    return {
                        files: [...data.results],
                        total: data.count,
                        loadMoreFiles: data.next,
                        loading: false,
                    }
                } else {
                    return {
                        files: [...prevState.files, ...data.results],
                        loadMoreFiles: data.next,
                        loading: false
                    }
                }

            })
        }
        let errorFn = function () {

        }
        let params = {
            mailed: true,
            page: page,
            practice: this.props.active_practiceId,
        }
        if (this.props.currentPatient) {
            params.patient = this.props.currentPatient.id;
        }
        if (this.props.showAllClinic && this.props.currentPatient) {
            delete (params.practice)
        }
        getAPI(PATIENT_MAILEDFILES, successFn, errorFn, params);
    }

    triggerAddModal(option) {
        this.setState({
            showAddModal: !!option
        })
    }

    triggerAddMedicalCertificateModal(option) {
        this.setState({
            showAddMedicalModel: !!option
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

    tagsCompleteToggle(id, option) {
        this.setState(function (prevState) {
            let selected = {...prevState.selectedTags}
            if (option) {
                selected[id] = !!option
            } else {
                delete selected[id];
            }
            return {selectedTags: {...selected}}
        });
    }

    filesWithTags() {
        let that = this;
        let reqData = {
            id: Object.keys(this.state.selectedFiles),
            file_tags: Object.keys(this.state.selectedTags),
            patient: this.props.match.params.id,
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

    deleteMedicalCertificate(item) {
        let that = this;
        let reqData = {
            is_active: false,
            patient: item.patient,
            id: item.id
        }

        let successFn = function (data) {
            that.loadData();
            that.loadMedicalCertificate();
        }
        let errorFn = function () {

        };
        postAPI(interpolate(MEDICAL_CERTIFICATE_API, [that.props.active_practiceId]), reqData, successFn, errorFn);
    }

    deleteFile(item) {
        let that = this;
        let reqData = {
            id: item.id,
            patient: item.patient,
            is_active: false
        }
        let successFn = function (data) {
            that.loadData();
        }
        let errorFn = function () {
            displayMessage(ERROR_MSG_TYPE, "Please Select Patient.")

        }
        postAPI(interpolate(PATIENT_FILES, [this.props.match.params.id]), reqData, successFn, errorFn);
    }

    loadPDF(id) {
        let that = this;
        let successFn = function (data) {
            if (data.report)
                window.open(BACKEND_BASE_URL + data.report);
        }
        let errorFn = function () {

        }
        getAPI(interpolate(MEDICAL_CERTIFICATE_PDF, [id]), successFn, errorFn);
    }

    showModal = (item) => {
        this.setState(function () {
            return {visible: true, filesData: {...item}}
        });
    };

    handleCancel = () => {
        this.setState({visible: false});
    };

    render() {
        let that = this;
        const PatientFilesForm = Form.create()(DynamicFieldsForm);
        const fields = [{
            key: 'file_type',
            label: 'File',
            type: SINGLE_IMAGE_UPLOAD_FIELD,
            required:true
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
        const tagsMenu = (<div style={{
                // width: 100,
                boxShadow: '0 2px 4px #111',
                border: '1px solid #bbb',
                borderRadius: 2,
                paddingBottom: '30px',
                backgroundColor: 'white'
            }}>
                <ul style={{listStyle: 'none', paddingInlineStart: 0, paddingTop: 10}}>
                    {this.state.tags ?
                        <div>
                            {this.state.tags.map((tag) => <li key={tag.id}>
                                <Checkbox value={tag.id}
                                          onChange={(e) => that.tagsCompleteToggle(tag.id, e.target.checked)}
                                          checked={that.state.selectedTags[tag.id]}>{tag.name} </Checkbox>
                            </li>)}
                        </div>
                        : null}
                </ul>
                <span>
                    <Button type="primary" onClick={() => this.filesWithTags()}
                            style={{float: "right", borderStyle: "none"}}>Done</Button>
                </span>
            </div>
        );
        const defaultFields = [{key: 'is_active', value: true}, {
            key: 'patient',
            value: this.props.currentPatient ? this.props.currentPatient.id : null
        }, {key: 'practice', value: this.props.active_practiceId}]


        if (this.props.match.params.id) {
            return <Card title="Files"
                         extra={<Button.Group>
                             <Link to={"/patient/" + this.props.match.params.id + "/emr/create-medicalCertificate"}>
                                 <Button
                                     type="primary">
                                     <Icon type="plus"/>&nbsp;Add Medical Certificate</Button> </Link>

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
                                key={tag.id}
                                style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value={tag.id}>
                                {tag.name}
                            </Radio.Button>)}

                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="">
                                Untagged Files
                            </Radio.Button>
                            <p><br/></p>

                        </Radio.Group>

                        <Radio.Group buttonStyle="solid" defaultValue="">
                            <h2>Generated Files</h2>
                            <Radio.Button key="0" style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="a" onClick={() => this.loadMailedFiles()}>
                                Emailed Files
                            </Radio.Button>

                            <Radio.Button key="1" style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          onClick={() => this.loadMedicalCertificate()}>
                                Medical Leave Certificate </Radio.Button>
                        </Radio.Group>
                    </Col>
                    <Col span={18}>
                        <Row>
                            {this.state.files.map(item => (
                                <>
                                    {item.newDate ? <Col span={24}>
                                        <Affix top={20} offsetTop={30}><h2 style={{
                                            marginLeft: '10px',
                                            padding: '5px',
                                            backgroundImage: 'linear-gradient(to right, #ddd , white)',
                                            borderRadius: '4px'
                                        }}>{moment(item.created_at).format('LL')}</h2></Affix>
                                    </Col> : null}
                                    <Col span={8}>
                                        <div
                                            // onClick={() => this.showModal(item)}
                                            style={{
                                                width: '100%',
                                                height: '150px',
                                                border: '1px solid #bbb',
                                                // background: '#fff url("' + makeFileURL(item.file_type) + '") no-repeat center center',
                                                backgroundSize: 'cover',
                                                padding: 'auto',
                                                overflow: 'hidden'

                                            }}>
                                            <Checkbox key={item.id}
                                                      disabled={(item.practice != this.props.active_practiceId)}
                                                      style={{
                                                          margin: 10,
                                                          position: 'absolute',
                                                          top: 5,
                                                          left: 5,
                                                          boxShadow: '0 0px 5px #000 '
                                                      }}
                                                      onChange={(e) => that.filesCompleteToggle(item.id, e.target.checked)}
                                                      checked={that.state.selectedFiles[item.id]}/>

                                            <ModalImage style={{border: "3px solid red"}}
                                                // small={makeFileURL(this.state.filesData.file_type)}
                                                        large={makeFileURL(item.file_type)}
                                                        small={makeFileURL(item.file_type)}
                                                        alt={<Button type="danger"
                                                                     onClick={() => this.deleteFile(item)}>
                                                            <Icon type="delete"/></Button>}
                                            />
                                        </div>
                                        <Card bodyStyle={{padding: 3}} style={{marginBottom: 15}}>
                                                <h4>
                                                <b>{item.patient_data.user.first_name}&nbsp;({item.patient_data.custom_id})</b>
                                            </h4>
                                            <Tag><b>{item.practice_data ? item.practice_data.name : '--'}</b></Tag>
                                        </Card>
                                    </Col>
                                </>
                            ))}
                        </Row>
                        <Row>
                            <Col span={24}>
                                <InfiniteFeedLoaderButton loaderFunction={() => this.loadData(that.state.loadMoreFiles)}
                                                          loading={this.state.loading}
                                                          hidden={!this.state.loadMoreFiles}/>
                            </Col>
                        </Row>
                        <Card title="Medical Certificate">
                            <List loading={this.state.loading}
                                  grid={{gutter: 16, column: 3}}
                                  dataSource={this.state.medicalCertificate}
                                  renderItem={item => (
                                      <Card style={{width: 600}}
                                            actions={[<p>{"Issued on : " + item.date}</p>,
                                                <a onClick={() => this.loadPDF(item.id)}><Icon type="printer"/></a>,
                                                <Popconfirm title="Are you sure delete this item?"
                                                            onConfirm={() => this.deleteMedicalCertificate(item)}
                                                            okText="Yes" cancelText="No">
                                                    <Icon type="delete"/>
                                                </Popconfirm>
                                            ]}>
                                          <Meta title={"Medical Leave #" + "" + item.id}
                                                description={"Excused From :" + item.excused_duty_from + " till " + item.excused_duty_to}>

                                          </Meta>
                                      </Card>
                                  )}
                            />
                            <InfiniteFeedLoaderButton
                                loaderFunction={() => this.loadData(that.state.loadMoreCertificate)}
                                loading={this.state.loading}
                                hidden={!this.state.loadMoreCertificate}/>
                        </Card>


                    </Col>

                </Row>
                <Modal visible={this.state.showAddModal}
                       onCancel={() => this.triggerAddModal(false)}
                       footer={null}>
                    <PatientFilesForm title="Add Files"
                                      fields={fields}
                                      defaultValues={defaultFields}
                                      formProp={formProps}/>
                </Modal>
            </Card>
        } else {
            return <Card title="Files"
                         extra={<Button.Group>
                             <Button type={"primary"} style={{marginRight: "10px"}}
                                     onClick={() => this.props.togglePatientListModal(true)}>
                                 <Icon type="plus"/>&nbsp; Add Medical Certificate
                             </Button>

                             <Button type={"primary"} style={{marginRight: "10px"}}
                                     onClick={() => this.props.togglePatientListModal(true)}>
                                 <Icon type="plus"/> &nbsp; AddFile/remove
                             </Button>

                             <Button type={"primary"} style={{marginRight: "10px"}}
                                     onClick={() => this.props.togglePatientListModal(true)}>
                                 <Icon type="plus"/> &nbsp; Add
                             </Button>
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
                                key={tag.id}
                                style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value={tag.id}>
                                {tag.name}
                            </Radio.Button>)}

                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="">
                                Untagged Files
                            </Radio.Button>
                            <p><br/></p>

                        </Radio.Group>

                        <Radio.Group buttonStyle="solid" defaultValue="">
                            <h2>Generated Files</h2>
                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          value="b" onClick={() => this.loadMailedFiles()}>
                                Emailed Files
                            </Radio.Button>

                            <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                          onClick={() => this.loadMedicalCertificate()} value=''>
                                Medical Leave Certificate </Radio.Button>
                        </Radio.Group>
                    </Col>
                    <Col span={18}>
                        <Row>
                            {this.state.files.map(item => (
                                <>
                                    {item.newDate ? <Col span={24}>
                                        <Affix top={20} offsetTop={30}><h2 style={{
                                            marginLeft: '10px',
                                            padding: '5px',
                                            backgroundImage: 'linear-gradient(to right, #ddd , white)',
                                            borderRadius: '4px'
                                        }}>{moment(item.created_at).format('LL')}</h2></Affix>
                                    </Col> : null}
                                    <Col span={8}>
                                        <div
                                            // onClick={() => this.showModal(item)}
                                            style={{
                                                width: '100%',
                                                height: '150px',
                                                border: '1px solid #bbb',
                                                // background: '#fff url("' + makeFileURL(item.file_type) + '") no-repeat center center',
                                                backgroundSize: 'cover',
                                                padding: 'auto',
                                                overflow: 'hidden'

                                            }}>
                                            <Checkbox key={item.id}
                                                      disabled={(item.practice != this.props.active_practiceId)}
                                                      style={{
                                                          margin: 10,
                                                          position: 'absolute',
                                                          top: 5,
                                                          left: 5,
                                                          boxShadow: '0 0px 5px #000 '
                                                      }}
                                                      onChange={(e) => that.filesCompleteToggle(item.id, e.target.checked)}
                                                      checked={that.state.selectedFiles[item.id]}/>
                                            <ModalImage style={{border: "3px solid red"}}
                                                // small={makeFileURL(this.state.filesData.file_type)}
                                                        large={makeFileURL(item.file_type)}
                                                        small={makeFileURL(item.file_type)}
                                                        alt={<Button type="danger"
                                                                     onClick={() => this.deleteFile(item)}>
                                                            <Icon type="delete"/></Button>}
                                            />
                                        </div>
                                        <Card bodyStyle={{padding: 3}} style={{marginBottom: 15}}>
                                            <Link to={"/patient/" + item.patient_data.id + "/emr/files/"}><h4>
                                                <b>{item.patient_data.user.first_name}&nbsp;({item.patient_data.custom_id})</b>
                                            </h4></Link>
                                            <Tag><b>{item.practice_data ? item.practice_data.name : '--'}</b></Tag>
                                        </Card>
                                    </Col>
                                </>
                            ))}
                        </Row>
                        <Row>
                            <Col span={24}>
                                <InfiniteFeedLoaderButton loaderFunction={() => this.loadData(that.state.loadMoreFiles)}
                                                          loading={this.state.loading}
                                                          hidden={!this.state.loadMoreFiles}/>
                            </Col>
                        </Row>
                        <Card title="Medical Certificate">
                            <List loading={this.state.loading}
                                  grid={{gutter: 16, column: 3}}
                                  dataSource={this.state.medicalCertificate}
                                  renderItem={item => (
                                      <Card style={{width: 600}}
                                            actions={[<p>{"Issued on : " + item.date}</p>,
                                                <a onClick={() => this.loadPDF(item.id)}><Icon type="printer"/></a>,
                                                <Popconfirm title="Are you sure delete this item?"
                                                            onConfirm={() => this.deleteMedicalCertificate(item)}
                                                            okText="Yes" cancelText="No">
                                                    <Icon type="delete"/>
                                                </Popconfirm>
                                            ]}>
                                          <Meta title={"Medical Leave #" + "" + item.id}
                                                description={"Excused From :" + item.excused_duty_from + " till " + item.excused_duty_to}>

                                          </Meta>
                                      </Card>
                                  )}
                            />
                            <InfiniteFeedLoaderButton
                                loaderFunction={() => this.loadMedicalCertificate(that.state.loadMoreCertificate)}
                                loading={this.state.loading}
                                hidden={!this.state.loadMoreCertificate}/>
                        </Card>


                    </Col>

                </Row>
                <Modal visible={this.state.showAddModal}
                       onCancel={() => this.triggerAddModal(false)}
                       footer={null}>
                    <PatientFilesForm title="Add Files"
                                      fields={fields}
                                      defaultValues={defaultFields}
                                      formProp={formProps}/>
                </Modal>
            </Card>
        }

    }
}

export default PatientFiles;
