import React from "react";
import {
    Button,
    Checkbox,
    Card,
    Form,
    Icon,
    Tabs,
    Divider,
    Tag,
    Row,
    Table,
    Modal,
    Popconfirm,
    Switch as AntSwitch, Spin
} from "antd";
import {Link, Route, Switch} from "react-router-dom";
import moment from "moment";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {
    CHECKBOX_FIELD,
    DOCTORS_ROLE,
    INPUT_FIELD,
    RADIO_FIELD,
    SELECT_FIELD,
    SUCCESS_MSG_TYPE
} from "../../../../constants/dataKeys";
import {
    PRACTICESTAFF,
    STAFF_ROLES,
    ALL_PRACTICE_STAFF,
    ALL_PRACTICE_DOCTORS,
    SINGLE_PRACTICE_STAFF_API,
    USER_PRACTICE_PERMISSIONS,
    SET_USER_PERMISSION,
    SET_SPECIFIC_USER_PERMISSION,
    DOCTOR_VISIT_TIMING_API, ENABLE_STAFF_IN_PRACTICE, ALL_PERMISSIONS, UPDATE_BULK_PERMISSIONS
} from "../../../../constants/api"
import {deleteAPI, displayMessage, getAPI, interpolate, patchAPI, postAPI, putAPI} from "../../../../utils/common";
import {getAllPermissions, loggedInUserPractices} from "../../../../utils/auth";
import DoctorTiming from "./DoctorTiming";
import {DAY_KEYS} from "../../../../constants/hardData";
import CustomizedTable from "../../../common/CustomizedTable";

const {Column, ColumnGroup} = Table;
const {TabPane} = Tabs;
const {confirm} = Modal;

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
            allPermissions: [],
            allGlobalPermissions: [],
            loading: true,
            defaultActiveTab: this.props.location.hash,
            doctorsTiming: {},
            bulkEditLoading: false
        }
        this.setPermission = this.setPermission.bind(this);
        this.staffRoles()
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.getAllPermissions();
        this.loadData();
    }

    setPermission(codename, name, e, sendPractice) {
        const that = this;
        const value = e.target.checked;
        this.setState(function (prevState) {
            const permission = {...prevState.editPermissions[codename]}
            permission.loading = true;
            return {editPermissions: {...prevState.editPermissions, [codename]: permission}}
        });
        if (value) {
            const reqData = {
                "name": name,
                "codename": codename,
                "is_active": true,
                "practice": sendPractice ? that.props.active_practiceId : null,
                "staff": that.state.currentUser
            }
            const successFn = function (data) {
                that.setState(function (prevState) {
                    return {editPermissions: {...prevState.editPermissions, [codename]: data}}
                })
            }
            const errorFn = function () {
            }
            postAPI(SET_USER_PERMISSION, reqData, successFn, errorFn);
        } else if (that.state.editPermissions[codename].id) {
                const reqData = {
                    // "name": null,
                    // "codename": codename,
                    "is_active": false,
                    // "practice": that.props.active_practiceId,
                    // "user": that.state.currentUser
                }
                const successFn = function (data) {
                    that.setState(function (prevState) {
                        return {editPermissions: {...prevState.editPermissions, [data.codename]: undefined}}
                    })
                }
                const errorFn = function () {

                }
                patchAPI(interpolate(SET_SPECIFIC_USER_PERMISSION, [that.state.editPermissions[codename].id]), reqData, successFn, errorFn);
            } else {

            }
    }

    getAllPermissions = () => {
        const that = this;
        const successFn = function (data) {
            that.setState({
                allPermissions: data.practice_permissions,
                allGlobalPermissions: data.global_permissions
            })
        }
        const errorFn = function () {
        }
        getAPI(ALL_PERMISSIONS, successFn, errorFn);
    }

    editPermissions(user) {
        const that = this;
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
        const successFn = function (data) {
            const permissions = {}
            data.forEach(function (item) {
                permissions[item.codename] = item
            })
            that.setState({
                editPermissions: permissions
            })
        }
        const errorFn = function () {
        }
        getAPI(interpolate(USER_PRACTICE_PERMISSIONS, [user, that.props.active_practiceId]), successFn, errorFn);
    }

    loadData() {
        this.admin_StaffData();
    }

    deleteStaff(value) {
        const that = this;
        const reqData = {
            is_active: false,
        }
        const successFn = function (data) {

            that.loadData();
        };
        const errorFn = function () {
        };
        putAPI(interpolate(SINGLE_PRACTICE_STAFF_API, [value]), reqData, successFn, errorFn);
    }

    staffRoles() {
        const that = this;
        const successFn = function (data) {
            that.setState({
                roles: data,
            })
        }
        const errorFn = function () {
        }
        getAPI(STAFF_ROLES, successFn, errorFn)
    }

    admin_StaffData() {
        const that = this;
        const successFn = function (data) {
            const doctor = [];
            const staff = [];
            data.staff.forEach(function (usersdata) {
                if (usersdata.role == DOCTORS_ROLE) {
                    doctor.push({...usersdata.user,...usersdata});
                } else {
                    staff.push({...usersdata.user,...usersdata});
                }
            })
            that.setState({
                practice_doctors: doctor,
                practice_staff: staff,
                loading: false
            }, function () {
                that.loadDoctorsTiming();
            })
        };
        const errorFn = function () {
            that.setState({
                loading: false
            })
        };
        getAPI(interpolate(PRACTICESTAFF, [this.props.active_practiceId]), successFn, errorFn, {all: true});
    }


    clinicData() {
        const practice = loggedInUserPractices();
        const practiceKeys = Object.keys(practice);
        const that = this;
        const successFn = function (data) {
            const doctor = [];
            const staff = [];
            data.staff.forEach(function (usersdata) {
                if (usersdata.role == DOCTORS_ROLE) {
                    doctor.push({...usersdata.user,...usersdata});
                } else {
                    staff.push({...usersdata.user,...usersdata});
                }
            })
            that.setState({
                practice_doctors: doctor,
                practice_staff: staff,
            }, function () {
                that.loadDoctorsTiming();
            })
        }
        const errorFn = function () {
        };
        getAPI(interpolate(PRACTICESTAFF, [this.props.active_practiceId]), successFn, errorFn);

    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    loadDoctorsTiming = () => {
        const that = this;
        const doctorList = that.state.practice_doctors.map(doctor => doctor.id);
        const successFn = function (data) {
            that.setState(function (prevState) {
                const timingObject = {}
                data.forEach(function (dataObj) {
                    timingObject[dataObj.doctor.id] = dataObj
                })
                return {doctorsTiming: timingObject}
            })
        }
        const errorFn = function () {

        }
        getAPI(interpolate(DOCTOR_VISIT_TIMING_API, [this.props.active_practiceId]), successFn, errorFn, {
            doctor: doctorList.join(',')
        });
    }

    changeTab = (key) => {
        this.setState({
            defaultActiveTab: key
        });
        this.props.history.push(`/settings/clinics-staff${  key}`);
    }

    toggleEnableStaffPractice = (staff, e) => {
        const that = this;
        const successFn = function (data) {
            if (e)
                displayMessage(SUCCESS_MSG_TYPE, "Staff enabled for this practice successfully!!")
            else
                displayMessage(SUCCESS_MSG_TYPE, "Staff disabled for this practice successfully!!")
            that.admin_StaffData();
        }
        const errorFn = function () {

        }
        postAPI(interpolate(ENABLE_STAFF_IN_PRACTICE, [staff]), {
            practice: that.props.active_practiceId,
            is_active: !!e
        }, successFn, errorFn)
    }

    toggleAllPermissions = (type, value) => {
        const that = this;
        const permissionsArray = [];

        if (type == 'LOCAL') {
            that.state.allPermissions.forEach(function (permission) {
                const permObject = {
                    "name": permission.name,
                    "codename": permission.codename,
                    "is_active": !!value,
                    "practice": that.props.active_practiceId,
                    "staff": that.state.currentUser
                };
                if (that.state.editPermissions[permission.codename]) {
                    permObject.id = that.state.editPermissions[permission.codename].id;
                }
                permissionsArray.push(permObject);
            });
        }
        if (type == 'GLOBAL') {
            that.state.allGlobalPermissions.forEach(function (permission) {
                const permObject = {
                    "name": permission.name,
                    "codename": permission.codename,
                    "is_active": !!value,
                    // "practice": that.props.active_practiceId,
                    "staff": that.state.currentUser
                };
                if (that.state.editPermissions[permission.codename]) {
                    permObject.id = that.state.editPermissions[permission.codename].id;
                }
                permissionsArray.push(permObject);
            });
        }
        const successFn = function (data) {
            that.editPermissions(that.state.currentUser);
            that.setState({
                bulkEditLoading: false
            });
        }
        const errorFn = function () {
            that.setState({
                bulkEditLoading: false
            });
        }
        confirm({
            title: 'Are you sure to select all permissions for this user?',
            onOk() {
                that.setState({
                    bulkEditLoading: type
                });
                postAPI(UPDATE_BULK_PERMISSIONS, {permissions: permissionsArray}, successFn, errorFn);
            },
            onCancel() {
                return false;
            },
        })

    }

    render() {
        const that = this;
        const doctorColumns = [{
            title: "Name",
            dataIndex: 'first_name',
            key: "first_name",
        }, {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (value, record) => (record.user && record.user.is_active ? record.user.email : value)
        }, {
            title: "Mobile",
            dataIndex: "mobile",
            key: "mobile",
        }, {
            title: "Registration Number",
            dataIndex: "registration_number",
            key: "registration_number",
        }, {
            title: "Enable Staff",
            dataIndex: "in_practice",
            key: "enable_staff",
            render: (item, record) => (record.user && record.user.is_superuser ?
                <Tag color="red">Not Allowed</Tag> :
                <AntSwitch defaultChecked={!!item} onChange={(e) => that.toggleEnableStaffPractice(record.id, e)} />)
        }, {
            title: "Last Login",
            key: "user",
            render: (text, record) => (record.user && record.user.is_active ? (record.user.last_login ? moment(record.user.last_login).fromNow() : '--') :
                <Tag color="#f50">Activation Pending</Tag>),
        }, {
            title: "Action",
            key: "action",
            render (text, record) {
                return (
<span>
            <Link to={`/settings/clinics-staff/${  record.id  }/edit`}>
              <a>Edit</a>
            </Link>
                     <Divider type="vertical" />
                    {record.user && record.user.is_superuser ?
                        <Tag color="red">SuperUser</Tag> : (
                        <>
                            <a
                              onClick={() => that.editPermissions(record.id)}
                              disabled={!record.in_practice}
                            >Permissions
                            </a>
                            <Divider type="vertical" />
                            <Popconfirm
                              title="Are you sure delete this staff?"
                              onConfirm={() => that.deleteStaff(record.id)}
                              okText="Yes"
                              cancelText="No"
                            >
                                <a>Delete</a>
                            </Popconfirm>
                        </>
                      )}
</span>
)
            }
        }];

        const staffColumns = [{
            title: "Name",
            dataIndex: "first_name",
            key: "name",
        }, {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (value, record) => (record.user && record.user.is_active ? record.user.email : value)
        }, {
            title: "Mobile",
            dataIndex: "mobile",
            key: "mobile",
        }, {
            title: "Enable Staff",
            dataIndex: "in_practice",
            key: "enable_staff",
            render: (item, record) => (record.user && record.user.is_superuser ?
                <Tag color="red">Not Allowed</Tag> :
                <AntSwitch defaultChecked={!!item} onChange={(e) => that.toggleEnableStaffPractice(record.id, e)} />)
        }, {
            title: "Last Login",
            key: "user",
            render: (text, record) => (record.user && record.user.is_active ? (record.user.last_login ? moment(record.user.last_login).fromNow() : '--') :
                <Tag color="#f50">Activation Pending</Tag>),
        }, {
            title: "Action",
            key: "action",
            render (text, record) {
                return (
<span>
            <Link to={`/settings/clinics-staff/staff/${  record.id  }/edit`}>
              <a>Edit</a>
            </Link>
                     <Divider type="vertical" />
                    {record.user && record.user.is_superuser ?
                        <Tag color="red">SuperUser</Tag> : (
                        <>
                            <a
                              onClick={() => that.editPermissions(record.id)}
                              disabled={!record.in_practice}
                            >Permissions
                            </a>
                            <Divider type="vertical" />
                            <Popconfirm
                              title="Are you sure delete this staff?"
                              onConfirm={() => that.deleteStaff(record.id)}
                              okText="Yes"
                              cancelText="No"
                            >
                                <a>Delete</a>
                            </Popconfirm>
                        </>
                      )}
</span>
)
            }
        }];

        const notification_doctor_columns = [{
            title: "Name",
            dataIndex: "user.first_name",
            key: "name",
        }, {
            title: "Confirmation SMS",
            dataIndex: "confirmation_sms",
            key: "confirmation_sms",
            render: confirmation_sms => (
                <span>
            <Checkbox
              checked={confirmation_sms}
            />
                </span>
),
        }, {
            title: "Schedule SMS",
            dataIndex: "schedule_sms",
            key: "schedule_sms",
            render: schedule_sms => (
                <span>
            <Checkbox checked={schedule_sms} />
                </span>
)
        }, {
            title: "Confirmation EMAIL",
            dataIndex: "confirmation_email",
            key: "confirmation_email",
            render: confirmation_email => (
                <span>
            <Checkbox checked={confirmation_email} />
                </span>
)
        }, {
            title: "Online Appointment SMS",
            dataIndex: "online_appointment_sms",
            key: "online_appointment_sms",
            render: online_appointment_sms => (
                <Checkbox checked={online_appointment_sms} />
            )
        }, {
            title: "Action",
            key: "action",
            render (text, record) {
                return (
<span>
            <Link to={`/settings/clinics-staff/${  record.id  }/edit`}>
              <a>Edit</a>
            </Link>
</span>
)
            }
        }];

        const notification_staff_columns = [{
            title: "Name",
            dataIndex: "user.first_name",
            key: "name",
        }, {
            title: "Confirmation SMS",
            dataIndex: "confirmation_sms",
            key: "confirmation_sms",
            render: confirmation_sms => (
                <span>
            <Checkbox
              checked={confirmation_sms}
            />
                </span>
),
        }, {
            title: "Schedule SMS",
            dataIndex: "schedule_sms",
            key: "schedule_sms",
            render: schedule_sms => (
                <span>
            <Checkbox checked={schedule_sms} />
                </span>
)
        }, {
            title: "Confirmation EMAIL",
            dataIndex: "confirmation_email",
            key: "confirmation_email",
            render: confirmation_email => (
                <span>
            <Checkbox checked={confirmation_email} />
                </span>
)
        }, {
            title: "Online Appointment SMS",
            dataIndex: "online_appointment_sms",
            key: "online_appointment_sms",
            render: online_appointment_sms => (
                <Checkbox checked={online_appointment_sms} />
            )
        }, {
            title: "Action",
            key: "action",
            render (text, record) {
                return (record.user && record.is_superuser ?
                    <Tag> Not Allowed</Tag> : (
                    <span>
            <Link to={`/settings/clinics-staff/staff/${  record.id  }/edit`}>
              <a>Edit</a>
            </Link>
                    </span>
                  ))
            }
        }];
        return (
<Row>
            <h2>Practice Staff</h2>
            <Switch>
                <Route
                  path="/settings/clinics-staff/:docId/edit-timing"
                  render={(route) => <DoctorTiming {...this.props} {...route} loadData={that.loadData} />}
                />
                <Route>
                    <Card>
                        <Tabs defaultActiveKey={this.state.defaultActiveTab} onChange={this.changeTab}>
                            <TabPane tab={<span><Icon type="user-add" />Manage Staff</span>} key="#staff">
                                <h2>Doctors
                                    <Link to="/settings/clinics-staff/adddoctor">
                                        <Button type="primary" style={{float: 'right'}}>
                                            <Icon type="plus" />&nbsp;Add Doctor
                                        </Button>
                                    </Link>
                                    <Link to="/settings/clinics-staff/addstaff">
                                        <Button type="primary" style={{float: 'right', marginRight: '5px'}}>
                                            <Icon type="plus" />&nbsp;Add Staff
                                        </Button>
                                    </Link>
                                </h2>

                                <CustomizedTable
                                  loading={this.state.loading}
                                  pagination={false}
                                  columns={doctorColumns}
                                  dataSource={this.state.practice_doctors}
                                />
                                <Divider />
                                <h2>Staff </h2>
                                <CustomizedTable
                                  loading={this.state.loading}
                                  pagination={false}
                                  columns={staffColumns}
                                  dataSource={this.state.practice_staff}
                                />
                            </TabPane>
                            <TabPane tab={<span><Icon type="team" />Staff Notification</span>} key="#notification">
                                <h2>Doctors</h2>
                                <Table
                                  loading={this.state.loading}
                                  pagination={false}
                                  columns={notification_doctor_columns}
                                  dataSource={this.state.practice_doctors}
                                />
                                <Divider />
                                <h2>Staff</h2>
                                <Table
                                  loading={this.state.loading}
                                  pagination={false}
                                  columns={notification_staff_columns}
                                  dataSource={this.state.practice_staff}
                                />
                            </TabPane>
                            <TabPane tab={<span><Icon type="schedule" />Doctors visit Timing</span>} key="#timing">
                                <Table loading={this.state.loading} dataSource={this.state.practice_doctors}>
                                    <Column
                                      title="Name"
                                      dataIndex="user.first_name"
                                      key="name"
                                    />
                                    <Column
                                      title="Visit Timing"
                                      dataIndex="loginstatus"
                                      key="VisitTiming"
                                      render={(text, record) => visitTime(that.state.doctorsTiming[record.id])}
                                    />
                                    <Column
                                      title="Action"
                                      key="action"
                                      render={(text, record) => (
                                                <Link to={`/settings/clinics-staff/${  record.id  }/edit-timing`}>
                                                    <a>Edit Timing</a>
                                                </Link>
                                            )}
                                    />
                                </Table>
                            </TabPane>
                        </Tabs>
                        <Modal
                          title="Edit Permissions"
                          visible={this.state.permissionEditModal}
                          onCancel={() => this.editPermissions()}
                          footer={null}
                        >
                            <Spin spinning={this.state.bulkEditLoading == 'LOCAL'}>
                                <Row>
                                    <h3>
                                        <Checkbox
                                          checked={that.state.allPermissions.length && that.state.allPermissions.reduce((a, b) => a && b && that.state.editPermissions[a.codename] && that.state.editPermissions[b.codename])}
                                          onClick={(e) => this.toggleAllPermissions('LOCAL', e.target.checked)}
                                        >Select
                                            All
                                            Permissions
                                        </Checkbox>
                                    </h3>
                                </Row>
                                {that.state.allPermissions.map(item => (
<Row>
                                    <Checkbox
                                      value={item.codename}
                                      checked={that.state.editPermissions[item.codename]}
                                      disabled={that.state.editPermissions[item.codename] && that.state.editPermissions[item.codename].loading}
                                      onClick={(e) => this.setPermission(item.codename, item.name, e, true)}
                                    >{item.id} {item.name}
                                    </Checkbox>
</Row>
))}
                            </Spin>
                            <Divider>Global Permissions</Divider>
                            <Spin spinning={this.state.bulkEditLoading == 'GLOBAL'}>
                                <Row>
                                    <h3>
                                        <Checkbox
                                          checked={that.state.allGlobalPermissions.length && that.state.allGlobalPermissions.reduce((a, b) => a && b && that.state.editPermissions[a.codename] && that.state.editPermissions[b.codename])}
                                          onClick={(e) => this.toggleAllPermissions('GLOBAL', e.target.checked)}
                                        >Select
                                            All
                                            Permissions
                                        </Checkbox>
                                    </h3>
                                </Row>
                                {that.state.allGlobalPermissions.map(item => (
<Row>
                                    <Checkbox
                                      value={item.codename}
                                      checked={that.state.editPermissions[item.codename]}
                                      disabled={that.state.editPermissions[item.codename] && that.state.editPermissions[item.codename].loading}
                                      onClick={(e) => this.setPermission(item.codename, item.name, e, false)}
                                      style={{display: 'list-item'}}
                                    >{item.id} {item.name}
                                    </Checkbox>
</Row>
))}
                            </Spin>
                        </Modal>
                    </Card>
                </Route>
            </Switch>

</Row>
)
    }
}

function visitTime(visitObj) {
    if (visitObj) {
        return (visitObj.visting_hour_same_week ? (
            <span>
                <b>Mon-Sun : </b>{momentTime(visitObj.first_start_time)}
                {visitObj.is_two_sessions ? `-${  momentTime(visitObj.first_end_time)  } ||LUNCH|| ${  momentTime(visitObj.second_start_time)}` : null}
                -{momentTime(visitObj.second_end_time)}
            </span>
          )
            : DAY_KEYS.map(dayKey =>
                visitObj[dayKey] ? (
<span>
                        <b>{dayKey} : </b>
                    {momentTime(visitObj[`first_start_time_${dayKey}`])}
                    {visitObj[`is_two_sessions_${dayKey}`] ? `-${  momentTime(visitObj[`first_end_time_${dayKey}`])  }||LUNCH||${  momentTime(visitObj[`second_start_time_${dayKey}`])}` : null}
                    -{momentTime(visitObj[`second_end_time_${dayKey}`])}
                    <br />
</span>
) : null
            ))
    }
    return null
}


function momentTime(timeStr) {
    return moment(timeStr, "HH:mm").format("HH:mm")
}

export default PracticeDetails;
