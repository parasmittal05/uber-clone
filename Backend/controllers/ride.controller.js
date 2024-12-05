const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
 // Import the socket instance

module.exports.createRide = async (req, res) => {
    // Validate incoming request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType, userId } = req.body;

    // Ensure userId is present
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        // Create ride with static data
        const ride = await rideService.createRide({ 
            user: req.user._id, pickup, destination, vehicleType 
        });

        // Send socket notification to the user
        io.to(userId).emit('notification', {
            message: 'Ride created successfully!',
            rideId: ride._id,
        });

        // Use static data to simulate nearby captains
        const captainsInRadius = [
            { socketId: 'captain1SocketId' }, 
            { socketId: 'captain2SocketId' }
        ];

        // Notify all captains within radius about the new ride
        captainsInRadius.forEach((captain) => {
            io.to(captain.socketId).emit('new-ride', {
                event: 'new-ride',
                data: {
                    rideId: ride._id,
                    pickup,
                    destination,
                    vehicleType,
                    user: req.user,
                },
            });
        });

        // Respond with success message
        res.status(201).json({ message: 'Ride created successfully!', ride });
    } catch (error) {
        console.error('Error creating ride:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
