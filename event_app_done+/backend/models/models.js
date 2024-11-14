const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Events extends Model {}

Events.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    place: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    availableSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Events',
    timestamps: true,
});

class Users_events extends Model {}

Users_events.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Users_events',
    timestamps: true,
});

class Administrator extends Model {}

Administrator.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Administrator',
    timestamps: true
});

class Seats extends Model {}

Seats.init({
    eventId: {
        type: DataTypes.INTEGER,
        references: { model: Events, key: 'id' },
    },
    seatNumber: { type: DataTypes.STRING, allowNull: false },
    isBooked: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { sequelize, modelName: 'Seats', timestamps: true });

Events.hasMany(Seats, { foreignKey: 'eventId', as: 'seats', onDelete: 'CASCADE' });
Seats.belongsTo(Events, { foreignKey: 'eventId', onDelete: 'CASCADE' });

class Bookings extends Model {}

Bookings.init({
    userId: {
        type: DataTypes.INTEGER,
        references: { model: Users_events, key: 'id' },
        allowNull: true,
    },
    guestName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    guestEmail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, { sequelize, modelName: 'Bookings', timestamps: true });

Users_events.hasMany(Bookings, { foreignKey: 'userId', as: 'bookings', onDelete: 'CASCADE' });
Bookings.belongsTo(Users_events, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE'});

class BookingEvents extends Model {}
BookingEvents.init({
    bookingId: {
        type: DataTypes.INTEGER,
        references: { model: Bookings, key: 'id' },
    },
    eventId: {
        type: DataTypes.INTEGER,
        references: { model: Events, key: 'id' },
    },
}, { sequelize, modelName: 'BookingEvents', timestamps: false });

Bookings.belongsToMany(Events, { through: BookingEvents, foreignKey: 'bookingId', as: 'events' });
Events.belongsToMany(Bookings, { through: BookingEvents, foreignKey: 'eventId', as: 'bookings' });

class BookingSeats extends Model {}
BookingSeats.init({
    bookingId: {
        type: DataTypes.INTEGER,
        references: { model: Bookings, key: 'id' },
    },
    seatId: {
        type: DataTypes.INTEGER,
        references: { model: Seats, key: 'id' },
    },
    eventId: {
        type: DataTypes.INTEGER,
        references: { model: Events, key: 'id' },
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'BookingSeats',
    timestamps: false,
});

Bookings.belongsToMany(Seats, { through: BookingSeats, foreignKey: 'bookingId', as: 'seats', onDelete: 'CASCADE' });
Seats.belongsToMany(Bookings, { through: BookingSeats, foreignKey: 'seatId', as: 'bookings', onDelete: 'CASCADE' });

module.exports = { Events, Users_events, Bookings, Administrator, Seats, BookingSeats, BookingEvents };