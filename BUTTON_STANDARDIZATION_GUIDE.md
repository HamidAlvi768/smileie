# Button Standardization Guide

## Overview
This document outlines the standardized approach for buttons across the Smileie application to ensure consistency in appearance, behavior, and user experience.

## Color Scheme Standards

### Primary Actions
- **Primary (Blue)**: Main actions, form submissions, primary CTAs
- **Success (Green)**: Add new items, confirm actions, positive actions
- **Info (Cyan)**: Information actions, help, guidance

### Secondary Actions
- **Secondary (Gray)**: Cancel, back, secondary actions
- **Light (Light Gray)**: Cancel, close, dismiss actions
- **Outline variants**: Less prominent actions with border styling

### Destructive Actions
- **Danger (Red)**: Delete, remove, destructive actions
- **Warning (Yellow)**: Caution, confirmation required

## Button Layout Classes

### 1. Header Button Layout
```scss
.header-with-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  .header-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: nowrap;
  }
}
```

**Usage:**
```jsx
<div className="header-with-buttons">
  <h4 className="mb-0">Section Title</h4>
  <div className="header-buttons">
    <Button color="success" className="btn-icon btn-icon-left">
      <i className="ri-add-line"></i>
      Add New
    </Button>
    <Button color="primary">Save</Button>
  </div>
</div>
```

### 2. Form Button Layout
```scss
.form-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1rem;
}
```

**Usage:**
```jsx
<div className="form-buttons">
  <Button color="secondary">Cancel</Button>
  <Button color="primary" type="submit">Submit</Button>
</div>
```

### 3. Action Button Layout
```scss
.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
```

**Usage:**
```jsx
<div className="action-buttons">
  <Button color="outline-primary" size="sm" className="btn-icon">
    <i className="ri-edit-line"></i>
  </Button>
  <Button color="outline-danger" size="sm" className="btn-icon">
    <i className="ri-delete-bin-line"></i>
  </Button>
</div>
```

### 4. Modal Button Layout
```scss
.modal-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
}
```

**Usage:**
```jsx
<ModalFooter>
  <div className="modal-buttons">
    <Button color="light">Cancel</Button>
    <Button color="danger">Delete</Button>
  </div>
</ModalFooter>
```

## Icon Button Standards

### Icon Alignment
```scss
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  i {
    line-height: 1;
    display: inline-flex;
    align-items: center;
  }
}
```

### Icon Positioning
- **Left Icon**: `btn-icon btn-icon-left` - Icon before text
- **Right Icon**: `btn-icon btn-icon-right` - Icon after text
- **Icon Only**: `btn-icon` - No text, just icon

## Button Sizes

### Standard Sizes
- **xs**: `btn-xs` - Extra small (0.125rem padding)
- **sm**: `btn-sm` - Small (0.25rem padding)
- **Default**: No size class (0.375rem padding)
- **lg**: `btn-lg` - Large (0.5rem padding)
- **xl**: `btn-xl` - Extra large (0.75rem padding)

## Implementation Examples

### 1. List/Table Header
```jsx
<div className="header-with-buttons">
  <h4 className="mb-0">Users List</h4>
  <div className="header-buttons">
    <Button color="success" className="btn-icon btn-icon-left">
      <i className="ri-add-line"></i>
      Add User
    </Button>
    <Button color="primary" className="btn-icon btn-icon-left">
      <i className="ri-download-line"></i>
      Export
    </Button>
  </div>
</div>
```

### 2. Form Actions
```jsx
<div className="form-buttons">
  <Button color="light" onClick={onCancel}>Cancel</Button>
  <Button color="primary" type="submit" disabled={isSubmitting}>
    {isSubmitting ? <Spinner size="sm" className="me-2" /> : null}
    Save Changes
  </Button>
</div>
```

### 3. Table Row Actions
```jsx
<div className="action-buttons">
  <Button color="outline-primary" size="sm" className="btn-icon" title="Edit">
    <i className="ri-edit-line"></i>
  </Button>
  <Button color="outline-info" size="sm" className="btn-icon" title="View">
    <i className="ri-eye-line"></i>
  </Button>
  <Button color="outline-danger" size="sm" className="btn-icon" title="Delete">
    <i className="ri-delete-bin-line"></i>
  </Button>
</div>
```

### 4. Modal Actions
```jsx
<ModalFooter>
  <div className="modal-buttons">
    <Button color="light" onClick={onClose}>Close</Button>
    <Button color="primary" onClick={onConfirm}>Confirm</Button>
  </div>
</ModalFooter>
```

## Responsive Behavior

### Mobile Adaptations
- Buttons wrap on small screens (below 768px)
- Gap reduces from 0.5rem to 0.25rem
- Action buttons use smaller padding
- Form buttons become full-width on mobile

## Best Practices

### 1. Button Order
- **Primary action**: Rightmost position
- **Secondary action**: Left of primary
- **Danger action**: Rightmost (if primary) or separate row

### 2. Icon Usage
- Use consistent icon library (Remix Icons)
- Provide tooltips for icon-only buttons
- Ensure proper spacing between icon and text

### 3. Accessibility
- Use semantic button colors
- Provide clear button labels
- Include proper ARIA attributes for screen readers

### 4. Loading States
- Show spinners for async actions
- Disable buttons during processing
- Provide visual feedback for user actions

## Migration Checklist

- [ ] Replace custom flexbox layouts with standardized classes
- [ ] Update button color schemes to match standards
- [ ] Implement consistent icon alignment
- [ ] Add responsive behavior for mobile devices
- [ ] Test button accessibility across components
- [ ] Update documentation and component examples

## Common Patterns to Replace

### Before (Inconsistent)
```jsx
<div className="d-flex justify-content-between align-items-center mb-3">
  <h4>Title</h4>
  <div>
    <Button className="me-2">Action 1</Button>
    <Button>Action 2</Button>
  </div>
</div>
```

### After (Standardized)
```jsx
<div className="header-with-buttons">
  <h4 className="mb-0">Title</h4>
  <div className="header-buttons">
    <Button color="success" className="btn-icon btn-icon-left">
      <i className="ri-add-line"></i>
      Action 1
    </Button>
    <Button color="primary">Action 2</Button>
  </div>
</div>
```

This standardization ensures consistent button behavior, alignment, and appearance across the entire application.
