import { useEffect, useState } from "react";
import { Table, Card, Badge, InputGroup, Form, Container, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { Search, Mail, Phone, UserCheck } from "lucide-react";
import { getUserList } from "../../api/userApi.js";
import "../../styles/AllUsers.css";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await getUserList();
      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold m-0">User Management</h3>
          <p className="text-muted small">View and manage all registered patients</p>
        </div>
        {!loading && (
          <Badge bg="primary" className="px-3 py-2 rounded-pill shadow-sm">
            {users.length} Total Users
          </Badge>
        )}
      </div>

      <Card className="border-0 shadow-sm users-card">
        <Card.Header className="bg-white border-0 pt-4 px-4">
          <InputGroup className="search-bar shadow-sm">
            <InputGroup.Text className="bg-light border-0">
              <Search size={18} className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by name or email..."
              className="bg-light border-0 shadow-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Card.Header>

        <Card.Body className="p-0">
          <Table hover responsive className="align-middle mb-0 user-table">
            <thead>
              <tr>
                <th className="ps-4">User Details</th>
                <th>Contact info</th>
                <th>Gender</th>
                <th>User ID</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                    <span className="text-muted">Loading directory...</span>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <div className="user-avatar-circle me-3">
                          {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{user.name || "Unknown User"}</div>
                          <div className="text-primary x-small fw-semibold">Patient</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <span className="small d-flex align-items-center gap-2">
                          <Mail size={13} className="text-muted" /> {user.email}
                        </span>
                        <span className="small d-flex align-items-center gap-2">
                          <Phone size={13} className="text-muted" /> {user.contactNumber || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <Badge bg="light" text="dark" className="border fw-normal text-capitalize">
                        {user.gender || "Not Set"}
                      </Badge>
                    </td>
                    <td>
                      {/* FIXED LINE BELOW: Converting ID to String before slicing */}
                      <code className="text-muted x-small">#{String(user.id).slice(-6)}</code>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <div className="py-3">
                      <UserCheck size={40} className="text-muted opacity-25 mb-2" />
                      <p className="text-muted m-0">No users found matching "{searchTerm}"</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AllUsers;