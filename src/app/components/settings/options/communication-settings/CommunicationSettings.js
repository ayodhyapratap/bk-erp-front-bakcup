import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form,Button, Card, Icon,Tabs, Divider, Tag , Row, Table} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import WishSMS from "./WishSMS";
import AppointmentSMS from "./AppointmentSMS";
import Emails from "./Emails";
const TabPane = Tabs.TabPane;


class CommunicationSettings extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
          <Row>
          <h2>Communication Settings</h2>
          <Card>
            <Tabs defaultActiveKey="appointmentsms" >
              <TabPane tab={<span><Icon type="android" />Appointment & FollowUp SMS</span>} key="appointmentsms">
                <AppointmentSMS {...this.props}/>
              </TabPane>
              {/*<TabPane tab={<span><Icon type="android" />Wish SMS</span>} key="wishsms">*/}
                {/*<WishSMS/>*/}
              {/*</TabPane>*/}
              {/*<TabPane tab={<span><Icon type="android" />Emails</span>} key="emails">*/}
                {/*<Emails/>*/}
              {/*</TabPane>*/}
            </Tabs>

          </Card>
          </Row>
        </div>
    }
}

export default CommunicationSettings;
