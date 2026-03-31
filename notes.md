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

# Day-29
- http request
    - UI
    - rest api
- client side language can not directly intract with db so it will intract with node.js and node,.js intract with db and send response to client
- client side language intract (communicate) with node.js via rest api to perform some action and we do this via http request(ajax request earlier) [fetch or axios]

- notyf


