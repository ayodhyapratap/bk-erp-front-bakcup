import React from "react";


export default class TreatmentForEachCategory extends React.Component {
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
            <h2>Treatment For Each Category</h2>
        </div>
    }
}