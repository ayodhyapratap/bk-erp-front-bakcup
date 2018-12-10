import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card,Divider, Form, Icon, Row, Table} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {Link} from "react-router-dom";
import {DRUG_CATALOG, } from "../../../../constants/api";
import {getAPI, deleteAPI, interpolate} from "../../../../utils/common";

class Prescriptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          catalog: null
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
            catalog:data,
          })
        };
        let errorFn = function () {
        };
       getAPI(interpolate( DRUG_CATALOG, [this.props.active_practiceId]), successFn, errorFn);
    }

    render() {
       const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'code',
          }, {
            title: 'Dosage',
            dataIndex: 'strength',
            key: 'strength',
          },{
            title:' drug Instructions',
            dataIndex:'instruction',
            key:'instruction',
          },{
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <span><a>
                Edit</a>
                <Divider type="vertical" />
                delete
              </span>
            ),
          }];
        return <Row>
            <h2>All presciptions
                <Link to="/settings/prescriptions/add">
                    <Button type="primary" style={{float: 'right'}}>
                        <Icon type="plus"/>&nbsp;Add
                    </Button>
                </Link>
            </h2>
            <Card>
                <Table columns={columns} dataSource={this.state.catalog}>

                </Table>
            </Card>
        </Row>
    }
}

export default Prescriptions;
