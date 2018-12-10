import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card,Divider, Form, Icon, Row, Table} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {Link} from "react-router-dom";
import {ALL_PRACTICE, OFFERS} from "../../../../constants/api";
import {getAPI, deleteAPI, interpolate} from "../../../../utils/common";

class Prescriptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          offers: [{
            name: 'Mike',
            dosage: 32,
            instructions: '10 Downing Street'
          },{
            name: 'Mike',
            dosage: 32,
            instructions: '10 Downing Street'
          },{
            name: 'Mike',
            dosage: 32,
            instructions: '10 Downing Street'
          },{
            name: 'Mike',
            dosage: 32,
            instructions: '10 Downing Street'
          },]
        }
    }

    render() {
       const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'code',
          }, {
            title: 'Dosage',
            dataIndex: 'dosage',
            key: 'dosage',
          },{
            title:' drug Instructions',
            dataIndex:'instructions',
            key:'instructions',
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
                <Table columns={columns} dataSource={this.state.offers}>

                </Table>
            </Card>
        </Row>
    }
}

export default Prescriptions;
