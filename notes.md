# 🔥 Day 28 – File Download in Node.js (Express)

---

# 📥 1. What is File Download?

### 📌 Definition:

File download means sending a file from **server → client (browser)** so that user can save it locally.

---

### 🔄 Flow:

```text
Client → Request (file id)
Server → Find file → Send file
Browser → Download file
```

---

# 🧠 2. Finding File using ID

---

### 📌 Concept:

* Store file info in DB (MongoDB)
* Use `_id` to fetch file

---

## ✅ Example:

```js
const file = await FileModel.findById(id)
```

---

### ⚠️ Important Rule:

👉 Always handle `null`

```js
if (!file) {
  return res.status(404).json({ message: "File not found" })
}
```

---

### 🧠 Applies to:

* `findById()`
* `findByIdAndUpdate()`
* `findByIdAndDelete()`

---

# 🛣️ 3. API Endpoint Design

---

### 📌 Endpoint:

```text
GET /file/download/:id
```

---

### 🧠 Why RESTful?

* Clean structure
* Easy to maintain
* Scalable

---

# 📁 4. Absolute File Path

---

### 📌 Problem:

DB stores relative path like:

```text
uploads/demo.png
```

---

### 📌 Solution:

Convert to **absolute path**

---

## ✅ Example:

```js
const root = process.cwd()
const filePath = path.join(root, file.path)
```

---

### 🧠 Explanation:

* `process.cwd()` → current working directory
* `path.join()` → safely joins paths

---

# 📤 5. Sending File using `res.sendFile()`

---

### 📌 Definition:

Sends file from server to client

---

## ✅ Example:

```js
res.sendFile(filePath, (err) => {
  if (err) {
    res.status(404).json({ message: "File not found" })
  }
})
```

---

### 🧠 Important:

* It uses **callback**
* Handles errors like missing file

---

# 📎 6. Force File Download (Very Important)

---

### 📌 Problem:

Browser may open file instead of downloading

---

### 📌 Solution:

Set headers

---

## ✅ Headers:

```js
res.setHeader(
  "Content-Disposition",
  `attachment; filename="${file.filename}"`
)
```

---

### 🧠 Meaning:

* `attachment` → force download
* `filename` → download name

---

## 🔹 Optional:

```js
res.setHeader("Content-Type", "image/png")
```

---

### 🧠 Why?

* Tells browser file type

---

# 🧾 7. Complete Working Code

---

```js
import path from "path"

const fileDownload = async (req, res) => {
  try {
    const { id } = req.params

    const file = await FileModel.findById(id)

    if (!file) {
      return res.status(404).json({ message: "File not found" })
    }

    const root = process.cwd()
    const filePath = path.join(root, file.path)

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.filename}"`
    )

    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).json({ message: "File not found" })
      }
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
```

---

# ⚠️ 8. Important Best Practices

---

## 🔹 1. Always Handle Null

```js
if (!file) return res.status(404)
```

---

## 🔹 2. Use Absolute Path

```js
path.join(process.cwd(), file.path)
```

---

## 🔹 3. Handle Errors in sendFile

---

## 🔹 4. Validate ID (Advanced)

```js
import mongoose from "mongoose"

if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({ message: "Invalid ID" })
}
```

---

# ⚡ 9. Alternative (Advanced)

---

## 🔹 Using `res.download()`

```js
res.download(filePath, file.filename)
```

---

### 🧠 Difference:

| Method   | Use                 |
| -------- | ------------------- |
| sendFile | display or download |
| download | always download     |

---

# 📊 10. Dashboard API Concept

---

### 📌 Note:

For small projects:

👉 No need to create separate model

---

### ✅ Example:

```js
const totalFiles = await FileModel.countDocuments()
const totalUsers = await UserModel.countDocuments()
```

---

### 🧠 Why?

* Dashboard = aggregated data
* No need for separate schema

---

# ❌ 11. Common Mistakes

---

### ❌ Not handling null

```js
const file = await FileModel.findById(id)
// crash ❌
```

---

### ❌ Using relative path

```js
res.sendFile(file.path) ❌
```

---

### ❌ Not setting headers

→ file opens instead of downloading ❌

---

# 🧠 Final Summary

* Use `findById()` to fetch file
* Always handle null
* Convert to absolute path
* Use `res.sendFile()` to send file
* Use headers to force download
* Dashboard APIs don’t need models

---

# 🔥 Day 29 – HTTP Request & Client-Server Interaction

---

# 🌐 1. What is an HTTP Request?

---

### 📌 Definition:

An **HTTP Request** is a message sent by the **client (browser/React)** to the **server (Node.js)** to perform some action.

---

### 🔄 Flow:

```text
Client (React UI)
   ↓ HTTP Request (fetch / axios)
Server (Node.js / Express)
   ↓ Database (MongoDB)
Server → Response (JSON)
Client → Update UI
```

---

# 🧠 2. Why Do We Need HTTP Requests?

---

### 📌 Important Rule:

👉 **Client-side languages (HTML, CSS, JS, React) cannot directly interact with database**

---

### ❌ Not Possible:

```text
React → MongoDB ❌
```

---

### ✅ Correct Flow:

```text
React → Node.js → MongoDB → Node.js → React
```

---

### 🧠 Reason:

* Security 🔒
* Authentication
* Data validation

---

# ⚛️ 3. UI + REST API

---

## 🔹 UI (Frontend)

### 📌 Definition:

User Interface where user interacts

👉 Example:

* Form
* Button
* Dashboard

---

## 🔹 REST API (Backend)

### 📌 Definition:

A set of endpoints that handle requests

---

### ✅ Example:

| Method | Endpoint   | Purpose     |
| ------ | ---------- | ----------- |
| GET    | /users     | Fetch users |
| POST   | /users     | Create user |
| PUT    | /users/:id | Update user |
| DELETE | /users/:id | Delete user |

---

# 🔁 4. Communication using HTTP

---

### 📌 Old Method:

* AJAX (XMLHttpRequest)

---

### 📌 Modern Methods:

---

## 🔹 1. fetch()

### ✅ Example:

```js
fetch("/users")
  .then(res => res.json())
  .then(data => console.log(data))
```

---

## 🔹 2. axios (Recommended)

---

### 📌 Why Axios?

* Cleaner syntax
* Automatic JSON parsing
* Better error handling

---

### ✅ Example:

```js
import axios from "axios"

const getUsers = async () => {
  try {
    const res = await axios.get("/users")
    console.log(res.data)
  } catch (err) {
    console.log(err.message)
  }
}
```

---

# ⚡ 5. Types of HTTP Methods

---

| Method | Use Case       |
| ------ | -------------- |
| GET    | Fetch data     |
| POST   | Create data    |
| PUT    | Update data    |
| PATCH  | Partial update |
| DELETE | Remove data    |

---

### 🧠 Example:

```js
axios.post("/users", { name: "Shiv" })
axios.put("/users/123", { name: "Updated" })
axios.delete("/users/123")
```

---

# 📦 6. Request & Response

---

## 🔹 Request Contains:

* URL
* Method
* Headers
* Body (optional)

---

## 🔹 Response Contains:

* Status code
* Data (JSON)
* Headers

---

### ✅ Example Response:

```json
{
  "message": "User created",
  "data": {
    "name": "Shiv"
  }
}
```

---

# ⚠️ 7. Error Handling

---

### 📌 Types of Errors:

---

## 🔹 1. API Error

```js
err.response.data.message
```

---

## 🔹 2. System Error

```js
err.message
```

---

### ✅ Best Practice:

```js
console.log(err.response?.data?.message || err.message)
```

---

# 🔔 8. Notyf (Notification Library)

---

### 📌 Definition:

**Notyf** is a lightweight library for showing toast notifications.

---

## 📦 Install:

```bash
npm install notyf
```

---

## 🔹 Setup:

```js
import { Notyf } from "notyf"
import "notyf/notyf.min.css"

const notyf = new Notyf()
```

---

## 🔹 Usage:

```js
notyf.success("User created successfully")
notyf.error("Something went wrong")
```

---

### 🧠 Why Notyf?

* Simple
* Lightweight
* Clean UI

---

# ⚡ 9. Real-World Example

---

```jsx
import axios from "axios"
import { Notyf } from "notyf"

const notyf = new Notyf()

const createUser = async () => {
  try {
    await axios.post("/users", { name: "Shiv" })
    notyf.success("User Created")
  } catch (err) {
    notyf.error(err.response?.data?.message || err.message)
  }
}
```

---

# 🎯 10. Best Practices

---

### ✅ Always use async/await

---

### ✅ Always handle errors

---

### ✅ Use baseURL

```js
axios.defaults.baseURL = "http://localhost:5000"
```

---

### ✅ Use environment variables

```js
import.meta.env.VITE_SERVER
```

---

# ❌ 11. Common Mistakes

---

### ❌ Direct DB call from frontend

---

### ❌ Not handling errors

---

### ❌ Using fetch without JSON parsing

---

### ❌ Hardcoding URLs

---

# 🧠 Final Summary

* HTTP request connects frontend ↔ backend
* React cannot talk directly to DB
* Use axios or fetch
* REST API defines endpoints
* Notyf improves UX with notifications

---


# 🔥 Day 30 – Protecting Pages using JWT

---

# 🔐 1. What is Authentication?

---

### 📌 Definition:

Authentication means **verifying who the user is**

👉 Example:

* Login with email & password

---

# 🔑 2. What is Authorization?

---

### 📌 Definition:

Authorization means **what user is allowed to access**

👉 Example:

* Only logged-in users can access dashboard

---

# 🧠 3. Why Protect Pages?

---

### 📌 Without Protection:

```text
Anyone can access /dashboard ❌
```

---

### ✅ With Protection:

```text
Only valid users with token can access ✔️
```

---

# 🎟️ 4. What is JWT (JSON Web Token)?

---

### 📌 Definition:

A **JWT** is a secure token used to verify users.

---

### 🧠 Important Points:

* Token = meaningless encoded string
* Contains user info (payload)
* Has expiry time
* Verified using **secret key**

---

### 🔄 Flow:

```text
Login → Generate Token → Send to Client
Client → Store Token → Send with Request
Server → Verify Token → Allow / Deny
```

---

# 🔐 5. Secret Key

---

### 📌 Definition:

A private key used to **sign and verify token**

---

### ⚠️ Rule:

👉 NEVER share it ❌
👉 Store in `.env` ✔️

---

### ✅ Generate Secret Key:

```js
require("crypto").randomBytes(32).toString("hex")
```

---

# ⚛️ 6. Install JWT

---

```bash
npm install jsonwebtoken
```

---

# 🧾 7. Generate Token (Backend)

---

### 📌 Rule:

Never include password in token ❌

---

### ✅ Example:

```js
import jwt from "jsonwebtoken"

const payload = {
  id: user._id,
  email: user.email,
  fullname: user.fullname
}

const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: "7d"
})
```

---

### 🧠 Output:

👉 Encoded string like:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

# 💾 8. Store Token (Frontend)

---

### 📌 Using LocalStorage:

```js
localStorage.setItem("token", token)
```

---

### 📌 Methods:

| Method     | Use        |
| ---------- | ---------- |
| setItem    | Save data  |
| getItem    | Get data   |
| removeItem | Remove one |
| clear      | Remove all |

---

### ⚠️ Note:

👉 LocalStorage stores only **string**

---

# 🌐 9. Send Token with Request

---

### 📌 Using Axios:

```js
axios.get("/profile", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
})
```

---

# 🛡️ 10. Verify Token (Backend Middleware)

---

### 📌 Middleware = function that runs before API

---

## ✅ Example:

```js
import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ message: "Invalid token" })
  }
}
```

---

# 🔒 11. Protect Routes

---

```js
app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome", user: req.user })
})
```

---

# ⚛️ 12. Protect Frontend Pages

---

## 📌 Example (React):

```jsx
const token = localStorage.getItem("token")

if (!token) {
  return <Navigate to="/login" />
}
```

---

# 🔄 13. Logout System

---

```js
localStorage.removeItem("token")
```

---

---

# ⚠️ 14. Security Best Practices

---

### ✅ Always:

* Store secret in `.env`
* Set token expiry
* Use HTTPS
* Validate token on backend

---

### ❌ Never:

* Store password in token ❌
* Expose secret key ❌
* Trust frontend only ❌

---

# ⚡ 15. Advanced Concepts

---

## 🔹 1. Refresh Token

* Short-lived access token
* Long-lived refresh token

---

## 🔹 2. Role-Based Access

```js
if (req.user.role !== "admin") {
  return res.status(403)
}
```

---

## 🔹 3. Token Expiry Handling

```js
jwt.sign(payload, secret, { expiresIn: "7d" })
```

---

# ❌ 16. Common Mistakes

---

### ❌ Not verifying token

---

### ❌ Hardcoding secret key

---

### ❌ Not sending token in headers

---

### ❌ Storing sensitive data in token

---

# 🧠 Final Summary

* JWT secures frontend + backend
* Token generated at login
* Stored in localStorage
* Sent with every request
* Verified using secret key
* Middleware protects routes

---

