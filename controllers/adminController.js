const mongoose = require('mongoose');

const clearCollection = async (req, res) => {
    try {
        const { collection } = req.body;
        const userId = req.user.id;
        const allowedCollections = ['users', 'posts', 'messages', 'groups', 'farms']; // Define allowed collections

        if (!collection || !allowedCollections.includes(collection)) {
            return res.status(400).json({ error: 'Invalid collection' });
        }

        const Model = mongoose.model(collection.charAt(0).toUpperCase() + collection.slice(1));
        let update;

        switch (collection) {
            case 'users':
                update = {
                    username: `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // Reset with unique placeholder
                    email: null,
                    password: null,
                    googleId: null,
                    farms: []
                };
                break;
            case 'posts':
                update = {
                    content: null,
                    image: null,
                    likes: [],
                    comments: [],
                    shares: 0
                };
                break;
            case 'messages':
                update = {
                    message: null,
                    receiver: null,
                    groupId: null,
                    farm: null,
                    type: 'direct' // Default type
                };
                break;
            case 'groups':
                update = {
                    name: `group_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                    description: null,
                    members: [],
                    admin: null
                };
                break;
            case 'farms':
                update = {
                    name: `farm_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                    location: { lat: 0, lon: 0 },
                    soilType: 'LOAM'
                };
                break;
            default:
                return res.status(400).json({ error: 'Unsupported collection for clearing' });
        }

        const result = await Model.updateMany({}, { $set: update }, { multi: true });
        res.json({ message: `${collection.charAt(0).toUpperCase() + collection.slice(1)} contents cleared successfully`, affected: result.modifiedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { clearCollection }; // Export if new file, or merge with existing exports