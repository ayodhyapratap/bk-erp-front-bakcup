import React from "react";
import PatientSelection from "../PatientSelection";

class PatientProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        if (this.props.currentPatient)
            return "Selected Patient Profile";
        return <PatientSelection {...this.props}/>
    }
}

export default PatientProfile;
