/**
 * LoginPage Component
 *
 * This is the login page component responsible for rendering the LoginForm component.
 * It is a simple wrapper that serves as the dedicated page for user authentication.
 *
 * @returns {JSX.Element} The login page content containing the LoginForm component.
 */

import LoginForm from "../../components/LoginForm";

const LoginPage: React.FC = () => {
  return <LoginForm />;
};

export default LoginPage;
