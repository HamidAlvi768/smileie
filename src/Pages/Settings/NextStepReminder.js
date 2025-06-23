import React from "react";
import ReminderTable from "../../components/Common/ReminderTable";

const initialData = [
  {
    id: 1,
    name: "Appointment Confirmation",
    triggerDays: 1,
    status: "Active",
    customMessage: "Confirm your upcoming appointment."
  },
  {
    id: 2,
    name: "Payment Due Reminder",
    triggerDays: 7,
    status: "Active",
    customMessage: "Your payment is due soon."
  }
];

const NextStepReminder = () => (
  <ReminderTable
    title="Next Step Reminders"
    breadcrumbTitle="Smileie"
    breadcrumbItem="Settings"
    breadcrumbItem2="Next Step Reminder"
    initialData={initialData}
    addButtonLabel="Add New Next Step Reminder"
    modalTitleAdd="Add New Next Step Reminder"
    modalTitleEdit="Edit Reminder"
  />
);

export default NextStepReminder; 