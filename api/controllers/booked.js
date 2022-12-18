import Booked from '../models/booked.js';

export const createBook = async (req, res) => {
    const { name, email, address, hotelName, room, totalAmount, startDate, tomDate, night, numAdult } = req.body;
    try {
        const item = new Booked({
            name, email, address, hotelName, rooms: room, totalAmount, startDate, tomDate, night, numAdult
        })
        const savedBooked = await item.save();
        res.status(201).json({ msg: 'done' });
    } catch (err) {
        res.status(500).json(err);
    }
}

export const getBooked = async (req, res) => {
    try {
        const booked = await Booked.find()
        res.status(200).json(booked);
    } catch (err) {
        res.status(500).json(err);
    }
}


