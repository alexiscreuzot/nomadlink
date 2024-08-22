"use strict";

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const errorHandler = require('errorhandler');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const moment = require('moment');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(errorHandler());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// OAuth setup
const CLIENT_ID = '204812694051-91bud7uc0p6a450g7tllqj1hnk9iru0q.apps.googleusercontent.com';
const CLIENT_SECRET = 'loIU7lsNAsxRP6-ABcEYK0GH';
const REDIRECT_URI = 'https://nomadlink.onrender.com/auth/callback';
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

app.locals.moment = moment;

const MAX_MONTH = 12;
const NomadController = require('./nomadController');
const api = new NomadController();

// Routes
app.get('/', (req, res) => {
    const today = new Date();
    const monthValue = `${today.getMonth()}-${today.getFullYear()}`;
    res.redirect(`/month/${monthValue}`);
});

app.post('/add-reservation', (req, res) => {
    const name = req.body.name;
    const date = req.body.date;

    console.log('Received name:', name);
    console.log('Received date:', date);

    if (!oAuth2Client.credentials || !oAuth2Client.credentials.access_token) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/calendar.events'],
            state: JSON.stringify({ name, date }),
        });
        return res.redirect(authUrl);
    }

    api.addReservation(oAuth2Client.credentials, name, date, (error) => {
        if (error) {
            res.status(500).send('Error adding reservation.');
        } else {
            res.redirect('/');
        }
    });
});

app.get('/month/:month', (req, res) => {
    const today = new Date();
    const dateArr = req.params.month.split("-");
    const selectedDate = new Date(dateArr[1], dateArr[0], 1);

    const months = [];
    for (let i = -1; i < MAX_MONTH; i++) {
        let month = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const selected = (selectedDate.getFullYear() == month.getFullYear()) && (selectedDate.getMonth() == month.getMonth());
        months.push({ "month": month, "selected": selected });
    }

    api.getReservations(selectedDate, function (data) {
        res.render('home', { "data": data, "months": months });
    });
});

app.get('/auth', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar.events'],
        state: JSON.stringify({ name, date }),
    });
    res.redirect(authUrl);
});

app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        const state = JSON.parse(req.query.state);
        const name = state.name;
        const date = state.date;

        api.addReservation(tokens, name, date, (error) => {
            if (error) {
                res.status(500).send('Error adding reservation.');
            } else {
                res.redirect('/');
            }
        });
    } catch (error) {
        console.error('Error retrieving access token:', error);
        res.status(500).send('Error retrieving access token');
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;