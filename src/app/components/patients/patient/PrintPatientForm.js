import React from "react";
import '../../../assets/printpatientform.css';
import {makeFileURL} from "../../../utils/common";


export default class PrintPatientForm extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.activePracticeData) {
            setTimeout(function () {
                window.print();
            }, 1000)

        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.activePracticeData) {
            setTimeout(function () {
                window.print();
            }, 1000)

        }
    }

    render() {
        console.log(this.props.activePracticeData);
        if (this.props.activePracticeData)
            return <html className="PrintPatientForm">
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
            <body style={{margin: '0 auto', marginTop: '20px'}}>
            <div style={{margin: "0px 10%"}}>

                <table style={{borderBottom: "1px solid #000", width: '100%'}}>
                    <tr>
                        <td style={{width: '150px'}}>
                            <img style={{width:'150px'}}
                            src={makeFileURL(this.props.activePracticeData.logo)}/>
                        </td>
                        <td>
                            <h2 style={{margin: "5px"}}>{this.props.activePracticeData.name}</h2>
                            <p style={{margin: "5px", fontSize: "11px"}}>{this.props.activePracticeData.address}<br/>{this.props.activePracticeData.locality}<br/>{this.props.activePracticeData.city}, {this.props.activePracticeData.state}-
                                {this.props.activePracticeData.pincode}
                            </p>
                            <div style={{margin: "5px", fontSize: "11px"}}>
                                Email : <strong>{this.props.activePracticeData.email}</strong>
                                <br/>

                                Phone : <strong>{this.props.activePracticeData.contact}</strong>
                                <br/>

                                Website : <strong>{this.props.activePracticeData.website}</strong>
                                <br/>
                            </div>
                        </td>
                    </tr>
                </table>


                <h3 className="centeralign">
                    Patient Information </h3>
                <table>
                    <tr>
                        <td colSpan="2">
                            <h4>Personal Details</h4>
                        </td>
                    </tr>
                    <tr>
                        <td className="rightalign" style={{width: '30%'}}>Name</td>
                        <td>
                            <div className="textfield"></div>
                        </td>
                    </tr>
                    <tr>
                        <td className="rightalign">Patient ID</td>
                        <td>
                            <div className="textfield"></div>
                            <span className="leftrightmargin_10">(official use)</span></td>
                    </tr>
                    <tr id="nationalid" style={{display: "none"}}>
                        <td className="rightalign">
                            <span id="nationalidlabel"></span>
                        </td>
                        <td>
                            <div className="textfield"></div>
                        </td>
                    </tr>
                    <tr>
                        <td className="rightalign">Mobile Number</td>
                        <td>
                            <div className="textfield"></div>
                        </td>
                    </tr>

                    <tr>
                        <td colSpan="2">
                            <h4>Contact Details</h4>
                        </td>
                    </tr>
                    <tr>
                        <td className="rightalign">Email</td>
                        <td>
                            <div className="textfield"></div>
                        </td>
                    </tr>
                    <tr>
                        <td className="rightalign">Land-line Number(s)</td>
                        <td>
                            <div className="textfield"></div>
                        </td>
                    </tr>
                    <tr>
                        <td className="rightalign">Address</td>
                        <td>
                            <div className="textarea"></div>
                        </td>
                    </tr>

                    <tr>
                        <td colSpan="2">
                            <h4>General Details</h4>
                        </td>
                    </tr>
                    <tr>
                        <td className="rightalign">Gender</td>
                        <td>
                            <div className="radio"></div>
                            <label>Male </label>
                            <div className="radio"></div>
                            <label>Female </label>
                        </td>
                    </tr>
                    <tr>
                        <td className="rightalign">Blood Group</td>
                        <td>
                            <div className="textfield"></div>
                        </td>
                    </tr>
                    <tr>
                        <td className="rightalign">Date of Birth / Age</td>
                        <td>
                            <div className="textfield"></div>
                        </td>
                    </tr>


                </table>
                <p>I hereby declare that the information provided above is true and correct to the best of my knowledge.
                    I give consent to the performance of medical / surgical / anesthesia / diagnostic procedure /
                    treatment to be performed upon myself at B.K. Arogyam & Research Pvt Ltd. I will pay in full any
                    cost of treatment or insurance co-payments according to the office's financial policy. </p>
                <div className="date">Date</div>
                <div className="signature">Patient's Signature</div>
            </div>
            </body>
            </html>
        return null;
    }
}
