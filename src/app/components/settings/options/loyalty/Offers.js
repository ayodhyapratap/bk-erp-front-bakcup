import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row, Table} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {Link} from "react-router-dom";

class Offers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return <Row>
            <h2>All Offers
                <Link to="/settings/loyalty/add">
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

export default Offers;
