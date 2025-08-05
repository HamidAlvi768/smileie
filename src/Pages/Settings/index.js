import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, CardBody } from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";

const settingsData = [
  {
    section: "General Settings",
    cards: [
      // {
      //   name: "Application Settings",
      //   description: "Configure general application settings.",
      //   icon: "ri-settings-3-line",
      //   url: "/settings/application-settings",
      // },
      {
        name: "Dropdown Settings",
        // count: "3",
        description: "Define dropdown-specific settings.",
        icon: "ri-list-settings-line",
        url: "/settings/dropdown-settings",
      }, {
        name: "Manage Video Tutorials",
        description: "Create, edit, and organize video tutorials.",
        icon: "ri-video-line",
        url: "/settings/video-tutorials",
      },
      {
        name: "FAQs",
        description: "Manage frequently asked questions for users.",
        icon: "ri-question-answer-line",
        url: "/settings/faqs",
      },
      {
        name: "Contact Us",
        description: "View and manage messages from customers.",
        icon: "ri-mail-send-line",
        url: "/settings/contact-us",
      },
      {
        name: "Treatment Instructions",
        description: "Update instructions shown to users.",
        icon: "ri-file-text-line",
        url: "/settings/instructions",
      },
      {
        name: "Aligner Maintenance & Tips",
        description: "Update aligner maintenance and tips for users.",
        icon: "ri-lightbulb-flash-line",
        url: "/settings/aligner-tips",
      },
      {
        name: "Impressions Guide",
        description: "Update impressions guide for users.",
        icon: "ri-book-open-line",
        url: "/settings/impressions-guide",
      },
    ],
  },
  {
    section: "Reminders & Plans",
    cards: [
      {
        name: "Scan Reminder",
        description: "Set the frequency for patient scan notifications.",
        icon: "ri-notification-line",
        url: "/settings/scan-notification-frequency",
      },
      // {
      //   name: "Next Step Reminder",
      //   description: "Configure reminders for upcoming patient actions.",
      //   icon: "ri-arrow-right-circle-line",
      //   url: "/settings/next-step-reminder",
      // },
      // {
      //   name: "Manage Treatment Plans",
      //   description: "Create, edit, and organize treatment plans.",
      //   icon: "ri-file-list-3-line",
      //   url: "/settings/treatment-plans",
      // },
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
          />

          {settingsData.map((sectionData, sectionIdx) => (
            <div key={sectionIdx} className="mb-4">
              {sectionData.section !== 'General Settings' && (
                <h4 className="mb-3">{sectionData.section}</h4>
              )}
              <Row>
                {sectionData.cards.map((card, cardIdx) => (
                  <Col xl={4} sm={6} key={cardIdx}>
                    <Link to={card.url} className="text-decoration-none">
                      <Card className="card-hover-shadow position-relative" style={{ minHeight: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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

export { default as Instructions } from './Instructions';
export { default as AlignerTips } from './AlignerTips';
export { default as ImpressionsGuide } from './ImpressionsGuide';
export default Settings; 