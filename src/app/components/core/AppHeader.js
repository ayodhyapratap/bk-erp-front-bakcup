import React from "react";
import {AutoComplete, Avatar, Button, Dropdown, Icon, Layout, List, Menu, Select, Tag} from "antd";
import {Link} from 'react-router-dom';
import {getAPI, interpolate, makeFileURL} from "../../utils/common";
import {PATIENT_PROFILE, SEARCH_PATIENT} from "../../constants/api";
import {hideMobile} from "../../utils/permissionUtils";

const {Header} = Layout;

class AppHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patientListData: [],
            searchPatientString: null,
        }
    }

    searchPatient = (value) => {
        let that=this;
        this.setState({
            searchPatientString: value
        });
        let successFn = function (data) {
            if (data) {
                that.setState({
                    patientListData: data.results,

                })
                // console.log("list",that.state.patientListData);
            }
        };
        let errorFn = function (data) {
            that.setState({
                searchPatientString:null,
            })
        };
        getAPI(interpolate(SEARCH_PATIENT, [value]), successFn, errorFn);
    }


    handlePatientSelect = (event) => {
        if (event) {
            this.props.history.push("/patient/" + event + "/profile");
            this.setState({
                searchPatientString:null,
                patientListData:null,
            })
            let that = this;
            let successFn = function (data) {
                that.setState({
                    patientDetails: data

                });
                // console.log("event",that.state.patientDetails);
            };
            let errorFn = function () {
            };
            getAPI(interpolate(PATIENT_PROFILE, [event]), successFn, errorFn);
        }
    }

    render() {
        let that = this;
        const userMenu = (
            <Menu>
                <Menu.Item key="profile">
                    <Link to="/profile">Profile</Link>
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item key={"website"}>
                    <a href={'https://bkarogyam.com'}>
                        <small>Switch to Website ></small>
                    </a>
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="logout">
                    <a onClick={this.props.logout}>Log out</a>
                </Menu.Item>
            </Menu>
        );
        return <Header style={{background: '#fff', padding: 0, boxShadow: '0 2px 4px 0 rgba(38,50,69,.2)', zIndex: 1}}>
            <div style={{float: 'left', margin: '0px 20px'}}>
                <Icon
                    className="trigger"
                    type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={() => this.props.toggleSider(!this.props.collapsed)}
                />
            </div>
            <Menu mode="horizontal"
                  style={{lineHeight: '64px'}}>
                <Menu.Item key="5">
                    <AutoComplete placeholder="Patient Name"
                                  showSearch
                                  onSearch={this.searchPatient}
                                  defaultActiveFirstOption={false}
                                  showArrow={false}
                                  value={this.state.searchPatientString}
                                  filterOption={false}
                                  onSelect={this.handlePatientSelect}>
                        {this.state.patientListData.map((option) => <AutoComplete.Option
                            value={option.id.toString()}>
                            <List.Item style={{padding: 0}}>
                                <List.Item.Meta
                                    avatar={<Avatar
                                        src={option.image ? makeFileURL(option.image) : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>}
                                    title={option.user.first_name + " (" + option.user.id + ")"}
                                    description={that.props.activePracticePermissions.PatientPhoneNumber ? option.user.mobile : hideMobile(option.user.mobile)}
                                />
                            </List.Item>
                        </AutoComplete.Option>)}
                    </AutoComplete>
                </Menu.Item>
                <Menu.Item key="4">
                    <Button.Group>
                        {that.props.activePracticePermissions.AddPatient || that.props.allowAllPermissions ?
                            <Link to={"/patients/profile/add"}>
                                <Button type={"primary"}>
                                    <Icon type={"plus"}/>Add Patient
                                </Button>
                            </Link> : null}
                        {that.props.activePracticePermissions.MergePatients || that.props.allowAllPermissions ?
                            <Link to={"/patients/merge"}>
                                <Button type={"primary"}>
                                    <Icon type={"user-add"}/>Merge Patients
                                </Button>
                            </Link> : null}
                    </Button.Group>
                </Menu.Item>
                <Menu.Item key="3">
                    <Select onChange={this.props.switchPractice} defaultValue={this.props.active_practiceId}
                            value={this.props.active_practiceId}
                            style={{width: '300px', maxWidth: '70vw'}}>
                        {this.props.practiceList && this.props.practiceList.map((option) => <Select.Option
                            key={option.practice.id}
                            value={option.practice.id}>{option.practice.name}</Select.Option>)}
                    </Select>
                </Menu.Item>
                {/*<Menu.Item key="3"><Search*/}
                {/*placeholder="Search"*/}
                {/*onSearch={value => console.log(value)}*/}
                {/*style={{width: 200}}*/}
                {/*/></Menu.Item>*/}

                <div style={{float: 'right', margin: '0px 20px'}}>
                    {this.props.user && this.props.user.is_superuser ? <Tag color={"red"}>SuperUser</Tag> : null}
                    <Dropdown overlay={userMenu} placement="bottomRight">

                        <Avatar style={{backgroundColor: '#87d068'}} icon="user"/>
                    </Dropdown>
                </div>

            </Menu>
        </Header>
    }
}

export default AppHeader;
