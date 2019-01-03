import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Tabs, Divider, Tag, Row, Table} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {PROCEDURE_CATEGORY} from "../../../../constants/api"
import {Link} from "react-router-dom";
import {getAPI, interpolate} from "../../../../utils/common";

const {Column, ColumnGroup} = Table;
const TabPane = Tabs.TabPane;

class RecentProcedure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'staff',
            procedure_category: null,
        }
    }

    componentDidMount(){
      this.loadData();
    }
    loadData(){
        var that = this;
        let successFn = function (data) {
            console.log("get table");
            that.setState({
                procedure_category: data,
            })
        };
        let errorFn = function () {
        };
        getAPI(interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]), successFn, errorFn);
    }


    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }
    deleteObject(record) {
        let that = this;
        let reqData = record;
        reqData.is_active = false;
        let successFn = function (data) {
            that.loadData();
        }
        let errorFn = function () {
        };
        postAPI(interpolate(PROCEDURE_CATEGORY, [this.props.active_practiceId]), reqData, successFn, errorFn)
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
                <Tabs defaultActiveKey="procedurecatalog">

                    <TabPane tab={<span><Icon type="android"/>Procedure Catalog</span>} key="procedurecatalog">
                        <Table dataSource={this.state.procedure_category}>
                            <Column
                                title="Procedure Name"
                                dataIndex="name"
                                key="name"
                            />
                            <Column
                                title="Procedure Unit Cost"
                                dataIndex="cost"
                                key="cost"
                            />
                            <Column
                                title="Applicable Taxes"
                                dataIndex="taxes"
                                key="taxes"
                                render={taxes => (
                                    <span>
                        {taxes.map(tag => <Tag color="blue" key={taxes}>{taxes}</Tag>)}
                      </span>
                                )}
                            />
                            <Column
                                title="Standard Notes	"
                                dataIndex="default_notes"
                                key="default_notes"
                            />
                            <Column
                                title="Action	"
                                key="action"
                                render={(text, record) => (
                                    <span>
                      <Link to="/settings/clinics-staff/adddoctor">
                        <a>edit {record.name}</a></Link>
                        <Divider type="vertical"/>
                        <Popconfirm title="Are you sure delete this?"
                                    onConfirm={() => that.deleteObject(record)} okText="Yes" cancelText="No">
                          <a>Delete</a>
                      </Popconfirm>
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
