import React from "react";
import {Button, Card, Col, Icon, List, Modal, Radio, Row, Checkbox, Menu, Dropdown, Input, Popconfirm} from "antd";
import {getAPI, postAPI,putAPI, interpolate, makeFileURL} from "../../../utils/common";
import {ALL_PATIENT_FILES, EMR_FILETAGS, PATIENT_FILES, MEDICAL_CERTIFICATE_API,MEDICAL_CERTIFICATE_PDF} from "../../../constants/api";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Form} from "antd/lib/index";
import {MULTI_SELECT_FIELD, SINGLE_IMAGE_UPLOAD_FIELD, INPUT_FIELD} from "../../../constants/dataKeys";
import {Redirect, Link} from 'react-router-dom';
import InfiniteFeedLoaderButton from "../../common/InfiniteFeedLoaderButton";
import Meta from "antd/lib/card/Meta";
import {BACKEND_BASE_URL} from "../../../config/connect";
import ModalImage from "react-modal-image";
import { object } from "prop-types";

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
            medicalCertificate:[],
            visible: false,
            filesData:{}
        };
        this.loadData = this.loadData.bind(this);
        this.loadMedicalCertificate =this.loadMedicalCertificate.bind(this);
    }

    componentWillMount() {
        this.loadData();
        this.loadTags();
        // this.loadMedicalCertificate();
    }

    loadData(page = 1) {
        let that = this;
        this.setState({
            loading:true
        })
        let successFn = function (data) {
            that.setState(function (prevState) {
                if (data.current == 1) {
                    return {
                        files: [...data.results],
                        loading: false
                    }
                } else {
                    return {
                        files: [...prevState.files, ...data.results],
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

    loadMedicalCertificate(){
        let that=this;
        let successFn = function (data){
            that.setState({
                medicalCertificate:data,
            })
        }
        let errorFn = function(){

        }
        getAPI(interpolate(MEDICAL_CERTIFICATE_API,[this.props.currentPatient.id]),successFn,errorFn);
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
            patient:this.props.match.params.id,
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
        let reqData = {is_active:false,
            patient:that.props.currentPatient.id,
            id:item.id
        }

        let successFn = function (data) {
            that.loadData();
            that.loadMedicalCertificate();
        }
        let errorFn = function () {

        };
        postAPI(interpolate(MEDICAL_CERTIFICATE_API, [that.props.currentPatient.id]), reqData, successFn, errorFn);
    }

    loadPDF(id) {
        let that = this;
        let successFn = function (data) {
            if (data.report)
                window.open(BACKEND_BASE_URL + data.report);
        }
        let errorFn = function () {

        }
        getAPI(interpolate(MEDICAL_CERTIFICATE_PDF ,[id]), successFn, errorFn);
    }

    showModal=(item)=> {
        this.setState(function () {
            return {visible:true , filesData:{...item}}
        });
        // console.log("this",this.state.filesData);
    };
   
    handleCancel = () => {
        this.setState({ visible: false });
    };

    // changeState = (type, value) => {
    //     this.setState({
    //         [type]: value
    //     })
    // }
    
    render() {
        let that = this;
        console.log("selected",this.state.selectedFiles);
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

    
        const tagsMenu = (<div
            style={{
                // width: 100,
                boxShadow: '0 2px 4px #111',
                border: '1px solid #bbb',
                borderRadius: 2,
                paddingBottom:'30px',
                backgroundColor: 'white'}}>

                <ul style={{listStyle: 'none', paddingInlineStart: 0 ,paddingTop:10}}>
                    {this.state.tags ? 
                        <div>
                            {this.state.tags.map((tag)=><li><Checkbox value={tag.id} 
                             onChange={(e) => that.tagsCompleteToggle(tag.id, e.target.checked)}
                             checked={that.state.selectedTags[tag.id]}>{tag.name} </Checkbox></li>)}
                            {/* onChange={this.tagsCompleteToggle}> */}
                        </div>       
                        :null}
                    
                </ul>
                <span><Button type="primary" onClick={() => this.filesWithTags()} style={{float:"right" ,borderStyle:"none"}}>Done</Button></span>
            </div>
        );
        console.log("value test",this.props.match.params.id);
        const defaultFields = [{key: 'is_active', value: true}, {key: 'patient', value: this.props.match.params.id} , {key:'practice', value: this.props.active_practiceId}]
        return <Card title="Files"
                     extra={<Button.Group>
                         <Link to={"/patient/" + this.props.match.params.id + "/emr/create-medicalCertificate"}> <Button
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
                            style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value={tag.id}>
                            {tag.name}
                        </Radio.Button>)}

                        <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value="">
                            Untagged Files
                        </Radio.Button>
                        <p><br/></p>
                       
                    </Radio.Group>
                    
                    <Radio.Group buttonStyle="solid" defaultValue="">
                        <h2>Generated Files</h2>
                        <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value="d" >
                            Emailed Files
                        </Radio.Button>

                        <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} onClick={this.loadMedicalCertificate}> 
                         Medical Leave Certificate </Radio.Button>
                    </Radio.Group>
                </Col>
                <Col span={18}>
                        <List loading={this.state.loading}
                            grid={{gutter: 16, column: 3}}
                            dataSource={this.state.files}
                            renderItem={item => (
                                <List.Item style={{textAlign: 'center'}} key={item.id} >
                                    <div onClick={()=>this.showModal(item)} style={{
                                        width: '100%',
                                        height: '150px',
                                        border: '1px solid #bbb',
                                        background: '#fff url("' + makeFileURL(item.file_type) + '") no-repeat center center',
                                        backgroundSize: 'cover',

                                    }}>
                                        <Checkbox key={item.id}
                                                    disabled={(item.practice != this.props.active_practiceId)}
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
                        <Card title="MedicalCertificate">
                            <List loading={this.state.loading}
                                grid={{gutter:16,column:3}}
                                dataSource={this.state.medicalCertificate}
                                renderItem={item =>(
                                <Card style={{ width: 600 }}
                                    actions={[<p>{"Issued on : " +item.date }</p>, <a onClick={() => this.loadPDF(item.id)}><Icon type="printer"/></a>,
                                    <Popconfirm title="Are you sure delete this item?"
                                            onConfirm={() => this.deleteMedicalCertificate(item)} okText="Yes" cancelText="No">
                                        <Icon type="delete"/>
                                    </Popconfirm>
                                    ]}>
                                    <Meta title={"Medical Leave #"+ "" + item.id} 
                                    description={"Excused From :" +item.excused_duty_from + " till " + item.excused_duty_to}>
                                    
                                    </Meta>
                                </Card>
                                )}
                                />
                        </Card>
                        
                    <InfiniteFeedLoaderButton loaderFunction={() => this.loadData(that.state.next)}
                                              loading={this.state.loading}
                                              hidden={!this.state.next}/>
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

            <Modal
                visible={this.state.visible}
                closable={false}
                onCancel={this.handleCancel}
                footer={null}>
               
                
                <ModalImage
                    small={makeFileURL(this.state.filesData.file_type)}
                    large={makeFileURL(this.state.filesData.file_type)}
                    // alt="Hello World!"
                />
                {/* <Card  hoverable
                        cover={<img  src={makeFileURL(this.state.filesData.file_type)}/>} 
                        // extra={ <Button.Group>
                        // <Button><a onClick={() => this.loadPDF(this.state.filesData.id)}><Icon type="printer"/></a></Button>
                        // <Button icon="cloud-download"><a href={makeFileURL(this.state.filesData.file_type)} download></a></Button>
                        // </Button.Group>}
                    >
                </Card> */}
                
                
            </Modal>

        </Card>
    }
}

export default PatientFiles;
