import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

// Simulated authentication check function
const isAuthenticated = () => localStorage.getItem('authToken') !== null;

const AuthGuard = ({ children }) => {
    if (isAuthenticated()) {
        return <Navigate to="/" replace />;
    }
    return children;
};

AuthGuard.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthGuard;
