const express = require('express')
const app = express();
const dotenv = require('dotenv');
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/user.routes')
const protectedRoute = require('./middlewares/authMiddleware')
const roleBased = require('./middlewares/roleMiddleware')
app.use(express.json());
dotenv.config();

const {dbConnection} = require('./utils/dbConnection')
const authRoutes = require('./routes/authRoutes')
const imageRoutes = require('./routes/image.routes')

const PORT = process.env.PORT || 3001


dbConnection();

app.use('/api/auth',authRoutes);
app.use('/home',protectedRoute,userRoutes);
app.use('/admin', protectedRoute, roleBased, adminRoutes)
app.use('/api/image',imageRoutes);

app.listen(PORT,() => console.log(`server running on port ${PORT}`))