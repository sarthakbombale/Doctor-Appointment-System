import { useEffect, useState } from "react";
import { Table, Card, Button, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { updateDoctorStatus } from "../../api/doctorApi.js"
import axiosInstance from "../../api/axiosInstance.js";

const DoctorApplications = () => {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get("/doc/applications");

      if (res.data.success) {
        setApplications(res.data.data || []);
      } else {
        setApplications([]);
      }
    } catch (error) {
      toast.error("Failed to fetch doctor applications");
      setApplications([]);
    }
  };

  const handleStatusUpdate = async (doctorId, status) => {
    try {
      const res = await updateDoctorStatus(doctorId, status); // ✅ FIXED

      if (res.data.success) {
        toast.success(res.data.msg);
        fetchApplications();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const statusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge bg="warning">Pending</Badge>;
      case "Accepted":
        return <Badge bg="success">Accepted</Badge>;
      case "Rejected":
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return status;
    }
  };

  return (
    <>
      <h3 className="mb-4">Doctor Applications</h3>

      <Card className="shadow-sm">
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Application ID</th>
                <th>Doctor Name</th>
                <th>Email</th>
                <th>Specialist</th>
                <th>Fees</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {applications.length > 0 ? (
                applications.map((app, index) => (
                  <tr key={app.id}>
                    <td>{index + 1}</td>
                    <td>{app.id}</td>
                    <td>{app.User?.name || "N/A"}</td>
                    <td>{app.User?.email || "N/A"}</td>
                    <td>{app.Specialist}</td>
                    <td>{app.fees}</td>
                    <td>{statusBadge(app.status)}</td>
                    <td>
                      {app.status === "Pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            className="me-2"
                            onClick={() => handleStatusUpdate(app.id, "Accepted")}
                          >
                            Approve
                          </Button>

                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleStatusUpdate(app.id, "Reject")}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No doctor applications found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default DoctorApplications;
