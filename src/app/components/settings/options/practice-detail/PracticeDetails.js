import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button,Divider, Tag,  Card, Form, Icon, Row, Table} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {Link} from "react-router-dom";
import {ALL_PRACTICE, PRACTICE} from "../../../../constants/api";
import {getAPI, deleteAPI, interpolate} from "../../../../utils/common";

const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: 'Tagline',
      dataIndex: 'tagline',
      key: 'tagline',
    }, {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: 'specialisation',
      key: 'specialisation',
      dataIndex: 'specialisation',
      render: specialisation => (
        <span>
           <Tag color="blue" key={specialisation}>{specialisation}</Tag>
        </span>
      ),
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Link to={'/settings/clinics/' + record.id + '/edit'}>Edit</Link>
          <Divider type="vertical" />
          <a onClick={this.deletePractice}>Delete</a>
        </span>
      ),
    }];

class PracticeDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          practiceList: null,
        };
    }

    componentDidMount() {
    this.practiceData();
    }
    practiceData(){
      var that = this;
      let successFn = function (data) {
        let specialisations = {};
        data[0].specialisations.forEach(function(speciality){
          specialisations[speciality.id] = speciality
        });
        console.log(specialisations);

        that.setState({
        practiceList: data,
        specialisations:specialisations,
        })
      };
      let errorFn = function () {
      };
      getAPI(ALL_PRACTICE, successFn, errorFn);

    }

    deletePractice(value){
      var that = this;
      let successFn = function (data) {
        that.practiceData();
        console.log("Deleted");
      };
      let errorFn = function () {
      };
      deleteAPI(interpolate(PRACTICE,[value]), successFn, errorFn);

    }

    render() {
      const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <a href="javascript:;">{text}</a>,
          }, {
            title: 'Tagline',
            dataIndex: 'tagline',
            key: 'tagline',
          }, {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
          }, {
            title: 'specialisation',
            key: 'specialisation',
            dataIndex: 'specialisation',
            render: specialisation => (
              <span>
                 <Tag color="blue" key={specialisation}>{specialisation}</Tag>
              </span>
            ),
          }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <span>
                <Link to={'/settings/clinics/' + record.id + '/edit'}>Edit</Link>
                <Divider type="vertical" />
                <a onClick={() => this.deletePractice(record.id)}>Delete</a>
              </span>
            ),
          }];

        return <Row>
            <h2>Title
                <Link to="/settings/clinics/add">
                    <Button type="primary" style={{float: 'right'}}>
                        <Icon type="plus"/>&nbsp;Add
                    </Button>
                </Link>
            </h2>
            <Card>
                <Table columns={columns} dataSource={this.state.practiceList} />
            </Card>
        </Row>
    }
}

export default PracticeDetails;
