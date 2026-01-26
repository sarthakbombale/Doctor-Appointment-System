import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <h1 className="display-1 fw-bold">404</h1>
      <h4 className="mb-3">Page Not Found</h4>
      <p className="text-muted mb-4">
        The page you are looking for does not exist.
      </p>

      <Button variant="primary" onClick={() => navigate("/")}>
        Go to Login
      </Button>
    </Container>
  );
};

export default NotFound;
