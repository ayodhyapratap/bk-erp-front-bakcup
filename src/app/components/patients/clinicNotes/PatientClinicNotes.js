import {Button, Card, Icon, Skeleton} from "antd";
import React from "react";
import {getAPI, interpolate} from "../../../utils/common";
import {PATIENT_CLINIC_NOTES} from "../../../constants/api";

class PatientClinicNotes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patient: props.currentPatient,
            notes: null
        }
        this.loadPatientData = this.loadPatientData.bind(this);
    }

    componentDidMount() {
        if (this.state.patient) {
            this.loadPatientData();
        }
    }

    loadPatientData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                notes: data
            })
        }
        let errorFn = function () {
            that.setState({
                notes: []
            })
        }
        getAPI(interpolate(PATIENT_CLINIC_NOTES, [this.state.patient.id]), successFn, errorFn)
    }

    render() {
        return <Card title="CLINICAL NOTES" extra={<Button.Group>
            <Button><Icon type="plus"/>Add</Button>
        </Button.Group>}>
            {/*<Skeleton loading={this.state.notes == null}/>*/}
        </Card>
    }
}

export default PatientClinicNotes;
