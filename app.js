require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const mongoose = require('mongoose')

const initRoutes = require('./init/router/init_router')
const userRoutes = require('./auth/router/user_router')

const errorController = require('./error/controller/error_controller');

app.use(bodyParser.json())
app.use('/init', initRoutes)
app.use('/user', userRoutes)

app.use(errorController.handle405);

app.use(errorController.handle404);

mongoose.connect(process.env.MONGO_URI)
    .then(result => {
        app.listen(process.env.PORT);
    }).catch(error => {
        console.log(error);
        app.use((req, res, next) => {
            next(error);
        });
    })

app.use(errorController.handle500);