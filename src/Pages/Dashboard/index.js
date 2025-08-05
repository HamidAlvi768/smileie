import React, {useEffect} from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getStats } from "../../store/stats/actions";
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

// Enhanced components
import { withPageTransition } from "../../components/Common/PageTransition";
import ShimmerLoader from "../../components/Common/ShimmerLoader";

const Dashboard = () => {
  document.title = "Dashboard | Smileie";
  const location = useLocation();
  const hasNavbar = shouldHaveNavbar(location.pathname);
  const dispatch = useDispatch();
  const stats = useSelector((state) => state.stats.stats);
  const statsLoading = useSelector((state) => state.stats.loading);
  const statsError = useSelector((state) => state.stats.error);
  
  // Call stats API once when dashboard loads
  useEffect(() => {
    console.log('📊 Dashboard mounted - checking stats data...');
    if (!stats || Object.keys(stats).length === 0) {
      console.log('📊 Stats data empty - dispatching getStats action...');
      dispatch(getStats());
    } else {
      console.log('📊 Stats data already available - no API call needed');
    }
  }, [dispatch, stats]);
  
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
            <Col md={2} xs={4} className="text-end">
              <div className="d-flex align-items-center justify-content-end">
                <div className="me-2">
                  {/* <small className="text-muted">Latest</small> */}
                </div>
              </div>
            </Col>
          </Row>
          
          {/* Show loading state while stats are being fetched */}
          {statsLoading ? (
            <Row>
              <Col>
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading dashboard data...</p>
                </div>
              </Col>
            </Row>
          ) : statsError ? (
            <Row>
              <Col>
                <div className="alert alert-danger">
                  <i className="mdi mdi-alert-circle-outline me-2"></i>
                  Failed to load dashboard data: {statsError.toString()}
                </div>
              </Col>
            </Row>
          ) : (
            <>
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
            </>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

// Export with page transition
export default withPageTransition(Dashboard);
