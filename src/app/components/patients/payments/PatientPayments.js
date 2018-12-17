import React from "react";
import {Card, Divider, Table, Tag} from "antd";

class PatientPayments extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        const columns = [{
            title: 'reciept Number',
            dataIndex: 'name',
            key: 'name',
            render: text => <a href="javascript:;">{text}</a>,
        }, {
            title: 'Amount (rs)',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: 'Invoice',
            dataIndex: 'address',
            key: 'address',
        }, {
            title: 'Payment Type',
            key: 'tags',
            dataIndex: 'tags',
            render: tags => (
                <span>
      {tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
    </span>
            ),
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
      <a href="javascript:;">Invite {record.name}</a>
      <Divider type="vertical" />
      <a href="javascript:;">Delete</a>
    </span>
            ),
        }];

        const dataSource = [{
            key: '1',
            name: 'l54',
            age: 352,
            address: '124',
            tags: ['card', 'bank'],
        }, {
            key: '2',
            name: 'l44',
            age: 4525,
            address: '1235.',
            tags: ['cheque'],
        }, {
            key: '3',
            name: 'l52',
            age: 5412,
            address: '124',
            tags: ['Cash'],
        }];
        return <Card title="Patient Payments">
            <Table dataSource={dataSource} columns={columns} />
        </Card>
    }
}
export default PatientPayments;
