import React from "react";
import {Card,Table, Row ,Button,Icon ,Checkbox} from "antd";
import {Link} from "react-router-dom";
import {BACKEND_BASE_URL} from "../../../config/connect";

class PatientLedgers extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loading:false,
            selectedList:{}
        }
    }






    ledgerCompleteToggle(id, option) {
        this.setState(function (prevState) {
            return {selectedList: {...prevState.selectedList, [id]: !!option}}
        });
    }

    loadPDF = (id) => {
        let that = this;
        let successFn = function (data) {
            if (data.report)
                window.open(BACKEND_BASE_URL + data.report);
        }
        let errorFn = function () {

        }
        // getAPI(interpolate(INVOICE_PDF_API, [id]), successFn, errorFn);
    }
    render(){
        console.log("props",this.props);
        console.log("state",this.state)
        const columns=[{
            title: '',
            key: 'is_completed',
            render: (text, record) => (record.is_completed ?
                <Icon type="check-circle" theme="twoTone" style={{marginLeft: '8px', fontSize: '20px'}}/> :
                <Checkbox key={record.id}
                        onChange={(e) => this.ledgerCompleteToggle(record.id, e.target.checked)}
                        value={this.state.selectedList[record.id]}/>)
        },{
            title:'Name',
            key:'name',
            dataIndex:"name"
        }];
        return <Row>
                <Card title="Patient Ledgers"  extra={<Button.Group>
                        <Button type="primary" >
                            <Icon type="printer"/>Print billing summary
                        </Button>
                        <Link to={"/patient/"+ this.props.match.params.id +"/billing/payments"}> <Button
                            type="primary">
                            <Icon type="plus"/>&nbsp;Add Payment</Button> 
                        </Link>

                        <Link to={"/patient/"+ this.props.match.params.id +"/billing/invoices"}> <Button
                            type="primary">
                            <Icon type="plus"/>&nbsp;Add Invoice</Button> 
                        </Link>&nbsp;

                        <Button type="primary" onClick={() => this.loadPDF()}>
                            <Icon type="printer"/>&nbsp;Print
                        </Button>&nbsp;

                        <Button type="primary" onClick={this.submitLedgers}>
                            <Icon type="save"/>Send Payment Reminder
                        </Button>

                       
                     </Button.Group>}>
                    <Table loading={this.state.loading} columns={columns}
                            dataSource={this.state.data}/>
                </Card>
            </Row>
    }
}
export default PatientLedgers;
