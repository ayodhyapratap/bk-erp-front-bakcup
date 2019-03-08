import React from "react";
import {Button, Divider, Card, Icon, Row, Table} from "antd";
import {Link} from "react-router-dom";
import {ALL_PRACTICE, PRACTICE_DELETE} from "../../../../constants/api";
import {getAPI, interpolate, postAPI} from "../../../../utils/common";


class PracticeDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            practiceList: [],
            specialisations: null,
        };
        this.deletePractice = this.deletePractice.bind(this);
    }

    componentDidMount() {
        // this.props.refreshClinicData();
        this.admin_practiceData();
    }

    admin_practiceData() {
        var that = this;
        let successFn = function (data) {
            let specialisations = {};
            data[0].specialisations.forEach(function (speciality) {
                specialisations[speciality.id] = speciality
            });
            console.log(specialisations);

            that.setState({
                practiceList: data,
                specialisations: specialisations,
            })
        };
        let errorFn = function () {
        };
        getAPI(ALL_PRACTICE, successFn, errorFn);

    }

    // clinicData(){
    //   let  practice=loggedInUserPractices();
    //   console.log(practice);
    //   var practiceKeys = Object.keys(practice);
    //   let practiceArray = [];
    //   practiceKeys.forEach(function(key){
    //     let successFn = function (data) {
    //       practiceArray.push(data)
    //       console.log(practiceArray);
    //     }
    //     let errorFn = function () {
    //     };
    //     getAPI(interpolate(PRACTICE,[key]), successFn, errorFn);
    //
    //   });
    //   this.setState({
    //     practiceList:practiceArray
    //   })
    //
    // }

    deletePractice(value) {
        var that = this;
        let successFn = function (data) {
            console.log("data");
            that.props.refreshClinicData();
        };
        let errorFn = function () {
        };
        postAPI(interpolate(PRACTICE_DELETE, [value]), {}, successFn, errorFn);

    }

    render() {
        let that = this;
        let specialisations = {};
        if (this.props.activePracticeData) {
            this.props.activePracticeData.specialisations.forEach(function (speciality) {
                specialisations[speciality.id] = speciality.name
            });
        }
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
            title: 'Specialisation',
            key: 'specialisation',
            dataIndex: 'specialisation',
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                <Link to={'/settings/clinics/' + record.id + '/edit'}>Edit</Link>
                <Divider type="vertical"/>
                    {that.props.practiceList.length > 1
                        ? <a onClick={() => this.deletePractice(record.id)}>Delete</a> : null}
              </span>
            ),
        }];

        return <Row>
            <h2>Practice Details
                <Link to="/settings/clinics/add">
                    <Button type="primary" style={{float: 'right'}}>
                        <Icon type="plus"/>&nbsp;Add
                    </Button>
                </Link>
            </h2>
            <Card>
                <Table pagination={false} columns={columns} dataSource={this.state.practiceList}/>
            </Card>
        </Row>
    }
}

export default PracticeDetails;
