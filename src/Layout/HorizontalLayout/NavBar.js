import React from "react";
import { Collapse, Container } from "reactstrap";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import { withTranslation } from "react-i18next";

const Navbar = (props) => {
  const location = useLocation();
  console.log('navbarMenuItems',props.navbarMenuItems)
  return (
    <React.Fragment>
      {props.navbarMenuItems && props.navbarMenuItems.length > 0 ? (
        <div className="topnav">
          <Container fluid>
            <nav
              className="navbar navbar-light navbar-expand-lg topnav-menu"
              id="navigation"
            >
              <Collapse
                isOpen={props.leftMenu}
                className="navbar-collapse"
                id="topnav-menu-content"
              >
                <ul className="navbar-nav">
                  {props.navbarMenuItems.map((item, key) => (
                    <li key={key} className="nav-item">
                      <Link
                        to={item.url}
                        className={`nav-link${location.pathname === item.url ? ' active' : ''}`}
                      >
                        {props.t(item.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </nav>
          </Container>
        </div>
      ) : (
        <h1>No menu items</h1>
      )}
    </React.Fragment>
  );
};

const mapStatetoProps = (state) => {
  const { leftMenu } = state.Layout;
  const { navbarMenuItems } = state.Navigation;
  console.log('navbarMenuItems <|=|>',navbarMenuItems)
  return { leftMenu, navbarMenuItems };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
);
