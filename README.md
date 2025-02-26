# Issue Tracker

A full-stack issue tracking application built for the freeCodeCamp Quality Assurance certification. This application allows users to create, read, update, and delete issues for various projects.

## 🌟 Features

- **Create Issues**: Submit new issues with details like title, description, assignee, and status
- **Track Issues**: View all issues for a specific project
- **Filter Issues**: Filter issues by their open/closed status
- **Update Issues**: Change the status, assignment, or details of existing issues
- **Delete Issues**: Remove issues that are no longer needed
- **RESTful API**: A complete API with endpoints for all CRUD operations

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## 🚀 Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fcc-issuetracker.git
   cd fcc-issuetracker
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   # NODE_ENV=test  # Uncomment this line for running tests
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Visit `http://localhost:3000` in your browser to use the application.

## 🔍 Usage

### Dashboard

The dashboard provides an overview of all projects and recent issues. From here, you can:
- Navigate to project issues
- View recent activity
- Access the API documentation

### Project Issues

The project issues page displays all issues for a specific project. You can:
- Submit new issues
- View existing issues
- Filter issues by status
- Close or reopen issues
- Delete issues

### API Usage

The API usage page provides comprehensive documentation on how to use the Issue Tracker API, including:
- Endpoint descriptions
- Request and response formats
- Example usage

## 📡 API Endpoints

### GET `/api/issues/{project}`
Retrieves all issues for a specific project. Can be filtered using query parameters.

**Example:**
```
GET /api/issues/test-project?open=true&assigned_to=John
```

### POST `/api/issues/{project}`
Creates a new issue for a specific project.

**Required Fields:**
- `issue_title`
- `issue_text`
- `created_by`

**Optional Fields:**
- `assigned_to`
- `status_text`

### PUT `/api/issues/{project}`
Updates an existing issue.

**Required Field:**
- `_id`

**Optional Fields (at least one required):**
- `issue_title`
- `issue_text`
- `created_by`
- `assigned_to`
- `status_text`
- `open`

### DELETE `/api/issues/{project}`
Deletes an issue.

**Required Field:**
- `_id`

## 🛠️ Technologies Used

- **Frontend**: HTML, CSS, JavaScript, jQuery
- **Backend**: Node.js, Express.js
- **Testing**: Mocha, Chai

## 🧪 Testing

Run the test suite with:
```
npm test
```

The test suite includes:
- Functional tests for all API endpoints
- Unit tests for the core functionality

### Testing in Deployment Environments

When deploying to platforms like Render, make sure to set these environment variables:
- `PORT`: The port your application will listen on (e.g., 3000)
- `NODE_ENV`: Set to "production" for production environments
- `RENDER`: Set to "true" if deploying to Render

The application is configured to start the server correctly in all environments, including test mode on Render.

## 🎓 Credits

This project was created as part of the [freeCodeCamp Quality Assurance certification](https://www.freecodecamp.org/learn/quality-assurance/).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
