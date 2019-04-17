import React from "react";
import {Card, Button, Table, Icon} from "antd";
import {Link} from "react-router-dom";
import PatientCommunicationSetting from "./PatientCommunicationSetting";

class PatientCommunication extends React.Component{
    constructor(props){
        super(props);
        this.state={
        	loading:false,
        }
    }
    render(){
	        return <Card title="Patient Communication" extra={<Link to="/calendar/create-appointment">
            			<Button type="primary"> <Icon type="save"/>Save Communication Setting</Button>
        				</Link>}>

        				<PatientCommunicationSetting {...this.state} />
        			</Card>

	       
    }
}
export default PatientCommunication;
