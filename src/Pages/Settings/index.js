import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, CardBody } from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";

const settingsData = [
  {
    section: "General Settings",
    cards: [
      {
        name: "Application Settings",
        description: "Configure general application preferences and system settings.",
        icon: "ri-settings-3-line",
        url: "/settings/application-settings",
      },
    ],
  },
  {
    section: "Static Settings",
    cards: [
        {
          name: "Scan Reminder",
          description: "Set the frequency for patient scan notifications.",
          icon: "ri-notification-line",
          url: "/settings/scan-notification-frequency",
        },
        {
          name: "Photo Upload Reminder",
          description: "Manage reminders for patient photo uploads.",
          icon: "ri-image-line",
          url: "/settings/photo-upload-reminder",
        },
        {
          name: "Next Step Reminder",
          description: "Configure reminders for upcoming patient actions.",
          icon: "ri-arrow-right-circle-line",
          url: "/settings/next-step-reminder",
        },
    ],
  },
  {
    section: "Entities Settings",
    cards: [
        {
          name: "Countries",
          count: "3",
          description: "Define country-specific settings.",
          icon: "ri-earth-line",
          url: "/settings/countries",
        }
      ],
  },
];

const Settings = () => {
  document.title = "Settings | Smileie";

  return (
    <React.Fragment>
      <div className="page-content no-navbar">
        <Container fluid={true}>
          <Breadcrumbs 
            title="Smileie" 
            breadcrumbItem="Settings"
            extraContentRight={(
              <div className="d-flex align-items-center">
                <Link to="/settings/entities-list" className="btn btn-link btn-label waves-effect waves-light me-2">
                  <i className="ri-list-check label-icon"></i> Entities
                </Link>
                <Link to="/settings/reminders" className="btn btn-link btn-label waves-effect waves-light">
                  <i className="ri-notification-line me-1"></i> Reminders
                </Link>
              </div>
            )}
          />

          {settingsData.map((sectionData, sectionIdx) => (
            <div key={sectionIdx} className="mb-4">
              <h4 className="mb-3">{sectionData.section}</h4>
              <Row>
                {sectionData.cards.map((card, cardIdx) => (
                  <Col xl={4} sm={6} key={cardIdx}>
                    <Link to={card.url} className="text-decoration-none">
                      <Card className="card-hover-shadow position-relative">
                        {card.count && (
                          <div className="position-absolute top-0 end-0 p-3">
                            <span className="badge bg-primary fs-6">{card.count}</span>
                          </div>
                        )}
                        <CardBody>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm flex-shrink-0 me-3">
                              <span className="avatar-title bg-light text-primary rounded-circle font-size-24">
                                <i className={card.icon}></i>
                              </span>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <h5 className="font-size-15 text-truncate">
                                {card.name}
                              </h5>
                              <p className="text-muted mb-0">
                                {card.description}
                              </p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Settings; 