import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row, Table} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {PRACTICESTAFF} from "../../../../constants/api"
import {Link} from "react-router-dom";
import {getAPI} from "../../../../utils/common"

class PracticeDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
      var that = this;
        let successFn = function (data) {
          console.log("get table");
        };
        let errorFn = function () {
        };
        getAPI(PRACTICESTAFF, successFn, errorFn);
      }



    render() {
        return <Row>
            <h2>Title
                <Link to="/settings/clinics-staff/adddoctor">
                    <Button type="primary" style={{float: 'right'}}>
                        <Icon type="plus"/>&nbsp;Add
                    </Button>
                </Link>
            </h2>
            <Card>
                <Table>

                </Table>
            </Card>
        </Row>
    }
}

export default PracticeDetails;
