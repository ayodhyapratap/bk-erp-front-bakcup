import React from "react";
import {Divider, Popconfirm, Row} from 'antd';
import CustomizedTable from "../../../common/CustomizedTable";
import {getAPI, interpolate, postAPI, putAPI} from "../../../../utils/common";
import {MEMBERSHIP_API, OFFERS} from "../../../../constants/api";
import AddMembership from "./AddMembership";

export default class Membership extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            membership: []
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let that = this;
        let successFn = function (data) {
            that.setState({
                membership: data
            })
        }
        let errorFn = function () {

        }
        getAPI(MEMBERSHIP_API, successFn, errorFn);
    }

    deleteObject(record) {
        let that = this;
        let reqData = {
            is_active:false,
            id:record.id,
        };
        let successFn = function (data) {
            that.loadData();
        }
        let errorFn = function () {
        }
        postAPI(MEMBERSHIP_API, reqData, successFn, errorFn);
    }

    render() {
        let that = this;
        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: 'Fee (INR)',
            dataIndex: 'fee',
            key: 'fee',
        }, {
            title: 'Benefit (%)',
            dataIndex: 'benefit',
            key: 'benefit',
        }, {
            title: 'Validity (Months)',
            dataIndex: 'validity',
            key: 'validity'
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Popconfirm title="Are you sure delete this prescription?" onConfirm={() => that.deleteObject(record)}
                            okText="Yes" cancelText="No">
                    <a>
                        Delete
                    </a>
                </Popconfirm>
            ),
        }];
        return <Row>
            <AddMembership {...this.props} loadData={this.loadData}/>
            <Divider/>
            <CustomizedTable loading={this.state.loading} columns={columns} dataSource={this.state.membership}/>
        </Row>
    }
}
