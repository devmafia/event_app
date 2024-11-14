const { Events, Users_events, Bookings, Seats, BookingSeats, BookingEvents }  = require("../models/models.js");
const sequelize = require("../config/db");

const getBookings = async (req, res, next) => {
    try {
        let { eventId } = req.query;
        eventId = parseInt(eventId, 10);
        const userId = parseInt(req.userId, 10);
        const where = {};
        if (eventId) where.eventId = eventId;
        if (userId) where.userId = userId;

        const bookings = await Bookings.findAll({
            where,
            include: [
                {
                    model: Events,
                    as: 'events',
                    required: true, 
                },
                {
                    model: Users_events,
                    as: 'user',
                    required: true,
                },
                {
                    model: Seats,
                    as: 'seats',
                    through: BookingSeats,
                    required: false,
                },
            ],
        });
        console.log(bookings);
        
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching bookings.' });
        next(error);
    }
};


const bookEvents = async (req, res) => {
    const { userId, events, guestName, guestEmail, phone } = req.body.bookings;
    const transaction = await sequelize.transaction();
    try {
        const booking = await Bookings.create({
            userId,
            guestName,
            guestEmail,
            phone,
            totalPrice: 0,
        }, { transaction });

        let totalPrice = 0;

        for (const event of events) {
            const { eventId, seats } = event;

            const eventRecord = await Events.findByPk(eventId, { transaction });
            if (!eventRecord || eventRecord.availableSeats < seats.length) {
                throw new Error(`Insufficient seats for event ${eventId}`);
            }

            for (const seatId of seats) {
                const seat = await Seats.findByPk(seatId, { transaction });
                if (!seat || seat.isBooked) {
                    throw new Error(`Seat ${seatId} is already booked`);
                }
                
                seat.isBooked = true;
                await seat.save({ transaction });
            }

            eventRecord.availableSeats -= seats.length;
            await eventRecord.save({ transaction });

            await BookingEvents.create({
                bookingId: booking.id,
                eventId: eventId,
            }, { transaction });

            for (const seatId of seats) {
                await BookingSeats.create({
                    bookingId: booking.id,
                    seatId,
                    eventId: eventId,
                }, { transaction });
            }

            totalPrice += parseFloat(eventRecord.price) * seats.length;
        }

        booking.totalPrice = totalPrice;
        await booking.save({ transaction });

        await transaction.commit();
        res.status(201).json({ booking });
    } catch (error) {
        await transaction.rollback();
        console.error('Error in bookEvents:', error);
        res.status(500).json({ error: error.message });
    }
};


const deleteBooking = async (req, res) => {
    const bookingId = parseInt(req.params.id, 10);
    const transaction = await sequelize.transaction();

    try {
        const booking = await Bookings.findByPk(bookingId, {
            include: [
                { model: Seats, through: BookingSeats, as: 'seats' },
                { model: Events, through: BookingEvents, as: 'events' },
            ],
            transaction,
        });

        if (!booking) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Booking not found' });
        }

        const eventIds = booking.events.map(event => event.id);
        const seatCountByEvent = {};

        for (const seat of booking.seats) {
            await Seats.update({ isBooked: false }, { where: { id: seat.id }, transaction });

            const eventId = seat.eventId;
            seatCountByEvent[eventId] = (seatCountByEvent[eventId] || 0) + 1;
        }

        for (const eventId of eventIds) {
            if (seatCountByEvent[eventId]) {
                const event = await Events.findByPk(eventId, { transaction });
                if (event) {
                    event.availableSeats += seatCountByEvent[eventId];
                    await event.save({ transaction });
                }
            }
        }

        await BookingEvents.destroy({ where: { bookingId }, transaction });
        await BookingSeats.destroy({ where: { bookingId }, transaction });
        await Bookings.destroy({ where: { id: bookingId }, transaction });

        await transaction.commit();
        res.status(200).json({
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error deleting booking' });
    }
};

module.exports = { getBookings, bookEvents, deleteBooking };




