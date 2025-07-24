// 1joCwHyy1RqaZxED
// mongodb+srv://skhadaf123:1joCwHyy1RqaZxED@class-project.ejz8ngs.mongodb.net/?retryWrites=true&w=majority&appName=class-project
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import cors from 'cors'
import path from "path"
import { fileURLToPath } from "url";
import myModel from './Models/Task.js';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname, "views")));
app.set("view engine", "html");
app.use(cors());

app.use(express.json()); // Important for parsing JSON bodies

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.post("/create", async (req, res)=>{
   const {Task} = req.body
    console.log("Request body:", req.body);
   const addData = new myModel({Task:Task})
   const saveData = await addData.save()
   res.status(201).json(`Task is added succesfully ${saveData}`);
  //  res.send(`Task is added succesfully ${saveData}`);

})

app.patch("/update/tasks/:id", async (req, res) => {
  try {
      const { Task } = req.body;
        const updated = await myModel.findByIdAndUpdate(req.params.id, {
            Task: Task
        }, { new: true });
        // let saveData =await updated.save()
        res.json(updated);
        console.log(updated)
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
});

// app.get('/tasks', async (req, res) => {
//   const tasks = await myModel.find();
//   res.json(tasks);
// });

app.delete("/delete", async (req, res)=>{
  let {Task} = req.body;
  let deleteData = await myModel.deleteMany({Task})
  res.json(deleteData);
  res.send(deleteData)
  console.log(deleteData)
})
app.get("/getdata", async (req, res)=>{
  let displayData = await myModel.find()
  res.json(displayData);
  // console.log(displayData)
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
