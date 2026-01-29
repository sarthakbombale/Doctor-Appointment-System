import { useEffect, useState } from "react";
import { Table, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { getAllDoctorDetails } from "../../api/doctorAPI";

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    try {
      const res = await getAllDoctorDetails();
      if (res.data.success) {
        setDoctors(res.data.doctors || []);
      } else {
        setDoctors([]);
      }
    } catch (error) {
      toast.error("Failed to load doctor details");
      setDoctors([]);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <>
      <h3 className="mb-4">All Doctors</h3>

      <Card className="shadow-sm">
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Gender</th>
                <th>Specialist</th>
                <th>Fees</th>
              </tr>
            </thead>

            <tbody>
              {doctors.length > 0 ? (
                doctors.map((doc, index) => (
                  <tr key={doc.doctorId || index}>
                    <td>{index + 1}</td>
                    <td>{doc.name}</td>
                    <td>{doc.email}</td>
                    <td>{doc.contactNumber || "N/A"}</td>
                    <td>{doc.gender || "N/A"}</td>
                    <td>{doc.specialist || "N/A"}</td>
                    <td>₹{doc.fees || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No doctors found
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

export default AllDoctors;
