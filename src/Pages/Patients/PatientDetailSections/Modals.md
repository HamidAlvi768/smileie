1. **New Clinical Instruction to Smileie Modal**
    - **Purpose**: Allows the user to send a clinical instruction to Smileie for a patient .
    - **Elements**:
        - Title: "New clinical instruction to Smileie".
        - Text field labeled "Write your clinical instruction to Smileie:" for input.
        - Buttons: "Cancel"  and "Send a clinical instruction to DM" .
2. **Add Patient to the To-Do List Modal**
    - **Purpose**: Confirms adding a patient  to the to-do list with an optional comment.
    - **Elements**:
        - Title: "Add patient to the To-Do List".
        - Prompt: "Do you want to add the patient [Patient Name] to the To-Do list?".
        - Text field labeled "You can add an optional comment:" (marked as optional).
        - Buttons: "Cancel"  and "Add to the To-do List" .
3. **Add an Intraoral Scan Modal**
    - **Purpose**: Facilitates uploading an intraoral scan for a patient .
    - **Elements**:
        - Title: "Add an Intraoral Scan - [Patient Name]".
        - Two tabs: "Upload from my computer" (active) and "Import from a scanner".
        - Two drag-and-drop areas for upper arch (maxillary) and lower arch (mandibular) scans with "Import or drag & drop your file" prompts.
        - Fields: "Scan date" (calendar picker), "Scanner brand" (dropdown).
        - Optional "Your comments" text field.
        - Buttons: "Cancel"  and "Upload" .
4. **Login Link for Patient Modal**
    - **Purpose**: Provides a login link for the patient  to be copied and sent manually.
    - **Elements**:
        - Title: "Login link for [Patient Name] (to be copied and sent manually to patient!)".
        - Instruction: "Please copy the following text and send it to the patient (click here to copy to clipboard):".
        - Text field with the link: "Click on this link from your smartphone to log in: https://eu2.dental-monitoring.com/sn/tVRySuzmJFicmdxo84qyc".
        - Note: "This link is only valid for the next 5 days and can only be used once."
        - Button: "Close" .
5. **Send App Activation Code Modal**
    - **Purpose**: Confirms sending an app activation email to the patient .
    - **Elements**:
        - Title: "Send app activation code".
        - Prompt: "Do you want to send the activation email to [Patient Name]?".
        - Buttons: "Cancel"  and "Send app activation code" .
6. **Write a Message to Patient Modal**
    - **Purpose**: Allows writing and scheduling a message to the patient .
    - **Elements**:
        - Title: "Write a message to send to your patient [Patient Name]".
        - Text field labeled "Write your message:" with a "Select a quick reply" dropdown.
        - Option to "Add attachment".
        - Checkbox: "Send this message later (choose a future time and date)".
        - Fields: "Date" (set to [Today’s Date], calendar picker) and "Time" (set to [Time], dropdown).
        - Buttons: "Cancel"  and "OK" .
7. **Send an Instruction to the Team Modal**
    - **Purpose**: Sends an instruction to the team regarding the patient  with a priority level.
    - **Elements**:
        - Title: "Send an instruction to the team regarding [Patient Name] [Patient ID]".
        - Text field labeled "Write your instruction:".
        - Dropdown labeled "Select the priority level:" (default: "Info").
        - Checkbox: "Send this message later (choose a future time and date)".
        - Fields: "Date" (set to [Today’s Date], calendar picker) and "Time" (set to [Time], dropdown).
        - Buttons: "Cancel"  and "OK" .
8. **Reset the Due Date for Next Scan Modal**
    - **Purpose**: Resets the due date for the patient’s  next scan to today with optional instructions.
    - **Elements**:
        - Title: "Reset the due date for [Patient Name]’s next scan".
        - Info: "You are going to reset the due date of the patient’s next scan to today... (future scans will be calculated from today’s date + chosen scan interval)".
        - Text field labeled "You can enter instructions that will be displayed in your patient’s scan checklist:" (marked as optional).
        - Buttons: "Cancel"  and "Reset scan schedule" .
9. **Ask for an Additional Scan Modal**
    - **Purpose**: Requests an additional scan from the patient  with an optional message.
    - **Elements**:
        - Title: "Ask for an additional scan".
        - Warning: "Your patient already has a scan to take. Are you sure you want to ask for an additional scan? The patient will still have to take their regular scan afterwards."
        - Info: "This additional scan will not change the patient’s regular scan schedule... results will be available under the tab ‘Additional scans’."
        - Text field labeled "Add optional message to patient:" (marked as optional).
        - Buttons: "Cancel"  and "Ask for an additional scan" .
10. **Pause Monitoring Modal**
    - **Purpose**: Pauses monitoring for the patient until a specified date with an optional message.
    - **Elements**:
        - Title: "Pause monitoring".
        - Field: "Pause monitoring until" (set to [Today’s Date], calendar picker).
        - Text field labeled "Send message to patient" (marked as optional).
        - Buttons: "Cancel"  and "Save" .

### 11. **Change Scan Frequency Modal**

- **Purpose**: Adjust scan frequency settings.
- **Elements**:
    - title "Change scan frequency" and "X" close button.
    - Instruction: "Select the suitable scan frequency."
    - Dropdowns: "SCAN FREQUENCY" (7 days) and "FOLLOW-UP SCAN AFTER NO-GO" (3 days).
    - Buttons: "Cancel"  and "Apply" .

---

### 12. **Change Adaptive Scan Interval Modal**

- **Purpose**: Adjust adaptive scan intervals.
- **Elements**:
    - title "Change adaptive scan interval" and "X" close button.
    - Instruction: "Select the suitable adaptive scan interval:".
    - Toggles: "GO" and "NO-GO/GO-BACK" (both off).
    - Dropdowns for configurations (e.g., "after 3 GOs... decrease by 1 day(s) - not below 3 day(s)").
    - Buttons: "Cancel"  and "Apply" .

---

### 13. **Stop Monitoring Modal**

- **Purpose**: Confirm stopping monitoring for a patient.
- **Elements**:
    - Title: "Stop monitoring" with "X" close button.
    - Warning: "Stopping this patient’s monitoring will mean you will lose all current settings...".
    - Info: "After you stop the patient’s monitoring they will appear in your ‘Not Monitored’ tab...".
    - Question: "Are you sure you want to stop this monitoring?".
    - Buttons: "Cancel" and "Yes"

---

### 14. **Change Aligner Number Modal**

- **Purpose**: Update aligner numbers.
- **Elements**:
    - title "Change aligner number" and "X" close button.
    - Fields: "CURRENT ALIGNER NUMBER" (dropdown, 1) and "TOTAL NUMBER OF ALIGNERS" (dropdown, 10).
    - Buttons: "Cancel"  and "Save" .

---

### 15. **Add a File to [Patient Name] Files Modal**

- **Purpose**: Upload a file to patient "[Patient Name]"’s files.
- **Elements**:
    - Title: "Add a file to [Patient Name] files" with "X" close button.
    - Info section : Guidelines (e.g., "DO NOT upload personal info...", "Max file size: 150MB", "Supported formats...").
    - Drag-and-drop area: "Import or drag & drop your file".
    - Buttons: "Cancel"  and "Add file" .

---

### 16. **Add a Visit to [Patient Name] Modal**

- **Purpose**: Add a visit for patient "[Patient Name]".
- **Elements**:
    - title "Add a visit to [Patient Name]" and "X" close button.
    - Field: "VISIT DATE" ([Date], calendar picker).
    - Buttons: "Back"  and "Add visit" .

---

### 17. **Share This Patient Modal**

- **Purpose**: Share patient info via email.
- **Elements**:
    - Title: "Share this patient" with "X" close button.
    - Instruction: "Please enter the e-mail address of the doctor...".
    - Field: "E-MAIL" (text input).
    - Optional text area: "YOU CAN OPTIONALLY ADD A COMMENT:".
    - Buttons: "Cancel"  and "Share this patient" .

---

### 18. **Change Monitoring Plan - [Patient Name] Modal**

- **Purpose**: Update monitoring plan for patient "[Patient Name]".
- **Elements**:
    - title "Change monitoring plan - [Patient Name]" and "X" close button.
    - Instruction: "Apply a Quickstart or set up the patient’s monitoring manually."
    - Link: "Can’t find the Quickstart you want? Create a new one here." .
    - Box: Current settings ("Photo Monitoring Full | Aligner protocol | 7 days | Other") with "Current settings" button.