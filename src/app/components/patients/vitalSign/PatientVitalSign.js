import React from "react";
import {Button, Card, Icon, Skeleton} from "antd";
import {Link} from "react-router-dom";

class PatientVitalSign extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return <Card title="Patient Vital Sign"  extra={<Button.Group>
            <Link to={"/patients/emr/vitalsigns/add"}><Button><Icon type="plus"/>Add</Button></Link>
        </Button.Group>}></Card>
    }
}
export default PatientVitalSign;
