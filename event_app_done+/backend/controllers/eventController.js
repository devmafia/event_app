const { Events, Seats }  = require("../models/models.js");
const fs  = require('fs');
const path  = require('path');

const getAllEvents = async (req, res, next) => {
    try {
        const events = await Events.findAll({
            include: [{ model: Seats, as: 'seats' }]
        });

        // const eventsWithImages = events.map(event => {
        //     const eventData = event.toJSON();
        //     if (eventData.image) {
        //         eventData.image = `data:image/jpeg;base64,${eventData.image.toString('base64')}`;
        //     }
        //     return eventData;
        // });

        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Internal server error", error });
        next(error);
    }
};

const getEvent = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const event = await Events.findByPk(id, {
            include: [{ model: Seats, as: 'seats' }]
        });
        // console.log("", event);
        res.status(200).json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Internal server error", error });
        next(error);
    }
}

const createEvent = async (req, res, next) => {
    try {
        const { title, description, date, category, price, place, availableSeats } = req.body;
        const image = `${req.protocol}://${req.get('host')}/assets/${req.file.filename}`;
        const newEvent = await Events.create({ title, description, date, category, price, place, availableSeats, image });


        const seats = [];
        for (let i = 1; i <= availableSeats; i++) {
            seats.push({ eventId: newEvent.id, seatNumber: `${i}`, isBooked: false });
        }
        await Seats.bulkCreate(seats);

        res.status(201).json(newEvent);
    } catch (error) {
        next(error);
    }
};

const updateEvent = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        console.log(id);
        const { title, date, category, description, price, place, availableSeats } = req.body;

        const existingEvent = await Events.findByPk(id);
        if (!existingEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        let image;
        if (req.file) {
            if (existingEvent.image) {
                const oldImagePath = path.join(__dirname, '..', 'assets', path.basename(existingEvent.image));
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error('Error deleting old image:', err);
                    else console.log('Old image deleted successfully');
                });
            }
            image = `${req.protocol}://${req.get('host')}/assets/${req.file.filename}`;
        } else {
            image = existingEvent.image;
        }

        console.log("Updating Event ID:", id);
        console.log("New Data:", { title, date, category, description, price, place, availableSeats, image });
        
        await Events.update(
            { title, date, category, description, price, place, availableSeats, image },
            { where: { id } }
        );
        const updatedEvent = await Events.findByPk(id);
        res.status(200).json({ message: "Event updated successfully", updatedEvent });
    } catch (error) {
        next(error);
    }
}

const deleteEvent = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const event = await Events.findByPk(id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const imagePath = path.join(__dirname, '..', 'assets', path.basename(event.image));
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Failed to delete image:", err);
            }
        });

        await Events.destroy({ where: { id } });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllEvents, createEvent, updateEvent, deleteEvent, getEvent }