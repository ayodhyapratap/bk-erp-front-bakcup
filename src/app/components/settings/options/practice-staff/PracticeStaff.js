import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Divider, Tag , Row, Table} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {PRACTICESTAFF} from "../../../../constants/api"
import {Link} from "react-router-dom";
import {getAPI} from "../../../../utils/common"

const { Column, ColumnGroup } = Table;

class PracticeDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
      var that = this;
        let successFn = function (data) {
          console.log("get table");
        };
        let errorFn = function () {
        };
        getAPI(PRACTICESTAFF, successFn, errorFn);
      }



    render() {
        return <Row>
            <h2>Title
                <Link to="/settings/clinics-staff/adddoctor">
                    <Button type="primary" style={{float: 'right'}}>
                        <Icon type="plus"/>&nbsp;Add
                    </Button>
                </Link>
            </h2>
            <Card>
                <Table>
                <Column
                  title="Name"
                  dataIndex="name"
                  key="name"
                  />
                  <Column
                  title="Roles"
                  dataIndex="role"
                  key="role"
                  render={tags => (
                    <span>
                      {tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
                    </span>
                  )}
                  />
                  <Column
                  title="Login Status"
                  dataIndex="loginstatus"
                  key="loginstatus"
                  />
                  <Column
                  title="Last Logged in"
                  dataIndex="lastloggedin"
                  key="lastloggedin"
                  />
                  <Column
                  title="Action	"
                  key="action"
                  render={(text, record) => (
                    <span>
                      <a href="javascript:;">edit {record.name}</a>
                      <Divider type="vertical" />
                      <a href="javascript:;">Delete</a>
                    </span>
                  )}
                  />

                </Table>
            </Card>
        </Row>
    }
}

export default PracticeDetails;
