const { DATABASE } = require('../lib/database');
const { DataTypes } = require('sequelize');

const AntiDelDB = DATABASE.define('AntiDelete', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        defaultValue: 1,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'antidelete',
    timestamps: false,
    hooks: {
        beforeCreate: record => { record.id = 1; },
        beforeBulkCreate: records => { records.forEach(record => { record.id = 1; }); },
    },
});

let isInitialized = false;

async function initializeAntiDeleteSettings() {
    if (isInitialized) return;
    try {
        await AntiDelDB.sync();
        await AntiDelDB.findOrCreate({
            where: { id: 1 },
            defaults: { status: config.ANTI_DELETE || false },
        });
        isInitialized = true;
    } catch (error) {
        console.error('Error initializing anti-delete settings:', error);
    }
}

async function setAnti(status) {
    try {
        await initializeAntiDeleteSettings();
        const record = await AntiDelDB.findByPk(1);
        record.status = status;
        await record.save();
        return true;
    } catch (error) {
        console.error('Error setting anti-delete status:', error);
        return false;
    }
}

async function getAnti() {
    try {
        await initializeAntiDeleteSettings();
        const record = await AntiDelDB.findByPk(1);
        return record.status;
    } catch (error) {
        console.error('Error getting anti-delete status:', error);
        return false;
    }
}

module.exports = {
    AntiDelDB,
    initializeAntiDeleteSettings,
    setAnti,
    getAnti,
};
