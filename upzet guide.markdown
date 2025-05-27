Introduction

To use most of the Upzet build tools, Node.js LTS version is required.
Some of the plugins and framework in Upzet does not yet support the
latest Node.js version.

Upzet is a fully featured premium admin dashboard template in Bootstarp
v5.3.3 with React Hooks Saga with Firebase/Fake-backend with Facebook
and Google Authentication and developer-friendly codes. We have not used
jQuery in this template its pure ReactJs admin template with components
based only.

Google and Facebook Authentication is not saved in
Firebase/Fake-backend. Its just working with local storage.

Upzet is an admin dashboard template that is a beautifully crafted,
clean & minimal designed admin template with Dark, Light Layouts with
RTL supported. You can build any type of web application like SAAS based
interface, eCommerce, CRM, CMS, SAAS, Project management apps, Admin
Panels, etc.

It will help your team moving faster and saving development costs and
valuable time. If you're a developer and looking for an admin dashboard
that is fully responsive with Bootstrap and React, Redux, Saga without
jQuery then you are at the right place to start your project using
Upzet - React Responsive Bootstrap 5 Admin Dashboard.

Upzet contains lots of new design widgets with responsive on all
screens. Also, there are 7 different types of Layouts with different
color scheme and customization in left sidebar we have added. It is very
easy to change any layout in your existing running application by
changing couple of lines code only as its managed with scss. We have
written standard and developer-friendly code to increase performance.

How to use docs

The Upzet is fully built with Reactstrap. You can find Reactstrap
component\'s docs at their official documentation.

Let\'s install your project first, please visit installation page for
detailed guide on how to install and run Upzet.

To get started, you can checkout our well structured folder structure of
out template to understand how it works, and its functionalities.

If you want to update the UI of template quickly just like you do with
the theme customizer, checkout the Theme Configuration.

As you can see, there are 3 types of layouts,

1\. Horizontal Layout (with navbar, topbar & footer)

2\. Vertical Layout (with sidebar, topbar & footer)

3\. Non Auth Layout

We have added the Internationalization to translate your template into
any preferred language you added into it.

Dependencies

\- React v18.3.1

\- Reactstrap

\- Bootstrap v5.3.3

\- SASS

\- No JQUERY dependency

Getting Support

If you have any questions that are beyond the scope of this
documentation, please feel free to contact us via our support page, or
for pre-purchase queries you can email us at themesdesign.in@gmail.com.\
\
\
\
React Setup

Introduction

Upzet is a fully featured premium admin dashboard template in ReactJs
with Redux/Hooks with Firebase/fake-backend with Google and Facebook
authentication and developer-friendly codes.

Note: You need to fill firebase credentials in .env file and for Social
( Google / Facebook ) credentials in the src/config.js file. For more,
please visit Authentication page.

Prerequisites

Please follow below steps to install and setup all prerequisites:

Nodejs

Make sure to have the Node.js installed & running in your computer. If
you already have installed Node on your computer, you can skip this step
if your existing node version is greater than equal to 20 or greater.

Node version support policy

Supported Node.js versions vary by release, please consult the releases
page.

Node versions that hit end of life <https://github.com/nodejs/Release>,
will be dropped from support at each node-sass release (major, minor).

We will stop building binaries for unsupported releases, testing for
breakages in dependency compatibility, but we will not block
installations for those that want to support themselves.

New node release require minor internal changes along with support from
CI providers (AppVeyor, GitHub Actions). We will open a single issue for
interested parties to subscribe to, and close additional issues.

Git

Make sure to have the Git installed globally & running on your computer.
If you already have installed git on your computer, you can skip this
step.

Installation

To setup the admin theme, follow below-mentioned steps:

Install Prerequisites

Make sure to have all above prerequisites installed & running on your
computer

After you finished with the above steps, you can run the following
commands into the terminal / command prompt from the root directory of
the project to run the project locally or build for production use:

Command Description

npm install / yarn This would install all the required dependencies in
the node_modules folder.

npm start / yarn start Runs the project locally, starts the development
server and watches for any changes in your code. The development server
is accessible at [http://localhost:3000](http://localhost:3000/).

npm run build / yarn build Generates a /build directory with all the
production files.

Tip :

SCSS: We suggest you to do not change any scss files from the
src/assets/scss/theme.scss folders because to get new updates will might
be break your SCSS changes if any you have made. We strongly suggest you
to use theme.scss file and use that instead of overwrite any theme\'s
custom scss files.\
\
\
\
Folder Structure

Described below the folder structure of template and what is contains.

Understanding the src folder

the src folder contains all the assets, pages, constants, helpers redux
store etc files.

the data folder contains all the dummy data for whole template. each
file\'s data is related to every mock api from Fake-backend. E. g.
calender.js contains a dummy data which is used in Calendar module/page.

the src/Layout/HorizontalLayout/ folder contains all the components
files related to Horizontal layout, i.e. Navbar, Header, Footer.

the src/Layout/VerticalLayout/ folder contains all the components files
related to Vertical layout, i.e. Header, Footer, Sidebar, Sidebar
Content.

src/constants folder contains the all constants of the template i.e.
layout constants. you can add more constant file here. The constants
folder added to the template for better performance, let\'s say if we
will require to update value of some variable which is used in many
functionalities, then we do not need to update it\'s value everywhere,
we will just update the variable\'s value located in this folder, and
use these constant in relatable functionality.

src/helpers/ folder contains functional files related to api
integration, i.e. firebase, api code, etc. check Internationalization
page for more details.

src/locales folder contains international translation JSON files, you
can add/remove language JSON files as per your need.

src/pages contains template\'s pages, you can create/add/remove you
pages here.

src/store contains template\'s global store. check Redux page for more
details.

React

├── Admin

├── Documentation \--\> Documentation

├── Starterkit \--\> Starter kit of template

├── Admin

├── public

├── src

├── assets

├── fonts \--\> contains html fonts

├── images \--\> contains template images

└── scss \--\> contains all scss files

├── CommonData

├── Data \--\> All dummy data of the template

└── languages.js

├── components \--\> all common components of template

├── constants \--\> contains whole template\'s constants

├── helpers \--\> for authentication firebase and jwt

├── Hooks \--\> for UserHooks

├── Layout

├── HorizontalLayout \--\> Horizontal layout\'s components

├── VerticalLayout \--\> Vertical layout\'s components

└── NonAuthLayout.js \--\> Non Auth layout\'s file

├── locales \--\> all json files of i18n languages

├── Pages \--\> contains template pages

├── Routes \--\> contains template routes

├── store \--\> Global Redux Store

├── App.js

├── App.test.js

├── config.js \--\> api key & all secret keys storage read from .env

├── i18n.js \--\> main file for internationalization

├── index.js

├── serviceWorker.js

└── setupTests.js

├── .env \--\> api key & all secret keys storage

└── package.json\
\
\
\
Theme Configuration

You can change the template as per your needs. To configure it, we will
use reducer.js. you can find the file in src/store/layout folder.

Theme Options

Each of the theme configuration options is provided Below, you can
change their values as per you need in INIT_STATE variable located in
src/store/layout/reducer.js file.

Note : if you are going to update any object property of INIT_STATE,
make sure you use option\'s corresponding constant given in
src/constants/layout.js file. (Please do not change the constant\'s
value in src/constants/layout.js file)

const INIT_STATE = {

layoutType: layoutTypes.VERTICAL,

layoutModeTypes: layoutModeTypes.LIGHTMODE,

layoutWidth: layoutWidthTypes.FLUID,

leftSideBarTheme: leftSideBarThemeTypes.DARK,

leftSideBarType: leftSidebarTypes.DEFAULT,

topbarTheme: topBarThemeTypes.LIGHT,

showRightSidebar: false,

isMobile: false,

showSidebar: true,

leftMenu: false,

};

layoutType : it indicates layout types

layoutModeTypes : it indicates layout dark or light mode types

layoutWidth : it indicates layout widths

leftSideBarTheme : it indicates sidebar theme types in vertical layout

leftSideBarType : it indicates left sidebar type in layout

topbarTheme : it indicates topbar theme in layout

showRightSidebar : it handles rightbar open/close state.

Layout Types

There are 2 types of Layout : 1. Horizontal Layout 2. Vertical Layout.
please visit Layouts for more details. you would change the layoutType
variable\'s value if you want to change layout.

image

Vertical Layout

layoutType: layoutTypes.VERTICAL

image

Horizontal Layout

layoutType: layoutTypes.HORIZONTAL

Layout Mode Types

There are 2 types of Layout Modes : 1. Light 2. Dark. please visit
Layouts for more details. you would change the layoutModeTypes
variable\'s value if you want to change layout mode.

image

Light Mode

layoutModeTypes: layoutModeTypes.LIGHTMODE

image

Dark Mode

layoutModeTypes: layoutModeTypes.DARKMODE

Layout Width

There are 2 types of Layout Width : 1. Fluid Layout Width 2. Boxed
Width. you would change the layoutWidth variable\'s value if you want to
change layout width.

image

Fluid Layout

layoutWidth: layoutWidthTypes.FLUID

image

Boxed Layout

layoutWidth: layoutWidthTypes.BOXED

Topbar Theme

There are 2 types of Topbar Theme : 1. Light Topbar 2. Dark Topbar 3.
Colored Topbar. you would change the topbarTheme variable\'s value if
you want to change layout width.

image

Light Topbar

topbarTheme: topBarThemeTypes.LIGHT

image

Dark Topbar

topbarTheme: topBarThemeTypes.DARK

Sidebar Type (Available for Vertical Layout Only)

There are 3 types of Sidebar Types : 1. Default 2. Compact 3. Icon . you
would change the leftSideBarType variable\'s value if you want to change
layout width.

image

Default Sidebar

leftSideBarType: leftSidebarTypes.DEFAULT

image

Compact Sidebar

leftSideBarType: leftSidebarTypes.COMPACT

image

Icon Sidebar

leftSideBarType: leftSidebarTypes.ICON

Sidebar Color (Available for Vertical Layout Only)

There are total 2 colors available for sidebar. you would change the
leftSideBarTheme variable\'s value if you want to change layout width.

image

Light Color Sidebar

leftSideBarTheme: leftSideBarThemeTypes.LIGHT

image

DARK Color Sidebar

leftSideBarTheme: leftSideBarThemeTypes.DARK\
\
\
\
\
Layout

Understanding template layouts will help you create page with your
desired layout.

Layout Types

Each layout is coming with it\'s unique components. There are 3 Layout
Types :

1\. Blank Layout

2\. Default Layout

Blank Layout

This is useful if you want to create pages without any other content
except page\'s content like Authentication page where you don\'t need
sidebar, topbar, navbar, rightbar, footer, etc.

Basically this is a simple blank page and you can create everything from
scratch.

Example:

Login

Register

Reset Password

Lock Screen

How to Create a Page with Blank Layout ?

To create a page with blank layout, add the new page\'s route to
publicRoutes in src/routes/routes.js file. Tada!! it will automatically
render with the blank layout.

You can check how to create a new page from here.

Example :

import newPage from \"../pages/newPage\"

const publicRoutes = \[

{ path: \"/new-page\", component: \<newPage /\> }

\]

Full Layout

This is a full layout of this template. this layout comes with below
components :

1\. Topbar

2\. Menu

3\. Footer

4\. Rightbar (template config)

You can change the styles and structure of topbar & menu components
easily with Theme Configuration features.

This layout has 2 types : 1. Horizontal Layout 2. Vertical Layout.

Info

Both Vertical and Horizontal layouts are comes with it\'s own
components. basically these both are different from it\'s navigation
types.

Vertical Layout has Sidebar component to handle template\'s navigation.

Horizontal Layout has Navbar component to handle template\'s navigation.

How to change layout from Vertical to Horizontal or vise versa ?

Only one change to make horizontal/vertical layouts on all the pages.
Set layoutType: layoutTypes.HORIZONTAL in the INIT_STATE in the
src/store/layout/reducer.js if you want a Horizontal layout, and
layoutType: layoutTypes.VERTICAL if you want a vertical layout.

How to Create a Page with Full Layout ?

To create a page with full layout, add the new page\'s route to
authProtectedRoutes in src/routes/routes.js file. Tada!! it will
automatically render with the blank layout.

Example :

import newPage from \"../pages/newPage\"

const authProtectedRoutes = \[

{ path: \"/new-page\", component: \<newPage /\> }

\]

Vertical Layout

To modify/extend Vertical layout, navigate to
src/Layout/VerticalLayout/index.js.

// Layout Related Components

import Header from \"./Header\"

import Sidebar from \"./Sidebar\"

import Footer from \"./Footer\"

import Rightbar from \"../CommonForBoth/RightSidebar\"

class Layout extends Component {

render() {

return (

\<\>

\<div id=\"layout-wrapper\"\>

// topbar

\<Header /\>

// sidebar (navigation menu)

\<Sidebar /\>

// page content

\<div className=\"main-content\"\>

{props.children}

\</div\>

// footer

\<Footer /\>

\</div\>

// rightbar

\<Rightbar /\>

\</\>

)

}

}

export default Layout;

Header.js : this is the component for layout\'s topbar. you can
overwrite/change layout\'s topbar as per your need by replacing it\'s
content.

Sidebar.js : this is the component for layout\'s navigation menu. you
can overwrite/change layout\'s navigation styles & menus as per your
need by replacing it\'s content.

Footer.js : this is the component for layout\'s footer. you can
overwrite/change footer\'s navigation footer content as per your need.

Rightbar.js : this is the component for layout\'s rightbar. basically
rightbar is used for theme configurations. you can also replace it with
your own need.

Horizontal Layout

To modify/extend Horizontal layout, navigate to
src/Layout/HorizontalLayout/index.js.

// Layout Related Components

import Header from \"./Header\"

import Navbar from \"./Navbar\"

import Footer from \"./Footer\"

import Rightbar from \"../CommonForBoth/RightSidebar\"

class Layout extends Component {

render() {

return (

\<\>

\<div id=\"layout-wrapper\"\>

// topbar

\<Header /\>

// navbar (navigation menu)

\<Navbar /\>

// page content

\<div className=\"main-content\"\>

{props.children}

\</div\>

// footer

\<Footer /\>

\</div\>

// rightbar

\<Rightbar /\>

\</\>

)

}

}

export default Layout;

All of the props & usage for Horizontal Layout are same as Vertical
Layout.\
\
\
\
\
Routing

Upzet React is having routing setup based on React-Router.

You can find our template\'s router configuration in src/routes folder.
the src/routes/routes.js file is containing all routes of our template.

We have also added Authmiddleware in src/routes/index.js file, to handle
redirection for non-auth users. you can also handle roles based routing,
redirections, set accessToken here as per your need.

Note : All private & public routes are rendered in src/App.js file.

How to add new route ?

You can easily add, change or remove any route by simply making changes
described below:

1\. Open src/routes/routes.js file, declare your component. E.g.

import newPage from \"../pages/newPage\"

2\. And make sure to add the entry for same with path and other
properties like path and component same as other routes declared there.
if your page is a public page (with blank layout), then add the route in
publicRoutes, and if your page is a private page (with full layout) then
add route in authProtectedRoutes. E.g.

{ path: \"/new-page\", component: \<newPage /\> }

Each of these properties are explained below:

path : Url relative path

component : Actual component name which would get rendered when user
visits the path

Note : you don\'t need to restart the development server in order to see
the menu changes getting in effect\
\
\
\
Navigation

In this page, you will find how to add/update navigation menu items.

Vertical Layout Menu

you can easily update/add navigation menu items in Vertical Layout
navigated in src/Layout/VerticalLayout/SidebarData.js.

How to add Menu Title ?

Add Menu label and ismainMenu property pass in the JSON object.

{

label: \"Menu\",

ismainMenu: true,

},

How to add Single Menu Item ?

Add label, icon , url and arrow pass in the JSON object.

{

label: \"Calendar\",

icon: \"mdi mdi-calendar-outline\",

isHasArrow: true,

url: \"/calendar\",

},

How to add Nested Menu Item ?

Add following code in \<ul\> tag.

{

label: \"Email\",

icon: \"mdi mdi-email-outline\",

subItem: \[

{ sublabel: \"Inbox\", link: \"/inbox\" },

{ sublabel: \"Read Email\", link: \"/read-email\" },

{ sublabel: \"Email Compose\", link: \"/compose-email\" },

\],

},

Horizontal Layout Menu

you can easily update/add navigation menu items in Vertical Layout
navigated in src/Layout/HorizontalLayout/Navdata.js.

How to add Single Menu Item ?

Add following code in \<ul\> tag.

{

label: \"Calendar\",

url: \"/calendar\",

},

How to add Nested Menu Item ?

Add following code in \<ul\> tag.

{

label: \"Email\",

staclick: function () {

setemail(!email);

setui(false);

setcomponent(false);

setpages(false);

},

subState: email,

subItem: \[

{ link: \"/inbox\", title: \"Inbox\" },

{ link: \"/read-email\", title: \"Read Email\" },

{ link: \"/compose-email\", title: \"Compose Email\" },

\],

},\
\
\
\
Internationalization

i18n Language translation settings

How to add new language?

Let\'s add German language in the existing language.

Create a new file src/locales/fr/translation.json

update the below code in the src/i18n.js file

import translationGr from \'./locales/gr/translation.json\';

const resources = {

gr: {

translation: translationGr

}

};

The translationGr JSON file,

{

\"Mega Menu\": \"Mega-Menu\",

}

Now add the new option of German language in the topbar language
dropdown menu src/components/Common/TopbarDropdown/LanguageDropdown.js

You must have to write all text like {this.props.t(\'Search_keyword\')}
to make it working with all languages. Also make sure to add new words
in all other language files src/locales/{language}/translation.json.

To change default language to german? update below code in the
src/i18n.js file

i18n

.use(detector)

.use(reactI18nextModule) // passes i18n down to react-i18next

.init({

resources,

lng: \"gr\",

fallbackLng: \"gr\", // use en if detected lng is not available

keySeparator: false, // we do not use keys in form messages.welcome

interpolation: {

escapeValue: false // react already safes from xss

}

});\
\
\
\
Redux

Upzet React is having routing setup based on React-Redux & Redux-Saga.
The Store configurations are located in src/store folder.

All module\'s actions are exported from src/store/actions.js file, All
module\'s reducer are exported from src/store/reducers.js file, All
module\'s saga are exported from src/store/sagas.js file, The
src/store/index.js file is handling global redux-store of the template.

How To Create Actions & Saga ?

This example is created with new module\'s actions & saga creation.

Create a folder named with your module in src/store folder and then
create actions.js, saga.js, reducer.js & actionTypes.js files and follow
the pattern of other modules added in this template.

Add your action name in the actionTypes.js file. E.g.

export const GET_USERS_LIST = \"GET_USERS_LIST\"

Create the action in the action.js file. And make sure you pass the same
action type as a type parameter which you added in actionTypes.js file
E.g.

export const getUsersList = (filters) =\> {

return {

type: GET_USERS_LIST,

payload: filters,

}

}

type : action name

payload : action parameters (if any)

Add your action to the reducer.js as well. E.g.

import { GET_USERS_LIST } from \"./actionTypes\"

const INIT_STATE = {

users: \[\],

}

const contacts = (state = INIT_STATE, action) =\> {

switch (action.type) {

case GET_USERS_LIST:

return {

\...state,

users: action.payload,

}

default:

return state

}

}

export default contacts

Add saga function & watcher for action in saga.js file. E.g.

function\* getUsersList() {

try {

// you can perform any action here, E.g. call the api for get user\'s
list

} catch (error) {

// error handler

}

}

// watchers

function\* contactsSaga() {

yield takeEvery(GET_USERS_LIST, getUsersList)

}

export default usersSaga;

Store Actions & Reducers

Layout :

This store modules is made for layout\'s actions, it handles theme
customizer\'s actions & values. You can find actions, reducer & saga
files in src/store/layout folder.

Authentication :

This store modules handles app authentication. You can find actions,
reducer & saga files in src/store/auth folder.

Calendar :

This store modules handles app Calendar\'s functionalities. You can find
actions, reducer & saga files in src/store/calendar folder.\
\
\
How to Create a New Page

Here is the example on how to create your custom page and add it to the
leftsidebar menu, breadcrumbs and also meta tag.

1\. Create a new folder in src/pages. ex. NewPage, and then create a js
file in src/pages/NewPage with name index.js

Example :-

As you know, there are 2 different types of layouts, first is Blank
Layout and second is Full layout.

\- if you want to make your page blank layout, then you need to wrap
your page\'s content with \<Container fluid={false}\>

\- if you want to make your page with full layout, then you need to wrap
your page\'s content with \<div className=\"page-content\"\>\<div\> tag
and \<Container fluid={true}\>

Add Breadcrumbs component. it\'s a common component, it\'s used to add
breadcrumbs in your page.

\- You have to pass 2 props here, first is title and second is
breadcrumbItem.

\- the title prop refers to page title and the breadcrumbItem refers to
page\'s breadcrumb item\'s title.

Add MetaTags to give a html title to your page.

\- Hook Base Components

import React from \'react\';

import { Container } from \"reactstrap\";

//Import Breadcrumb

import Breadcrumbs from \"../../components/Common/Breadcrumb\";

const newPage = () =\> {

document.title = \"New Page \| Upzet - React Admin & Dashboard
Template\";

return (

\<\>

\<div className=\"page-content\"\>

\<Container fluid={true}\>

\<Breadcrumbs title=\"New Page\" breadcrumbItem=\"New Page\" /\>

//write Html code or structure

\</Container\>

\</div\>

\</\>

);

}

export default newPage;

Components (without layout)

import React, { Component } from \'react\';

import { Container } from \"reactstrap\";

const newPage = () =\> {

document.title = \"New Page \| Upzet - React Admin & Dashboard
Template\";

return (

\<div\>

\<Container\>

//write Html code or structure

\</Container\>

\</div\>

)

}

export default newPage;

2\. Add your new page\'s route in /src/Routes/routes.js file.

Check the Routes section to see how to add routes to the web
application.

if you want to create a page with blank layout, then add your page\'s
routes in publicRoutes

Example :-

import newPage from \"../pages/newPage\"

const publicRoutes = \[

{ path: \"/new-page\", component: \<newPage /\> }

\]

if you want to create a page with full layout, then add your page\'s
routes in authProtectedRoutes

Example :-

import newPage from \"../pages/newPage\"

const authProtectedRoutes = \[

{ path: \"/new-page\", component: \<newPage /\> }

\]

3\. Add a navigation in the layouts

For more details, check the Navigation page to see how to add menu item
in your template.

For Vertical Layout :- /src/Layout/VerticalLayout/SidebarData.js

For Horizontal Layout :- /src/Layout/HorizontalLayout/Navdata.js

Example :-

Components

/\*\* Vertical layout \*/

{

label: \"New Page\",

url: \"/new-page\",

icon: \"mdi mdi-calendar-outline\",

isHasArrow: true,

},

/\*\* Horizontal layout \*/

{

label: \"New Page\",

url: \"/new-page\",

},
