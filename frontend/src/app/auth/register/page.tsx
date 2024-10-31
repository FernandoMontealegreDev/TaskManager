/**
 * RegisterPage Component
 *
 * This is the registration page component responsible for rendering the RegisterForm component.
 * It serves as the dedicated page for new user registrations, handling user inputs
 * and submission through the RegisterForm component.
 *
 * @returns {JSX.Element} The registration page content containing the RegisterForm component.
 */

import RegisterForm from "../../components/RegisterForm";

const RegisterPage: React.FC = () => {
  return <RegisterForm />;
};

export default RegisterPage;
