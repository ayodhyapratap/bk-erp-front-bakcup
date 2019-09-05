import React from "react";


export default class TreatmentForEachDoctor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            type:'DETAILED',
            loading:true,
        }
    }

    render(){
        return <div>
            <h2>Treatment For Each Doctor</h2>
        </div>
    }
}