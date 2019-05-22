import React from "react";
import {Card} from 'antd';
import {getAPI, interpolate} from "../../../utils/common";
import {PATIENT_GROUPS} from "../../../constants/api";
import CustomizedTable from "../../common/CustomizedTable";

export default class PatientGroups extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patientGroup: [],
            loading: true
        }
    }

    componentDidMount() {
        this.getPatientGroup();
    }

    getPatientGroup() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                patientGroup: data,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })

        };
        getAPI(interpolate(PATIENT_GROUPS, [this.props.active_practiceId]), successFn, errorFn);
    }

    render() {
        const coloumns = [{
            title: 'Group Name',
            dataIndex: 'name',
            key: 'name'
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
        return <Card title={"Patient Groups"}>
            <CustomizedTable dataSource={this.state.patientGroup} loading={this.state.loading}/>
        </Card>
    }
}
