import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  InputGroup,
  InputGroupText
} from "reactstrap";
import { API_URL } from "../../config";
import { useToast } from '../../components/Common/ToastContext';

const countryCodes = [
  { code: "+1", label: "US/Canada" },
  { code: "+44", label: "UK" },
  { code: "+92", label: "Pakistan" },
  { code: "+61", label: "Australia" },
];

const languages = ["English", "French", "German", "Spanish"];
const dentalNotations = ["FDI", "Universal", "Palmer"];

function MyAccount() {

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    dentalNotation: "FDI",
  });
  const showToast = useToast();
  const [loading, setLoading] = useState(false);

  function getProfile() {
    console.log("Fetching profile data...");
    
    // Get user ID from localStorage
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    const userId = authUser?.id;
    
    if (!userId) {
      console.error("No user ID found in localStorage");
      return;
    }
    
    fetch(API_URL + `users/view?id=${userId}`)
      .then(response => response.json())
      .then(data => {
        console.log("Profile data fetched:", data);
        const profile = data.data || {};
        setForm({
          ...form,
          email: profile.email || form.email,
          firstName: profile.first_name || form.firstName,
          lastName: profile.last_name || form.lastName,
          phone: profile.phone || form.phone,
          language: profile.language || form.language,
          redacted: profile.redacted || form.redacted,
          currentPassword: profile.currentPassword || form.currentPassword,
          newPassword: profile.newPassword || form.newPassword,
          confirmPassword: profile.confirmPassword || form.confirmPassword,
          dentalNotation: profile.dentalNotation || form.dentalNotation,
        });
      })
      .catch(error => {
        console.error("Error fetching profile:", error);
      });
  }

  useState(() => {
    document.title = "My Account - Smileie";

    getProfile();
  }, []);


  // Dummy values
  const practice = "Smileie UK";
  const accountId = "A78B-58F2-W";
  const udiCode = "UDI-1234567890";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Dummy update handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Get user ID from localStorage
      const authUser = JSON.parse(localStorage.getItem("authUser"));
      const userId = authUser?.id;
      if (!userId) throw new Error("No user ID found");
      // Prepare payload
      const payload = {
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        new_password: form.newPassword,
        confirm_password: form.confirmPassword,
      };
      const response = await fetch(API_URL + 'users/update?id=' + userId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile.');
      }
      const responseData = await response.json();
      if (responseData.status === 'error') {
        throw new Error(responseData.message || 'Failed to update profile.');
      }
      showToast({
        message: 'Profile updated successfully!',
        type: 'success',
        title: 'Success',
      });
      // Refresh profile data in the form
      getProfile();
    } catch (err) {
      showToast({
        message: err.message || 'Failed to update profile.',
        type: 'error',
        title: 'Error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8} md={10} className="mx-auto">
          <h2 className="mb-4 text-center">My Account</h2>

          {/* Personal Information Card */}
          <Card className="mb-4">
            <CardHeader>
              <h4 className="mb-0">Personal Information</h4>
            </CardHeader>
            <CardBody>
              {/* Practice and Account Info */}
              {/* <Row className="mb-3">
                <Col md={6}>
                  <div className="text-muted">
                    Practice: <strong>{practice}</strong>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="text-muted">
                    Account ID: <strong>{accountId}</strong>
                  </div>
                </Col>
              </Row> */}

              <div>
                {/* Name and Email Row */}
                <Form onSubmit={handleUpdate}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="phone">Phone</Label>
                        <InputGroup>
                          <Input
                            id="phone"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="1234567890"
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* phone Phone and Settings Row */}
                  <Row>
                    {/* <Col md={6}>
                    <FormGroup>
                      <Label for="language">Language</Label>
                      <Input
                        id="language"
                        name="language"
                        type="select"
                        value={form.language}
                        onChange={handleChange}
                      >
                        {languages.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col> */}
                  </Row>

                  {/* Checkboxes Row */}
                  <Row className="mb-3">
                    {/* <Col md={6}>
                    <FormGroup check>
                      <Input
                        type="checkbox"
                        name="twoFA"
                        checked={form.twoFA}
                        onChange={handleChange}
                        id="twoFA"
                      />
                      <Label check for="twoFA">
                        Two-factor authentication
                      </Label>
                    </FormGroup>
                  </Col> */}
                  {/* <Col md={6}>
                    <FormGroup check>
                      <Input
                        type="checkbox"
                        name="redacted"
                        checked={form.redacted}
                        onChange={handleChange}
                        id="redacted"
                      />
                      <Label check for="redacted">
                        Redacted mode
                      </Label>
                    </FormGroup>
                  </Col> */}
                  </Row>

                  {/* Password Fields Row */}
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={form.currentPassword}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={form.newPassword}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* Dental Notation Row */}
                  {/* <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="dentalNotation">Dental Notation</Label>
                      <Input
                        id="dentalNotation"
                        name="dentalNotation"
                        type="select"
                        value={form.dentalNotation}
                        onChange={handleChange}
                      >
                        {dentalNotations.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row> */}

                  {/* Update Button */}
                  <Row>
                    <Col>
                      <Button color="primary" size="lg" type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update'}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default MyAccount;