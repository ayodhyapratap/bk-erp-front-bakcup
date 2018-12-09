import React from "react";
import PatientHeader from "./PatientHeader";
import {Layout} from "antd";
const { Header, Content, Sider } = Layout;
class PatientHome extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Layout>
            <PatientHeader/>
            <Layout>
                <Content className="main-container"
                         style={{
                             margin: '24px 16px',
                             padding: 24,
                             minHeight: 280,
                             // marginLeft: '200px'
                         }}>
                </Content>
            </Layout>
        </Layout>
    }
}

export default PatientHome;
