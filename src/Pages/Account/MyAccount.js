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
    email: "abid@example.com",
    firstName: "Abid",
    lastName: "Hussain",
    mobile: "",
    countryCode: "+1",
    twoFA: false,
    language: "English",
    redacted: false,
    newPassword: "",
    confirmPassword: "",
    currentPassword: "",
    dentalNotation: "FDI",
  });

  // Dummy values
  const practice = "Smileie UK";
  const accountId = "A78B-58F2-W";
  const softwareVersion = "v2.3.1";
  const udiCode = "UDI-1234567890";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
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
              <Row className="mb-3">
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
              </Row>

              <div>
                {/* Name and Email Row */}
                <Row>
                  <Col md={4}>
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
                  <Col md={4}>
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
                  <Col md={4}>
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

                {/* Mobile Phone and Settings Row */}
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="mobile">Mobile Phone</Label>
                      <InputGroup>
                        <Input
                          type="select"
                          name="countryCode"
                          value={form.countryCode}
                          onChange={handleChange}
                          style={{ maxWidth: '140px' }}
                        >
                          {countryCodes.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code} ({c.label})
                            </option>
                          ))}
                        </Input>
                        <Input
                          id="mobile"
                          name="mobile"
                          value={form.mobile}
                          onChange={handleChange}
                          placeholder="1234567890"
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
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
                  </Col>
                </Row>

                {/* Checkboxes Row */}
                <Row className="mb-3">
                  <Col md={6}>
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
                  </Col>
                  <Col md={6}>
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
                  </Col>
                </Row>

                {/* Password Fields Row */}
                <Row>
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
                </Row>

                {/* Dental Notation Row */}
                <Row>
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
                </Row>

                {/* Update Button */}
                <Row>
                  <Col>
                    <Button color="primary" size="lg">
                      Update
                    </Button>
                  </Col>
                </Row>
              </div>
            </CardBody>
          </Card>

          {/* Regulatory Information Card */}
          <Card>
            <CardHeader>
              <h4 className="mb-0">Regulatory Information</h4>
            </CardHeader>
            <CardBody>
              <Row className="mb-3">
                <Col md={6}>
                  <div className="text-muted">
                    Software version: <strong>{softwareVersion}</strong>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="text-muted">
                    UDI code: <strong>{udiCode}</strong>
                  </div>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col>
                  <div className="text-muted small">
                    This software is a medical device. The UDI code applies to the
                    software only.
                  </div>
                </Col>
              </Row>
              
              <Row>
                <Col md={6} className="mb-2">
                  <Button color="link" className="p-0 text-decoration-none">
                    View regulatory label
                  </Button>
                </Col>
                <Col md={6}>
                  <Button color="link" className="p-0 text-decoration-none">
                    Legal representative information
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default MyAccount;