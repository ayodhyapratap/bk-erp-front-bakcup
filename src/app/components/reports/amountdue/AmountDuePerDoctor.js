import React from "react";


export default class AmountDuePerDoctor extends React.Component {
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
            <h2>Amount Due Per Doctor</h2>
        </div>
    }
}