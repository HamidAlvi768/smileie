import React from "react";
import ReminderTable from "../../components/Common/ReminderTable";

const initialData = [
  {
    id: 1,
    name: "2 Days Before Aligner Change",
    triggerDays: 2,
    status: "Active",
    customMessage: "Your aligner change is in 2 days. Please prepare accordingly."
  },
  {
    id: 2,
    name: "1 Day Before Aligner Change",
    triggerDays: 1,
    status: "Active",
    customMessage: "Your aligner change is tomorrow. Get ready!"
  },
  {
    id: 3,
    name: "On the Day of Aligner Change",
    triggerDays: 0,
    status: "Active",
    customMessage: "Today is the day to change your aligner!"
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
    // fieldLabels={{ triggerDays: "Days Before Aligner Change" }}
  />
);

export default ScanNotificationFrequency; 