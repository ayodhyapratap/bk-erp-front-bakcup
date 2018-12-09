import React from "react";
import {Icon, Layout} from "antd";

const {Header, Content, Sider} = Layout;

class PatientHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return <Header className="header">
            <div style={{color: 'white'}}>
                <Icon type="solution"/>
                {this.props.currentPatient ? <div>Patient Name</div> : <div>All Patient</div>}
            </div>
        </Header>
    }
}

export default PatientHeader;
