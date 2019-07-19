import React from "react";
import {Avatar, Button, Drawer, Icon, Layout, Tooltip, Dropdown, Tag, Switch} from "antd";
import PatientSelection from "./PatientSelection";
import {Link} from "react-router-dom";
import {patientSettingMenu} from "../../utils/clinicUtils";
import {makeFileURL} from "../../utils/common";

const {Header, Content, Sider} = Layout;


class PatientHeader extends React.Component {
    constructor(props) {
        super(props);
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
                            {(this.props.currentPatient.image ? <Avatar src={makeFileURL(this.props.currentPatient.image)}/> :
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
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: 53,
                }}>
                <PatientSelection {...this.props}/>
            </Drawer>
        </Header>
    }
}

export default PatientHeader;


