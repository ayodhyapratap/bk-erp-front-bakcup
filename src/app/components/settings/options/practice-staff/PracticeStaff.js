import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Checkbox, Card, Form, Icon, Tabs, Divider, Tag, Row, Table, Modal,Popconfirm} from "antd";
import {CHECKBOX_FIELD, DOCTORS_ROLE, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {
    PRACTICESTAFF,
    STAFF_ROLES,
    ALL_PRACTICE_STAFF,
    ALL_PRACTICE_DOCTORS,
    SINGLE_PRACTICE_STAFF_API, USER_PRACTICE_PERMISSIONS, SET_USER_PERMISSION, SET_SPECIFIC_USER_PERMISSION
} from "../../../../constants/api"
import {Link} from "react-router-dom";
import {deleteAPI, getAPI, interpolate, patchAPI, postAPI} from "../../../../utils/common";
import {getAllPermissions, loggedInUserPractices} from "../../../../utils/auth";

const {Column, ColumnGroup} = Table;
const TabPane = Tabs.TabPane;

class PracticeDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'staff',
            practice_staff: [],
            practice_doctors: [],
            roles: null,
            permissionEditModal: false,
            editPermissions: {},
            allPermissions: getAllPermissions()
        }
        this.setPermission = this.setPermission.bind(this);
        this.staffRoles();
    }

    componentDidMount() {
        this.loadData();
    }

    setPermission(codename, e) {
        let that = this;
        let value = e.target.checked;
        this.setState(function (prevState) {
            let permission = {...prevState.editPermissions[codename]}
            permission.loading = true;
            return {editPermissions: {...prevState.editPermissions, [codename]: permission}}
        });
        if (value) {
            let reqData = {
                "name": null,
                "codename": codename,
                "is_active": true,
                "practice": that.props.active_practiceId,
                "user": that.state.currentUser
            }
            let successFn = function (data) {
                that.setState(function (prevState) {
                    return {editPermissions: {...prevState.editPermissions, [codename]: data}}
                })
            }
            let errorFn = function () {
            }
            postAPI(SET_USER_PERMISSION, reqData, successFn, errorFn);
        } else {
            if (that.state.editPermissions[codename].id) {
                let reqData = {
                    // "name": null,
                    // "codename": codename,
                    "is_active": false,
                    // "practice": that.props.active_practiceId,
                    // "user": that.state.currentUser
                }
                let successFn = function (data) {
                    that.setState(function (prevState) {
                        return {editPermissions: {...prevState.editPermissions, [data.codename]: undefined}}
                    })
                }
                let errorFn = function () {

                }
                patchAPI(interpolate(SET_SPECIFIC_USER_PERMISSION, [that.state.editPermissions[codename].id]), reqData, successFn, errorFn);
            } else {

            }
        }
    }

    editPermissions(user) {
        let that = this;
        if (!user) {
            that.setState({
                permissionEditModal: false,
            });
            return true
        }

        that.setState({
            permissionEditModal: true,
            editPermissions: [],
            currentUser: user
        });
        let successFn = function (data) {
            let permissions = {}
            data.forEach(function (item) {
                permissions[item.codename] = item
            })
            that.setState({
                editPermissions: permissions
            })
        }
        let errorFn = function () {
        }
        getAPI(interpolate(USER_PRACTICE_PERMISSIONS, [user, that.props.active_practiceId]), successFn, errorFn);
    }

    loadData() {
        // let group = loggedInUserGroup();
        // if (group[0].name == "Admin") {
        this.admin_StaffData();
        // }
        // else {
        //     this.clinicData();
        // }

    }

    deleteStaff(value) {
        var that = this;
        let successFn = function (data) {
            that.loadData();
            console.log("Deleted");
        };
        let errorFn = function () {
        };
        deleteAPI(interpolate(SINGLE_PRACTICE_STAFF_API, [value]), successFn, errorFn);

    }

    staffRoles() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                roles: data,
            })
        }
        let errorFn = function () {
        }
        getAPI(STAFF_ROLES, successFn, errorFn)
    }

    admin_StaffData() {
        var that = this;
        let successFn = function (data) {
            let doctor = [];
            let staff = [];
            data.staff.forEach(function (usersdata) {
                if (usersdata.role == DOCTORS_ROLE) {
                    doctor.push(usersdata);
                } else {
                    staff.push(usersdata);
                }
            });
            that.setState({
                practice_doctors: doctor,
                practice_staff: staff,
            })
        };
        let errorFn = function () {
        };
        getAPI(interpolate(PRACTICESTAFF, [this.props.active_practiceId]), successFn, errorFn);
    }


    clinicData() {
        let practice = loggedInUserPractices();
        var practiceKeys = Object.keys(practice);
        var that = this;
        // practiceKeys.forEach(function(key){
        //     let successFn = function (data) {
        //       that.setState(function(prevState){
        //         let doctors = prevState.practice_doctors;
        //         let staff= prevState.practice_staff;
        //         // if(doctors==null){doctors=[];}
        //         // if(staff==null){staff=[];}
        //         data.doctors.concat(doctors);
        //         data.staff.concat(staff);
        //         return{
        //           practice_staff:data.staff,
        //           practice_doctors:data.doctors,
        //         }
        //       })
        //     }
        //     let errorFn = function () {
        //     };
        //     getAPI(interpolate(PRACTICESTAFF,[key]), successFn, errorFn);
        //
        // });
        let successFn = function (data) {
            data.staff.forEach(function (usersdata) {
                if (usersdata.role == DOCTORS_ROLE) {
                    let doctor = that.state.practice_doctors;
                    doctor.push(usersdata);
                    that.setState({
                        practice_doctors: doctor,
                    })
                } else {
                    let doctor = that.state.practice_staff;
                    doctor.push(usersdata);
                    that.setState({
                        practice_staff: doctor,
                    })
                }
            })
        }
        let errorFn = function () {
        };
        getAPI(interpolate(PRACTICESTAFF, [this.props.active_practiceId]), successFn, errorFn);


    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }


    render() {
        let that = this;
        const columns = [{
            title: "Name",
            dataIndex: "user.first_name",
            key: "name",
        }, {
            title: "Email",
            dataIndex: "user.email",
            key: "email",
            render: (value, record) => (record.user && record.user.is_active ? record.user.email : value)
        }, {
            title: "Mobile",
            dataIndex: "user.mobile",
            key: "mobile",
        }, {
            title: "Registration Number",
            dataIndex: "registration_number",
            key: "registration_number",
        }, {
            title: "Status",
            key: "user",
            render: (text, record) => (record.user && record.user.is_active ? <Tag color="#87d068">Active</Tag> :
                <Tag color="#f50">Pending</Tag>),
        }, {
            title: "Action	",
            key: "action",
            render: function (text, record) {
                return (record.user && record.is_superuser ?
                    <Tag> Not Allowed</Tag> :
                    <span>
            <Link to={"/settings/clinics-staff/" + record.id + "/edit"}>
              <a>Edit</a>
            </Link>
                     <Divider type="vertical"/>
                        <a
                            // disabled={!(record.user && record.user.is_active)}
                           onClick={() => that.editPermissions(record.user.id)}>Permissions</a>
                    <Divider type="vertical"/>
                    <Popconfirm title="Are you sure delete this item?"
                                 onConfirm={() => that.deleteStaff(record.id)} okText="Yes" cancelText="No">
                         <a>Delete</a>
                    </Popconfirm>
            </span>)
            }
        }];

        const notification_columns = [{
            title: "Name",
            dataIndex: "name",
            key: "name",
        }, {
            title: "Confirmation SMS",
            dataIndex: "confirmation_sms",
            key: "confirmation_sms",
            render: confirmation_sms => (
                <span>
            <Checkbox disabled
                      checked={confirmation_sms}/>
            </span>),
        }, {
            title: "Schedule SMS",
            dataIndex: "schedule_sms",
            key: "schedule_sms",
            render: schedule_sms => (
                <span>
            <Checkbox disabled checked={schedule_sms}/>
            </span>)
        }, {
            title: "Confirmation EMAIL",
            dataIndex: "confirmation_email",
            key: "confirmation_email",
            render: confirmation_email => (
                <span>
            <Checkbox disabled checked={confirmation_email}/>
            </span>)
        }, {
            title: "online_appointment_sms",
            dataIndex: "online_appointment_sms",
            key: "online_appointment_sms",
            render: online_appointment_sms => (
                <Checkbox disabled checked={online_appointment_sms}/>
            )
        }];
        return <Row>
            <h2>Practice Staff</h2>
            <Card>
                <Tabs defaultActiveKey="staff">
                    <TabPane tab={<span><Icon type="user-add"/>Manage Staff</span>} key="staff">
                        <h2>Doctors <Link to="/settings/clinics-staff/adddoctor">
                            <Button type="primary" style={{float: 'right'}}>
                                <Icon type="plus"/>&nbsp;Add Doctor/Staff
                            </Button>
                        </Link></h2>
                        <Table pagination={false} columns={columns} dataSource={this.state.practice_doctors}/>
                        <h2>Staff </h2>
                        <Table pagination={false} columns={columns} dataSource={this.state.practice_staff}/>
                    </TabPane>
                    <TabPane tab={<span><Icon type="team"/>Staff Notification</span>} key="notification">
                        <h2>Doctors</h2>
                        <Table pagination={false} columns={notification_columns}
                               dataSource={this.state.practice_doctors}/>
                        <h2>Staff</h2>
                        <Table pagination={false} columns={notification_columns}
                               dataSource={this.state.practice_staff}/>
                    </TabPane>
                    <TabPane tab={<span><Icon type="schedule"/>Doctors visit Timing</span>} key="timing">
                        <Table>
                            <Column title="Name"
                                    dataIndex="user.name"
                                    key="name"
                            />
                            <Column title="Visit Timing"
                                    dataIndex="loginstatus"
                                    key="VisitTiming"
                            />
                            <Column title="Action"
                                    key="action"
                                    render={(text, record) => (
                                        <Link to="/settings/clinics-staff/adddoctor">
                                            <a>Edit</a>
                                        </Link>
                                    )}/>
                        </Table>
                    </TabPane>
                </Tabs>
                <Modal title="Edit Permissions"
                       visible={this.state.permissionEditModal}
                       onCancel={() => this.editPermissions()}
                       footer={null}>
                    {that.state.allPermissions.map(item => <Checkbox value={item.codename}
                                                                     checked={that.state.editPermissions[item.codename]}
                                                                     disabled={that.state.editPermissions[item.codename] && that.state.editPermissions[item.codename].loading}
                                                                     onClick={(e) => this.setPermission(item.codename, e)}
                                                                     style={{display: 'list-item'}}>{item.id} {item.name}</Checkbox>)}
                </Modal>
            </Card>
        </Row>
    }
}

export default PracticeDetails;
