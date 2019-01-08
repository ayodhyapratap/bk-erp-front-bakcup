import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Checkbox, Card, Form, Icon, Tabs, Divider, Tag, Row, Table} from "antd";
import {CHECKBOX_FIELD, DOCTORS_ROLE, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {
    PRACTICESTAFF,
    STAFF_ROLES,
    ALL_PRACTICE_STAFF,
    ALL_PRACTICE_DOCTORS,
    SINGLE_PRACTICE_STAFF_API
} from "../../../../constants/api"
import {Link} from "react-router-dom";
import {deleteAPI, getAPI, interpolate} from "../../../../utils/common";
import {loggedInUserGroup, loggedInUserPractices} from "../../../../../app/utils/auth";

const {Column, ColumnGroup} = Table;
const TabPane = Tabs.TabPane;

class PracticeDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'staff',
            practice_staff: [],
            practice_doctors: [],
            roles: null
        }
        this.staffRoles();
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        let group = loggedInUserGroup();
        if (group[0].name == "Admin") {
            this.admin_StaffData();
        }
        else {
            this.clinicData();
        }

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
            // data.forEach(function (usersdata) {
            //     if (usersdata.role == DOCTORS_ROLE) {
            //         let doctor = that.state.practice_doctors;
            //         doctor.push(usersdata);
            //
            //     } else {
            //         let doctor = that.state.practice_staff;
            //         doctor.push(usersdata);
            //         that.setState({
            //             practice_staff: doctor,
            //         })
            //     }
            // })
            that.setState({
                practice_doctors: data.doctors,
                practice_staff: data.staff,
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

        const columns = [{
            title: "Name",
            dataIndex: "name",
            key: "name",
        }, {
            title: "Email",
            dataIndex: "email",
            key: "email",
        }, {
            title: "mobile",
            dataIndex: "mobile",
            key: "mobile",
        }, {
            title: "registration_number",
            dataIndex: "registration_number",
            key: "registration_number",
        }, {
            title: "Status",
            key: "user",
            render: (text, record) => (record.user && record.user.is_active ? <Tag color="#87d068">Active</Tag> : <Tag color="#f50">Pending</Tag>),
        }, {
            title: "Action	",
            key: "action",
            render: (text, record) => (
                <span>
            <Link to={"/settings/clinics-staff/" + record.id + "/edit"}>
              <a>Edit</a></Link>
              <Divider type="vertical"/>
              <a onClick={() => this.deleteStaff(record.id)}>Delete</a>
            </span>
            )
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
                    <TabPane tab={<span><Icon type="android"/>Manage Staff</span>} key="staff">
                        <h2>Doctors <Link to="/settings/clinics-staff/adddoctor">
                            <Button type="primary" style={{float: 'right'}}>
                                <Icon type="plus"/>&nbsp;Add Doctor/Staff
                            </Button>
                        </Link></h2>
                        <Table columns={columns} dataSource={this.state.practice_doctors}/>
                        <h2>Staff </h2>
                        <Table columns={columns} dataSource={this.state.practice_staff}/>
                    </TabPane>
                    <TabPane tab={<span><Icon type="android"/>Staff Notification</span>} key="notification">
                        <h2>Doctors</h2>
                        <Table columns={notification_columns} dataSource={this.state.practice_doctors}/>
                        <h2>Staff</h2>
                        <Table columns={notification_columns} dataSource={this.state.practice_staff}/>
                    </TabPane>
                    <TabPane tab={<span><Icon type="android"/>Doctors visit Timing</span>} key="timing">
                        <Table>
                            <Column title="Name"
                                    dataIndex="name"
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
            </Card>
        </Row>
    }
}

export default PracticeDetails;
