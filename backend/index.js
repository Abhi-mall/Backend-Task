import express  from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import locationsRoutes from './routes/location.js'
import inspectionsRoutes from './routes/inspections.js'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())

const PORT = process.env.PORT || 8080

app.use('/auth', authRoutes);
app.use('/locations', locationsRoutes);
app.use('/inspections', inspectionsRoutes);

app.get("/", (req, res)=> {
  res.json({
    message: "server is running " + PORT
  })
})

connectDB().then(()=> {
  app.listen(PORT, ()=> {
    console.log("Server is running ", PORT)
  })
})

export default app;