import React, {useEffect} from "react";
import { useLocation } from "react-router-dom";
import UsePanel from "./UserPanel";
import SocialSource from "./SocialSource";
import OverView from "./OverView";
import RevenueByLocation from "./RevenueByLocation";
import LatestTransation from "./LatestTransation";
import cities from 'cities.json';



import { Row, Container, Col } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import shouldHaveNavbar from "../../utils/navbar";

const Dashboard = () => {
  document.title = "Dashboard | Smileie";
  const location = useLocation();
  const hasNavbar = shouldHaveNavbar(location.pathname);
  
  useEffect(() => {
    console.log('cities:', cities);
  }, []);

  return (
    <React.Fragment>
      <div className={`page-content no-navbar`}>
        <Container fluid={true}>
        <Row className="mb-3 align-items-center">
            <Col md={10} xs={8}>
              <h4 className="mb-0">Dashboard</h4>
            </Col>
          </Row>
          {/* User Panel Charts */}
          <UsePanel />

          <Row>
            {/* Overview Chart */}
            <OverView />
            {/* Social Source Chart */}
            <SocialSource />
          </Row>

          <Row>
            {/* Recent Patients Table */}
              <LatestTransation />
            {/* Revenue by Location Vector Map */}
              <RevenueByLocation />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
