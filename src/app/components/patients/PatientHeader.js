import React from "react";
import {
    Avatar,
    Button,
    Icon,
    Layout,
    Tooltip,
    Dropdown,
    Tag,
    Switch,
    Statistic,
    Popover,
    List,
    Modal
} from "antd";
import PatientSelection from "./PatientSelection";
import {Link} from "react-router-dom";
import {hashCode, intToRGB, patientSettingMenu} from "../../utils/clinicUtils";
import {makeFileURL} from "../../utils/common";

const {Header} = Layout;


class PatientHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    componentDidMount() {
        let that=this;
        if (that.props.refreshWallet){
            that.props.refreshWallet();
        }
    }


    render() {
        let that = this;
        return <Header className="header" style={{background: '#e4e4e4',padding:'0px 20px'}}>
            <div>
                {this.props.currentPatient ?
                    <div style={{display: 'inline'}}>
                        <div style={{display: 'inline', textSize: '15px'}}>
                            <Tooltip title="Switch Back to All Patients">
                                <Button onClick={() => this.props.setCurrentPatient(null)} type="primary" ghost>
                                    <Icon type="solution"/> &nbsp;
                                    Back
                                </Button>
                            </Tooltip>
                        </div>

                        <a style={{padding: '8px', fontSize: '15px'}}
                           onClick={() => this.props.togglePatientListModal(true)}>
                            {(this.props.currentPatient.image ?
                                <Avatar src={makeFileURL(this.props.currentPatient.image)}/> :
                                <Avatar style={{backgroundColor: '#87d068'}}>
                                    {this.props.currentPatient.user.first_name ? this.props.currentPatient.user.first_name.charAt(0) :
                                        <Icon type="user"/>}
                                </Avatar>)}
                            &nbsp;&nbsp;{that.props.currentPatient.user.first_name.length < 16 ? that.props.currentPatient.user.first_name : that.props.currentPatient.user.first_name.slice(0, 12) + '...'}
                            <small><i><b> [ID: {that.props.currentPatient.custom_id ? that.props.currentPatient.custom_id : that.props.currentPatient.id}]</b></i></small>

                        </a>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Popover placement="topLeft" title={"Medical History"}
                                 content={<div
                                     style={{width: 250}}>{that.props.currentPatient.medical_history_data ? that.props.currentPatient.medical_history_data.map((item, index) =>
                                     <Tag color={'#' + intToRGB(hashCode(item.name))}>{item.name}</Tag>) : null}</div>}>

                            {that.props.currentPatient.medical_history_data ? that.props.currentPatient.medical_history_data.map((item, index) =>
                                index > 1 ? index == 2 &&
                                    <Tag>+{that.props.currentPatient.medical_history_data.length - 2}</Tag> :
                                    <Tag color={'#' + intToRGB(hashCode(item.name))}>{item.name}</Tag>) : null}

                        </Popover>
                        <Switch
                            style={{marginLeft: 20}}
                            checked={this.props.showAllClinic}
                            onChange={(value) => this.props.toggleShowAllClinic(value)}
                            checkedChildren={"All Clinics"}
                            unCheckedChildren={"Current Clinic"}
                        />
                        {this.props.pendingAmount?<>
                            <Button style={{marginLeft:'20px'}} type="primary" size={"small"}>
                                <Link to={'/patient/'+ this.props.currentPatient.id +'/billing/payments/add'}> Pay Now!</Link>
                            </Button>
                            <Popover placement="rightTop"
                                     content={<List size="small" dataSource={this.props.pendingAmount.practice_data}
                                                    renderItem={item => <List.Item><List.Item.Meta title={item.name}
                                                                                                   description={"Rs. " + (item.total < 0 ? item.total * -1 + " (Advance)" : item.total)}/></List.Item>}/>}
                                     title="Pending Payments">

                                <div style={{
                                    display: 'inline',
                                    float: 'left',
                                    maxWidth: 200,
                                    position: 'absolute',
                                    margin: '0px 15px',
                                    zIndex: 5
                                }}>
                                    <Statistic title="Total Pending Amount" value={this.props.pendingAmount.grand_total}
                                    valueStyle={{
                                    color: this.props.pendingAmount.grand_total > 0 ? '#cf1322' : 'initial',
                                    fontWeight: 500 }}
                                    precision={2}/>

                                </div>
                            </Popover>
                            </>: null}

                        {this.props.walletAmount && this.props.walletAmount.length ?
                            <Popover placement="rightTop"
                                     title="Agent Wallet Amount"
                                     content={<p>
                                         {/*Refundable : {this.state.walletAmount[0].refundable_amount} <br/>*/}
                                         Non-Refundable : {this.props.walletAmount[0].non_refundable}
                                     </p>}>
                                <div style={{
                                    display: 'inline',
                                    float: 'left',
                                    maxWidth: 400,
                                    position: 'absolute',
                                    paddingLeft: 173,
                                    margin: '12px 15px'
                                }}>
                                    <Statistic tile={"wallet"}
                                               value={this.props.walletAmount[0].refundable_amount + this.props.walletAmount[0].non_refundable}
                                               prefix={<Icon type="wallet"/>}/>
                                </div>
                            </Popover> : null}
                    </div> :
                    <a style={{padding: '8px', fontSize: '20px'}}
                       onClick={() => this.props.togglePatientListModal(true)}>
                        <div style={{display: 'inline'}}><Icon type="solution"/> &nbsp; All Patient</div>
                    </a>}
                <Dropdown overlay={patientSettingMenu}>
                    <Button style={{float: 'right', margin: '15px'}}>
                        <Icon type="setting"/> Settings <Icon type="down"/>
                    </Button>
                </Dropdown>
                {that.props.activePracticePermissions.AddPatient || that.props.allowAllPermissions ?
                    <Link to="/patients/profile/add">
                        <Button type="primary" style={{float: 'right', margin: '15px'}}>
                            <Icon type="plus"/> Add Patient
                        </Button>
                    </Link> : null}

            </div>
            <Modal
                width={1300}
                maskClosable={false}
                centered
                footer={null}
                closable={false}
                visible={this.props.listModalVisible}
                style={{
                    height: 'calc(100vh - 120px)',
                }}>
                <Button icon="close" type="danger" shape="circle" style={{position: 'absolute', top: '-50px', right: 0}}
                        onClick={() =>
                            this.props.togglePatientListModal(false)}/>
                <PatientSelection {...this.props}/>
            </Modal>
        </Header>
    }
}

export default PatientHeader;


