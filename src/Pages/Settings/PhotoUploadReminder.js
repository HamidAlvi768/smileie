import React from "react";
import ReminderTable from "../../components/Common/ReminderTable";

const initialData = [
  {
    id: 1,
    name: "Monthly Photo Check",
    triggerDays: 30,
    status: "Active",
    customMessage: "Please upload your monthly progress photos."
  },
  {
    id: 2,
    name: "Mid-treatment Photo",
    triggerDays: 14,
    status: "Active",
    customMessage: "Time for your mid-treatment photo upload."
  }
];

const PhotoUploadReminder = () => (
  <ReminderTable
    title="Photo Upload Reminders"
    breadcrumbTitle="Smileie"
    breadcrumbItem="Settings"
    breadcrumbItem2="Photo Upload Reminder"
    initialData={initialData}
    addButtonLabel="Add New Photo Upload Reminder"
    modalTitleAdd="Add New Photo Upload Reminder"
    modalTitleEdit="Edit Reminder"
  />
);

export default PhotoUploadReminder; 