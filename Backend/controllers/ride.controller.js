const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');

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

        // Use static data to simulate nearby captains
       

        // No socket communication here, just return the response
        // Respond with success message
        res.status(201).json({
            message: 'Ride created successfully!',
            ride,
            captainsInRadius, // Simulate captains data
        });

    } catch (error) {
        console.error('Error creating ride:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
