import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Col, Row } from "reactstrap";

const Breadcrumbs = (props) => {
  return (
    <React.Fragment>
      <Row>
        <Col xs="12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-0 font-size-18">
              {props.breadcrumbItem2 || props.breadcrumbItem}
            </h4>
            <div className="d-flex align-items-center">
              {props.extraContentRight}
              <div className="page-title-right ms-3">
              <Breadcrumb listClassName="m-0">
                <BreadcrumbItem>
                  <Link to="/dashboard">{props.title}</Link>
                </BreadcrumbItem>
                  <BreadcrumbItem>
                    {props.breadcrumbItem2 || props.breadcrumbItem3 ? (
                      <Link to="/settings">{props.breadcrumbItem}</Link>
                    ) : (
                      <span>{props.breadcrumbItem}</span>
                    )}
                  </BreadcrumbItem>
                  {props.breadcrumbItem2 && (
                    <BreadcrumbItem>
                      {props.breadcrumbItem3 ? (
                        props.breadcrumbItem2Link ? (
                          <Link to={props.breadcrumbItem2Link}>{props.breadcrumbItem2}</Link>
                        ) : (
                          <span>{props.breadcrumbItem2}</span>
                        )
                      ) : (
                        <span>{props.breadcrumbItem2}</span>
                      )}
                    </BreadcrumbItem>
                  )}
                  {props.breadcrumbItem3 && (
                <BreadcrumbItem active>
                      {props.breadcrumbItem3}
                </BreadcrumbItem>
                  )}
              </Breadcrumb>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default Breadcrumbs;
