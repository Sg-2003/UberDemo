const mongoose = require('mongoose');
const dns = require('dns');

function connectToDb() {
    try {
        // Set DNS servers to Google Public DNS to bypass local querySrv ECONNREFUSED restrictions
        dns.setServers(['8.8.8.8', '8.8.4.4']);
    } catch (err) {
        console.warn('DNS setServers failed, using default system resolver:', err.message);
    }

    mongoose.connect(process.env.DB_CONNECT)
        .then(() => {
            console.log('Connected to DB');
        })
        .catch(err => console.log('Database connection error:', err));
}


module.exports = connectToDb;