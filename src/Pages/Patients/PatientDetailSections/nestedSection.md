**1. Section List with Checkboxes**

- Beneath the header, the page is divided into multiple vertically stacked **sections**.
- Each section has:
    - A **checkbox** on the left to toggle that section’s overall on/off state.
    - A section title (e.g., “Notification settings,” “Goals,” “Oral health assessment,” etc.).
    - An optional description or summary below the title (collapsed by default until expanded).
- Clicking the section title expands or collapses that entire section’s contents.

**2. Nested Collapsible Sub-Sections**

- Within any expanded section, there can be one or more **sub-sections** that follow the same pattern:
    1. A sub-section header row, which itself can be toggled on/off via a smaller checkbox.
    2. A title describing that sub-section’s purpose (e.g., “Timeframe,” “Orthodontic parameters – Aligners,” etc.).
    3. An arrow or caret icon indicating that this sub-section can be expanded or collapsed.
- Expanding a sub-section reveals its own content area, which can include controls, forms, and even further nested sub-sections (i.e., multiple levels of collapsible panels).

**3. Deeply Nested Item Lists**

- At the deepest level (for example, a list of scheduled follow-up days), each item is presented as:
    - A small checkbox to toggle that specific item on or off.
    - A label or title (e.g., “2 day(s) (MM/DD/YYYY)”) summarizing what the item represents.
    - A brief subtext or description (“Event calculated from the monitoring start date”).
    - A caret icon on the right that, when clicked, expands this individual item.
- Expanding an item reveals form controls or parameter inputs. In the screenshot’s case, this included:
    - A “Priority” selector (with radio buttons labeled “Silent,” “Info,” “Warning,” “Alert”).
    - A numeric input for “Trigger” (e.g., “2 day(s) after monitoring start date”).
    - One or more input fields or dropdowns under headings like “Team Instructions” or “Messages to patient.”
    - A “Delete” link next to any entry to remove that specific item.

**4. “Add New” Controls at Each Level**

- At each level of nesting, after the list of existing items, there is usually an “Add a new [item/sub-section]” control (often a text link like “# day(s) Add a new date” or a button labeled “Add instruction for team”).
- These “Add” controls allow users to dynamically append new entries to that list.

**5. Visual Indications of Hierarchy**

- Each nesting level is indented slightly to the right relative to its parent.
- Borders or subtle background shading separate one section from the next, making it clear where one collapsible panel ends and another begins.
- The checkboxes line up vertically at each level, reinforcing the tree-like structure.