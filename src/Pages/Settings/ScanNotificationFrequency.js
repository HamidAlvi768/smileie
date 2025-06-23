import React from "react";
import ReminderTable from "../../components/Common/ReminderTable";

const initialData = [
  {
    id: 1,
    name: "Weekly Scan Reminder",
    triggerDays: 7,
    status: "Active",
    customMessage: "Don't forget to submit your weekly scan! Your progress depends on it."
  },
  {
    id: 2,
    name: "Monthly Progress Check",
    triggerDays: 30,
    status: "Active",
    customMessage: "Time for your monthly progress review. Keep up the great work!"
  },
  {
    id: 3,
    name: "Daily Follow-up",
    triggerDays: 2,
    status: "Inactive",
    customMessage: "Stay cautious! It's only two days left."
  }
];

const ScanNotificationFrequency = () => (
  <ReminderTable
    title="Scan Reminders"
    breadcrumbTitle="Smileie"
    breadcrumbItem="Settings"
    breadcrumbItem2="Scan Reminder"
    initialData={initialData}
    addButtonLabel="Add New Notification"
    modalTitleAdd="Add New Notification"
    modalTitleEdit="Edit Notification"
  />
);

export default ScanNotificationFrequency; 