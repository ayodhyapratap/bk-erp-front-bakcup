import React from "react";
import img404 from '../../../assets/img/404.svg';
import {Button, Col, Row} from "antd";
import {Link} from "react-router-dom";

class Error404 extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Row style={{marginTop: '20px'}}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{textAlign: 'center', float: 'right'}}>
                <h1><b>404</b></h1>
                <h2>Page Not Found</h2>
                <h4><Link to="/"><Button type="primary">Go to Home</Button></Link></h4>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{textAlign: 'center'}}>
                <img src={img404} alt=""/>
            </Col>
        </Row>
    }
}

export default Error404;
