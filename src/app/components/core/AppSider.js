import React from "react";
import {Divider, Icon, Layout, Menu} from 'antd';
import {Link} from 'react-router-dom';
import Applogo from '../../assets/img/kidneycarelogo.png'

const Sider = Layout.Sider;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class AppSider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openKeys: [],
        }
    }

    onOpenChange = (openKeys) => {
        const rootSubmenuKeys = ['sub1', 'sub2'];
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({openKeys});
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }

    render() {
        let that = this;
        return <Sider
            // style={{background: '#fff'}}
            trigger={null}
            collapsible
            collapsed={this.props.collapsed}
            style={{zIndex: 1}}
            breakpoint="xl"
            // collapsedWidth="0"
            onBreakpoint={(broken) => {
                console.log(broken);
                that.props.toggleSider(broken);
            }}
            onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
            }}>
            <img src={Applogo} alt="" style={{width: '100%',padding:'20px'}}/>

            <Menu mode="inline" defaultSelectedKeys={['1']}
                  openKeys={this.state.openKeys}
                  onOpenChange={this.onOpenChange}
                  theme="dark">
                <Menu.Item key="1">
                    <Link to="/calendar">
                        <Icon type="schedule"/>
                        <span className="nav-text">Calendar</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="26">
                    <Link to="/patients">
                        <Icon type="user"/>
                        <span className="nav-text">Patients</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="27">
                    <Link to="/reports">
                        <Icon type="bar-chart"/>
                        <span className="nav-text">Reports</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="5">
                    <Link to="/settings/clinics">
                        <Icon type="setting"/>
                        <span className="nav-text">Settings</span>
                    </Link>
                </Menu.Item>
                <SubMenu key="sub1" title={<span><Icon type="gold"/><span>Back Office</span></span>}>
                    <Menu.Item key="6">
                        <Link to="/inventory/expenses">
                            <Icon type="credit-card"/>
                            <span className="nav-text">Expenses</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="7">
                        <Link to="/inventory/activity">
                            <Icon type="bell"/>
                            <span className="nav-text">Activities</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="8">
                        <Link to="/inventory/manufacture">
                            <Icon type="database"/>
                            <span className="nav-text">Manufactures</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="42">
                        <Link to="/inventory/vendor">
                            <Icon type="database"/>
                            <span className="nav-text">Vendor</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="9">
                        <Link to="/inventory/lab">
                            <Icon type="experiment"/>
                            <span className="nav-text">Labs</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="10">
                        <Link to="/inventory">
                            <Icon type="gold"/>
                            <span className="nav-text">Inventory</span>
                        </Link>
                    </Menu.Item>
                </SubMenu>
                <Menu.Item key="30">
                    <Link to="/mlm">
                      <Icon type="wallet" />
                        <span className="nav-text">MLM</span>
                    </Link>
                </Menu.Item>
                <SubMenu key="web" title={<span><Icon type="google"/><span>Web Admin</span></span>}>
                    <Menu.Item key="web-1">
                        <Link to="/web/videos">
                            <Icon type="youtube"/>
                            <span className="nav-text">Videos</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="web-2">
                        <Link to="/web/disease">
                            <Icon type="bell"/>
                            <span className="nav-text">Disease</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="web-3">
                        <Link to="/web/blog">
                            <Icon type="database"/>
                            <span className="nav-text">Blogs</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="web-4">
                        <Link to="/web/event">
                            <Icon type="notification"/>
                            <span className="nav-text">Events</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="web-5">
                        <Link to="/web/contact">
                            <Icon type="phone"/>
                            <span className="nav-text">Contacts</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="web-6">
                        <Link to="/web/pageseo">
                            <Icon type="phone"/>
                            <span className="nav-text">Page SEO</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="web-7">
                        <Link to="/web/slider-image">
                            <Icon type="picture"/>
                            <span className="nav-text">Slider Image</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="web-8">
                        <Link to="/web/facilities">
                            <Icon type="phone"/>
                            <span className="nav-text">Facilities</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="web-9">
                        <Link to="/web/landingpagevideo">
                            <Icon type="video-camera"/>
                            <span className="nav-text">Landing Page Videos</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="web-10">
                        <Link to="/web/landingpagecontent">
                            <Icon type="read"/>
                            <span className="nav-text">Landing Page Content</span>
                        </Link>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        </Sider>
    }
}

export default AppSider;
