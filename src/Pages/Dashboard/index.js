import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getStats } from "../../store/stats/actions";
import { useLocation } from "react-router-dom";
import { shouldHaveNavbar } from "../../utils/navbar";
import UserPanel from "./UserPanel";
import OverView from "./OverView";
import SocialSource from "./SocialSource";
import LatestTransation from "./LatestTransation";
import RevenueByLocation from "./RevenueByLocation";
import ShimmerLoader from "../../components/Common/ShimmerLoader";

const Dashboard = () => {
  document.title = "Dashboard | Smileie";
  const location = useLocation();
  const hasNavbar = shouldHaveNavbar(location.pathname);
  const dispatch = useDispatch();
  const stats = useSelector((state) => state.stats.stats);
  const statsLoading = useSelector((state) => state.stats.loading);
  const statsError = useSelector((state) => state.stats.error);
  const [isLoading, setIsLoading] = useState(true);
  
  // Call stats API once when dashboard loads
  useEffect(() => {
    console.log('📊 Dashboard mounted - dispatching getStats action...');
    setIsLoading(true);
    dispatch(getStats());
  }, [dispatch]);

  // Update loading state when stats are loaded
  useEffect(() => {
    if (stats && Object.keys(stats).length > 0 && !statsLoading) {
      setIsLoading(false);
    }
  }, [stats, statsLoading]);

  // Show shimmer if still loading or if Redux loading is true
  const shouldShowShimmer = isLoading || statsLoading;

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
          {shouldShowShimmer ? (
            <ShimmerLoader type="dashboard" />
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
              <UserPanel />

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

export default Dashboard;
