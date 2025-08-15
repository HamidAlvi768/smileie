import React from 'react';
import PropTypes from 'prop-types';
import withRouter from "../components/Common/withRouter";
import ContentTransition from "../components/Common/ContentTransition";

const NonAuthLayout = (props) => {
  return (
    <React.Fragment>
      <ContentTransition>
        {props.children}
      </ContentTransition>
    </React.Fragment>
  );
};

NonAuthLayout.propTypes = {
  children: PropTypes.any,
  location: PropTypes.object
};

export default withRouter(NonAuthLayout);
