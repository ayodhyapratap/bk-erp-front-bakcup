import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon,Tabs, Divider, Tag , Row, Table} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {PRACTICESTAFF} from "../../../../constants/api"
import {Link} from "react-router-dom";
import {getAPI, interpolate} from "../../../../utils/common";

const { Column, ColumnGroup } = Table;
const TabPane = Tabs.TabPane;

class PracticeDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          current: 'staff',
          practice_staff:null,

        }
    }

    componentDidMount() {
      var that = this;
        let successFn = function (data) {
          console.log("get table");
          that.setState({
            practice_staff:data.staff,
          })
        };
        let errorFn = function () {
        };
        getAPI(interpolate( PRACTICESTAFF, [2]), successFn, errorFn);
      }

    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
          current: e.key,
        });
      }


    render() {
      console.log(this.state.practice_staff);
        return <Row>
            <h2>Practice Staff
                <Link to="/settings/clinics-staff/adddoctor">
                    <Button type="primary" style={{float: 'right'}}>
                        <Icon type="plus"/>&nbsp;Add
                    </Button>
                </Link>
            </h2>
            <Card>
            <Tabs defaultActiveKey="staff" >

              <TabPane tab={<span><Icon type="android" />Manage Staff</span>} key="staff">
                <Table dataSource={this.state.practice_staff}>
                  <Column
                    title="Name"
                    dataIndex="name"
                    key="name"
                    />
                    <Column
                    title="Email"
                    dataIndex="email"
                    key="email"

                    />
                    <Column
                    title="mobile"
                    dataIndex="mobile"
                    key="mobile"
                    />
                    <Column
                    title="registration_number"
                    dataIndex="registration_number"
                    key="registration_number"
                    />
                    <Column
                    title="Action	"
                    key="action"
                    render={(text, record) => (
                      <span>
                      <Link to="/settings/clinics-staff/adddoctor">
                        <a>edit {record.name}</a></Link>
                        <Divider type="vertical" />
                        <a href="javascript:;">Delete</a>
                      </span>
                    )}
                    />

                </Table>
                </TabPane>
                <TabPane tab={<span><Icon type="android" />Staff Notification</span>} key="notification">
                  <Table>
                    <Column
                      title="Name"
                      dataIndex="name"
                      key="name"
                      />
                      <Column
                      title="Confirmation SMS"
                      dataIndex="loginstatus"
                      key="confirmationSms"
                      
                      />
                      <Column
                      title="Schedule SMS"
                      dataIndex="lastloggedin"
                      key="ScheduleSMS"
                      />
                      />
                      <Column
                      title="Confirmation EMAIL"
                      dataIndex="loginstatus"
                      key="ConfirmationEMAIL"
                      />
                      />
                      <Column
                      title="Schedule EMAIL"
                      dataIndex="loginstatus"
                      key="ScheduleEMAIL"
                      />

                  </Table>
                </TabPane>
                <TabPane tab={<span><Icon type="android" />Doctors visit Timing</span>} key="timing">
                    <Table>
                      <Column
                        title="Name"
                        dataIndex="name"
                        key="name"
                        />
                        <Column
                        title="Visit Timing"
                        dataIndex="loginstatus"
                        key="VisitTiming"
                        />

                        <Column
                        title="Action	"
                        key="action"
                        render={(text, record) => (
                          <span>
                          <Link to="/settings/clinics-staff/adddoctor">
                            <a>edit {record.name}</a></Link>
                          </span>
                        )}
                        />

                    </Table>
                  </TabPane>
                </Tabs>

            </Card>
        </Row>
    }
}

export default PracticeDetails;
