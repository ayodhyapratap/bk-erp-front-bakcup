import React from "react";


export default class AmountDuePerProcedure extends React.Component {
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
            <h2>Amount Due Per Procedure</h2>
        </div>
    }
}