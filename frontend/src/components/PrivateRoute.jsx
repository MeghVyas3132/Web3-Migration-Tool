import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

function PrivateRoute({ children }) {
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
