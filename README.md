### Project Description

The Email Outreach Platform is a comprehensive web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It facilitates email outreach and workflow management, allowing users to create and manage flowcharts for automating email sequences and workflow processes. The application integrates various technologies such as Firebase for authentication, Nodemailer for sending emails, Agenda for scheduling emails, and MongoDB for data storage.

### Technologies Used

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Authentication:** Firebase Authentication
- **Email Handling:** Nodemailer, Agenda

### Setting Up the Project

#### Frontend (Deployed on Vercel)

1. **Clone Repository**:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Environment Variables**:
   Use Vercel dashboard or CLI to set environment variables:
   - `REACT_APP_API_URL`: `https://email-outreach.onrender.com`(if you want to use already deployed backend) / `https://localhost:<backend-port>.com`(if you are using locally running backend)
   - `REACT_APP_FIREBASE_API_KEY`, `REACT_APP_FIREBASE_AUTH_DOMAIN`, `REACT_APP_FIREBASE_PROJECT_ID`, `REACT_APP_FIREBASE_STORAGE_BUCKET`, `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`, `REACT_APP_FIREBASE_APP_ID`, `REACT_APP_FIREBASE_MEASUREMENT_ID`

4. **Deploy Frontend**:
   ```bash
   vercel --prod
   ```

#### Backend (Deployed on Render)

1. **Clone Repository**:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Environment Variables**:
   Configure environment variables in Render dashboard or using `render.yaml`:
   - `MONGODB_URI`: `<your-mongodb-connection-string>`
   - `EMAIL_HOST`: `<your-email-host>`
   - `EMAIL_USER`: `<your-email-id>`
   - `EMAIL_PORT`: `587`
   - `EMAIL_PASS`: `<your-email-password>`
   - `PORT`: `<backend-port>`

4. **Deploy Backend**:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`

5. **Verify Deployments**:
   - Check Vercel and Render deployment logs for any errors.
   - Ensure both frontend and backend are running smoothly.

This setup guide ensures your Email Outreach Platform is configured correctly with necessary environment variables for secure and efficient operation.
