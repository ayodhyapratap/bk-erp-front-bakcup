import React from "react";
import {Avatar, Button, Drawer, Icon, Layout, Tooltip, Dropdown, Tag, Switch, Statistic, Popover, List} from "antd";
import PatientSelection from "./PatientSelection";
import {Link} from "react-router-dom";
import {patientSettingMenu} from "../../utils/clinicUtils";
import {getAPI, interpolate, makeFileURL} from "../../utils/common";
import {AGENT_WALLET, PATIENT_PENDING_AMOUNT} from "../../constants/api";

const {Header, Content, Sider} = Layout;


class PatientHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pendingAmount: null,
            walletAmount: null
        }
    }

    componentDidMount() {
        this.loadPatientPendingAmount();
        this.loadPatientWallet();
    }

    loadPatientPendingAmount = () => {
        let that = this;
        if (this.props.currentPatient && this.props.currentPatient.id) {
            let successFn = function (data) {
                that.setState({
                    pendingAmount: data
                })
            }
            let errorFn = function () {

            }
            getAPI(interpolate(PATIENT_PENDING_AMOUNT, [this.props.currentPatient.id]), successFn, errorFn);
        } else {
            this.setState({
                pendingAmount: null
            })
        }
    }
    loadPatientWallet = () => {
        let that = this;
        if (this.props.currentPatient && this.props.currentPatient.id) {
            let successFn = function (data) {
                that.setState({
                    walletAmount: data
                })
            }
            let errorFn = function () {

            }
            getAPI(interpolate(AGENT_WALLET, [this.props.currentPatient.id]), successFn, errorFn);
        } else {
            this.setState({
                pendingAmount: null
            })
        }
    }

    render() {
        let that = this;
        return <Header className="header" style={{background: '#e4e4e4'}}>
            <div>
                {this.props.currentPatient ?
                    <div style={{display: 'inline'}}>
                        <div style={{display: 'inline', textSize: '25px'}}>
                            <Tooltip title="Switch Back to All Patients">
                                <Button onClick={() => this.props.setCurrentPatient(null)} type="primary" ghost>
                                    <Icon type="solution"/> &nbsp;
                                    Back
                                </Button>
                            </Tooltip>
                        </div>

                        <a style={{padding: '8px', fontSize: '20px'}}
                           onClick={() => this.props.togglePatientListModal(true)}>
                            {(this.props.currentPatient.image ?
                                <Avatar src={makeFileURL(this.props.currentPatient.image)}/> :
                                <Avatar style={{backgroundColor: '#87d068'}}>
                                    {this.props.currentPatient.user.first_name ? this.props.currentPatient.user.first_name.charAt(0) :
                                        <Icon type="user"/>}
                                </Avatar>)}
                            &nbsp;&nbsp;{that.props.currentPatient.user.first_name}
                        </a>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Tooltip placement="top" title={"Medical History"}>
                            {that.props.currentPatient.medical_history_data ? that.props.currentPatient.medical_history_data.map(item =>
                                <Tag>{item.name}</Tag>) : null}
                        </Tooltip>
                        <Switch
                            checked={this.props.showAllClinic}
                            onChange={(value) => this.props.toggleShowAllClinic(value)}
                            checkedChildren={"All Clinics"}
                            unCheckedChildren={"Current Clinic"}
                        />
                        {this.state.pendingAmount ?
                            <Popover placement="rightTop"
                                     content={<List size="small" dataSource={this.state.pendingAmount.practice_data}
                                                    renderItem={item => <List.Item><List.Item.Meta title={item.name}
                                                                                                   description={"Rs. " + item.total}/></List.Item>}/>}
                                     title="Pending Payments">
                                <div style={{
                                    display: 'inline',
                                    float: 'left',
                                    maxWidth: 200,
                                    position: 'absolute',
                                    margin: '0px 15px'
                                }}>
                                    <Statistic title="Total Pending Amount" value={this.state.pendingAmount.grand_total}
                                               valueStyle={{
                                                   color: this.state.pendingAmount.grand_total > 0 ? '#cf1322' : 'initial',
                                                   fontWeight: 500
                                               }}
                                               precision={2}/>
                                </div>
                            </Popover> : null}
                        {this.state.walletAmount && this.state.walletAmount.length ?
                            <Popover placement="rightTop"
                                     title="Wallet Amount"
                                     content={<p>
                                         {/*Refundable : {this.state.walletAmount[0].refundable_amount} <br/>*/}
                                         Non-Refundable : {this.state.walletAmount[0].non_refundable}
                                     </p>}>
                                <div style={{
                                    display: 'inline',
                                    float: 'left',
                                    maxWidth: 400,
                                    position: 'absolute',
                                    paddingLeft: 200,
                                    margin: '12px 15px'
                                }}>
                                    <Statistic tile={"wallet"}
                                               value={this.state.walletAmount[0].refundable_amount + this.state.walletAmount[0].non_refundable}
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
            <Drawer
                title="Select Patient"
                width={1220}
                placement="left"
                onClose={() =>
                    this.props.togglePatientListModal(false)
                }
                maskClosable={false}
                visible={this.props.listModalVisible}
                style={{
                    height: 'calc(100%)',
                    overflow: 'auto',
                    paddingBottom: 53,
                }}>
                <PatientSelection {...this.props}/>
            </Drawer>
        </Header>
    }
}

export default PatientHeader;


