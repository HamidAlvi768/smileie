The sources mention various files and folders that are part of the Upzet React Admin & Dashboard Template's structure, particularly concerning Redux and API integration.

Here is a list of the files mentioned:

*   **`src/store`**: This folder contains the store configurations for Redux.
    *   **`src/store/actions.js`**: All module's actions are exported from this file.
    *   **`src/store/reducers.js`**: All module's reducers are exported from this file.
    *   **`src/store/sagas.js`**: All module's sagas are exported from this file.
    *   **`src/store/index.js`**: This file handles the global Redux store of the template.
    *   Within specific module folders (e.g., `src/store/layout`, `src/store/auth`, `src/store/calendar`, or a new `src/store/demo` module):
        *   **`actions.js`**: This file defines actions for a specific module, such as `getUsersList`.
        *   **`saga.js`**: This file contains saga functions and watchers for actions within a module, like `getUsersList` or `fetchDemoData`.
        *   **`reducer.js`**: This file manages the state changes based on actions for a module, such as `contacts` or `Demo`.
        *   **`actionTypes.js`**: This file defines action names (types) for a module, such as `GET_USERS_LIST` or `GET_DEMO_DATA`.
*   **`src/helpers`**: This folder contains files related to API integrations.
    *   **`src/helpers/api_helper.js`**: This file contains the Axios setup for calling server APIs, including methods like `get`, `put`, `post`, and `delete`, along with interceptors and token set methods.
    *   **`src/helpers/fakebackend_helper.js`**: This file contains all API call functions when using the fake backend.
    *   **`src/helpers/url_helper.js`**: This file contains all module's API URLs, such as `GET_DEMO_DATA`.
    *   **`src/helpers/fakeBackend.js`**: This specific file is mentioned as being deletable if not using the fake backend setup.
*   **`app.js`**: This file is mentioned in the context of removing fake-backend related code from it when integrating a real API.