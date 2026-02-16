import { useEffect, useState } from "react";
import { Card, Spinner, Button, Form, Image, Row, Col, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { getUserInfo, updateUser } from "../../api/userAPI.js";
import { User, Mail, Phone, MapPin, Camera, Save, X, Edit2, Transgender } from "lucide-react";
import "../../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", address: "", contactNumber: "", gender: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

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

  useEffect(() => { fetchProfile(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => payload.append(key, formData[key]));
      if (imageFile) payload.append("userImage", imageFile);

      const res = await updateUser(payload);
      if (res.data.success) {
        toast.success("Profile updated!");
        setEditMode(false);
        fetchProfile();
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="profile-loader"><Spinner animation="border" variant="primary" /><p>Syncing Data...</p></div>
  );

  return (
    <div className="profile-wrapper py-5">
      <Card className="profile-main-card border-0 shadow-lg">
        {/* Banner Decoration */}
        <div className="profile-banner"></div>

        <Card.Body className="pt-0">
          <div className="profile-top-section">
            <div className="avatar-container">
              <Image 
                src={preview || user.imagePath || "https://via.placeholder.com/150"} 
                className="main-avatar shadow"
              />
              {editMode && (
                <label className="avatar-edit-badge">
                  <Camera size={16} />
                  <input type="file" hidden onChange={handleImageChange} />
                </label>
              )}
            </div>
            
            <div className="profile-intro mt-3">
              <h3 className="fw-bold m-0">{user.name}</h3>
              <Badge bg="soft-primary" className="role-badge mt-1">{user.role}</Badge>
            </div>
          </div>

          <hr className="my-4 opacity-50" />

          {editMode ? (
            /* EDIT MODE FORM */
            <Form onSubmit={handleSubmit} className="px-md-4">
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label className="small fw-bold">Full Name</Form.Label>
                  <Form.Control name="name" value={formData.name} onChange={handleChange} required />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="small fw-bold">Contact Number</Form.Label>
                  <Form.Control name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="small fw-bold">Gender</Form.Label>
                  <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Col>
                <Col md={12} className="mb-4">
                  <Form.Label className="small fw-bold">Residential Address</Form.Label>
                  <Form.Control as="textarea" rows={2} name="address" value={formData.address} onChange={handleChange} />
                </Col>
              </Row>
              <div className="d-flex gap-2 justify-content-end mb-3">
                <Button variant="light" onClick={() => setEditMode(false)} className="px-4"><X size={18} className="me-1"/> Cancel</Button>
                <Button type="submit" disabled={loading} className="btn-save px-4"><Save size={18} className="me-1"/> {loading ? "Saving..." : "Save Changes"}</Button>
              </div>
            </Form>
          ) : (
            /* VIEW MODE DETAILS */
            <div className="profile-details px-md-4">
              <Row className="g-4">
                <DetailItem icon={<Mail size={20}/>} label="Email Address" value={user.email} />
                <DetailItem icon={<Phone size={20}/>} label="Phone" value={user.contactNumber || "Not Provided"} />
                <DetailItem icon={<MapPin size={20}/>} label="Location" value={user.address || "Not Provided"} />
                <DetailItem icon={<User size={20}/>} label="Gender" value={user.gender || "Not Provided"} />
              </Row>
              <div className="text-center mt-5 mb-3">
                <Button onClick={() => setEditMode(true)} className="btn-edit-profile px-5 rounded-pill">
                  <Edit2 size={16} className="me-2" /> Edit Personal Info
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

// Reusable Detail Component
const DetailItem = ({ icon, label, value }) => (
  <Col md={6} className="d-flex align-items-center gap-3">
    <div className="detail-icon">{icon}</div>
    <div>
      <p className="text-muted small mb-0">{label}</p>
      <p className="fw-semibold mb-0">{value}</p>
    </div>
  </Col>
);

export default Profile;