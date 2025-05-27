# How to Create a New Page

Here is the example on how to create your custom page and add it to the leftsidebar menu, breadcrumbs and also meta tag.

## 1. Create a new folder in `src/pages`

Ex. NewPage, and then create a js file in `src/pages/NewPage` with name `index.js`

### Example:

As you know, there are 2 different types of layouts, first is Blank Layout and second is Full layout.

- If you want to make your page blank layout, then you need to wrap your page's content with `<Container fluid={false}>`
- If you want to make your page with full layout, then you need to wrap your page's content with `<div className="page-content"><div>` tag and `<Container fluid={true}>`

Add Breadcrumbs component. It's a common component, it's used to add breadcrumbs in your page.

- You have to pass 2 props here, first is title and second is breadcrumbItem.
- The **title** prop refers to page title and the **breadcrumbItem** refers to page's breadcrumb item's title.

Add MetaTags to give a html title to your page.

### Hook Base Components

```javascript
import React from 'react';
import { Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const newPage = () => {
    document.title = "New Page | Upzet - React Admin & Dashboard Template";
    return (
        <>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="New Page" breadcrumbItem="New Page" />
                    
                        //write Html code or structure

                </Container>
            </div>
        </>
    );
}

export default newPage;
```

### Components (without layout)

```javascript
import React, { Component } from 'react';
import { Container } from "reactstrap";

const newPage = () => {
    document.title = "New Page | Upzet - React Admin & Dashboard Template";
    return (
        <div>
                <Container>
                    //write Html code or structure
                </Container>
        </div>
    )
}

export default newPage;
```

## 2. Add your new page's route in `/src/Routes/routes.js` file

Check the Routes section to see how to add routes to the web application.

- If you want to create a page with blank layout, then add your page's routes in publicRoutes

### Example:

```javascript
import newPage from "../pages/newPage"

const publicRoutes = [
    { path: "/new-page", component: <newPage /> }                                          
]
```

- If you want to create a page with full layout, then add your page's routes in authProtectedRoutes

### Example:

```javascript
import newPage from "../pages/newPage"

const authProtectedRoutes = [
    { path: "/new-page", component: <newPage /> }                                          
]
```

## 3. Add a navigation in the layouts

For more details, check the Navigation page to see how to add menu item in your template.

- For Vertical Layout: `/src/Layout/VerticalLayout/SidebarData.js`
- For Horizontal Layout: `/src/Layout/HorizontalLayout/Navdata.js`

### Example:

#### Components

```javascript
/** Vertical layout */

{
    label: "New Page",
    url: "/new-page",
    icon: "mdi mdi-calendar-outline",
    isHasArrow: true,
},


/** Horizontal layout */

{
    label: "New Page",
    url: "/new-page",
},
```