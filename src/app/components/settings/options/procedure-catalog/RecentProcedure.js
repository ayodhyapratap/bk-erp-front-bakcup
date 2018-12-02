import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon,Tabs, Divider, Tag , Row, Table} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {PRACTICESTAFF} from "../../../../constants/api"
import {Link} from "react-router-dom";
import {getAPI} from "../../../../utils/common";

const { Column, ColumnGroup } = Table;
const TabPane = Tabs.TabPane;

class RecentProcedure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          current: 'staff',
        }
    }


    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
          current: e.key,
        });
      }


    render() {
        return <Row>
            <h2>Procedures
                <Link to="/settings/procedures/addprocedure">
                    <Button type="primary" style={{float: 'right'}}>
                        <Icon type="plus"/>&nbsp;Add Procedure
                    </Button>
                </Link>
            </h2>
            <Card>
            <Tabs defaultActiveKey="procedurecatalog" >

              <TabPane tab={<span><Icon type="android" />Procedure Catalog</span>} key="procedurecatalog">
                <Table>
                  <Column
                    title="Procedure Name"
                    dataIndex="name"
                    key="name"
                    />
                  <Column
                    title="Procedure Unit Cost"
                    dataIndex="name"
                    key="cost"
                    />
                    <Column
                    title="Applicable Taxes"
                    dataIndex="role"
                    key="role"
                    render={tags => (
                      <span>
                        {tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
                      </span>
                    )}
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

                </Tabs>

            </Card>
        </Row>
    }
}

export default RecentProcedure;
