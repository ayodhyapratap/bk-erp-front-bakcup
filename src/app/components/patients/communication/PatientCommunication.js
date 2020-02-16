import React from "react";
import {Card, Button, Table, Icon} from "antd";
import {Link} from "react-router-dom";
import PatientCommunicationSetting from "./PatientCommunicationSetting";

class PatientCommunication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <PatientCommunicationSetting {...this.state} {...this.props} />
    }
}

export default PatientCommunication;
