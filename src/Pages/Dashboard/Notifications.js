import React from "react";
import { Link } from "react-router-dom";

//SimpleBar
import SimpleBar from "simplebar-react";


import { Card, CardBody, CardTitle, Col } from "reactstrap";

// Updated data for dental practice notifications
const NotificationsData = [
    {
        name: "New Appointment",
        desc: "John Smith scheduled a dental cleaning for tomorrow",
        time: "2 min ago",
        icon: "ri-calendar-check-line"
    },
    {
        name: "Emergency Alert",
        desc: "Sarah Johnson reported severe tooth pain",
        time: "15 min ago",
        icon: "ri-alarm-warning-line"
    },
    {
        name: "Follow-up Required",
        desc: "Michael Brown's treatment plan needs review",
        time: "1 hour ago",
        icon: "ri-file-list-3-line"
    },
    {
        name: "New Patient",
        desc: "Emily Davis completed registration",
        time: "2 hours ago",
        icon: "ri-user-add-line"
    },
    {
        name: "Lab Results",
        desc: "X-ray results for Robert Wilson are ready",
        time: "3 hours ago",
        icon: "ri-microscope-line"
    },
    {
        name: "Inventory Alert",
        desc: "Dental supplies running low - reorder needed",
        time: "5 hours ago",
        icon: "ri-shopping-cart-line"
    }
];

const Notifications = () => {
  return (
    <React.Fragment>
      <Col lg={4}>
        <Card>
          <CardBody>
            <CardTitle>Practice Notifications</CardTitle>

            <div className="pe-3">
              <SimpleBar style={{ maxHeight: "287px" }}>
                {NotificationsData.map((item, key) => (
                  <Link key={key} to="#" className="text-body d-block">
                    <div className="d-flex py-3">
                      <div className="flex-shrink-0 me-3 align-self-center">
                        <div className="avatar-xs">
                          <span className="avatar-title bg-primary-subtle rounded-circle text-primary">
                            <i className={item.icon}></i>
                          </span>
                        </div>
                      </div>

                      <div className="flex-grow-1 overflow-hidden">
                        <h5 className="font-size-14 mb-1">{item.name}</h5>
                        <p className="text-truncate mb-0">{item.desc}</p>
                      </div>
                      <div className="flex-shrink-0 font-size-13">
                        {item.time}
                      </div>
                    </div>
                  </Link>
                ))}
              </SimpleBar>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};
export default Notifications;
