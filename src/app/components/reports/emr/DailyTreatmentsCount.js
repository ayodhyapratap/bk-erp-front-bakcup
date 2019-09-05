import React from "react";


export default class DailyTreatmentsCount extends React.Component {
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
            <h2>Daily Treatments Count</h2>
        </div>
    }
}