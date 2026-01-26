import { useEffect, useState } from "react";
import { Card, Spinner, Button, Form, Image, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { getUserInfo, updateUser } from "../../api/userAPI";
import "../../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactNumber: "",
    gender: "",
  });

  const [imageFile, setImageFile] = useState(null);

  /* ======================
     FETCH PROFILE
  =======================*/
  const fetchProfile = async () => {
    try {
      const res = await getUserInfo();
      if (res.data.success) {
        setUser(res.data.user);
        setFormData({
          name: res.data.user.name || "",
          address: res.data.user.address || "",
          contactNumber: res.data.user.contactNumber || "",
          gender: res.data.user.gender || "",
        });
      }
    } catch {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="profile-loader">
        <Spinner animation="border" />
        <p>Loading profile...</p>
      </div>
    );
  }

  /* ======================
     HANDLERS
  =======================*/
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("address", formData.address);
      payload.append("contactNumber", formData.contactNumber);
      payload.append("gender", formData.gender);

      if (imageFile) {
        payload.append("userImage", imageFile);
      }

      const res = await updateUser(payload);

      if (res.data.success) {
        toast.success("Profile updated successfully");
        setEditMode(false);
        fetchProfile();
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     VIEW MODE
  =======================*/
  if (!editMode) {
    return (
      <div className="profile-container">
        <Card className="profile-card shadow-sm">
          <div className="profile-header text-center">
            <div className="profile-avatar mb-2">
              {user.imagePath ? (
                <Image src={user.imagePath} roundedCircle width={120} height={120} />
              ) : (
                <div className="avatar-placeholder">
                  {user.name?.charAt(0)}
                </div>
              )}
            </div>

            <h4>{user.name}</h4>
            <span className="text-muted">{user.role}</span>
          </div>

          <Card.Body>
            <Row className="mb-2">
              <Col sm={4}><strong>Email</strong></Col>
              <Col sm={8}>{user.email}</Col>
            </Row>

            <Row className="mb-2">
              <Col sm={4}><strong>Contact</strong></Col>
              <Col sm={8}>{user.contactNumber || "N/A"}</Col>
            </Row>

            <Row className="mb-2">
              <Col sm={4}><strong>Address</strong></Col>
              <Col sm={8}>{user.address || "N/A"}</Col>
            </Row>

            <Row className="mb-2">
              <Col sm={4}><strong>Gender</strong></Col>
              <Col sm={8}>{user.gender || "N/A"}</Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}><strong>Role</strong></Col>
              <Col sm={8}>{user.role}</Col>
            </Row>

            <div className="text-end">
              <Button onClick={() => setEditMode(true)}>
                Edit Profile
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  /* ======================
     EDIT MODE
  =======================*/
  return (
    <div className="profile-container">
      <Card className="profile-card shadow-sm">
        <Card.Body>
          <h4 className="mb-3">Edit Profile</h4>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Save"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;
