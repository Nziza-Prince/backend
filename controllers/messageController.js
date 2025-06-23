const Message = require('../models/messageModel');
const Farm = require('../models/Farm');

exports.sendMessage = async (req, res) => {
    try {
        const { sender, receiver, groupId, farmId, message, type } = req.body;
        const userId = req.user.id;
        if (type === 'direct' && !receiver) {
            return res.status(400).json({ error: 'Receiver is required for direct messages' });
        }
        if (type === 'group' && !groupId) {
            return res.status(400).json({ error: 'Group ID is required for group messages' });
        }
        if (type === 'farm' && !farmId) {
            return res.status(400).json({ error: 'Farm ID is required for farm messages' });
        }
        if (farmId) {
            const farm = await Farm.findById(farmId);
            if (!farm || farm.owner.toString() !== userId) {
                return res.status(403).json({ error: 'Unauthorized or farm not found' });
            }
        }
        const newMessage = await Message.create({ sender, receiver, groupId, farm: farmId, message, type });
        res.json(newMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { sender, receiver, groupId, farmId, type } = req.query;
        const userId = req.user.id;
        let query = {};
        if (type === 'direct') {
            if (!sender || !receiver) {
                return res.status(400).json({ error: 'Sender and receiver are required for direct messages' });
            }
            if (userId !== sender && userId !== receiver) {
                return res.status(403).json({ error: 'Unauthorized to view this conversation' });
            }
            query = { sender, receiver, type: 'direct' };
        } else if (type === 'group') {
            if (!groupId) {
                return res.status(400).json({ error: 'Group ID is required for group messages' });
            }
            // Assume group membership check (requires Group model update)
            query = { groupId, type: 'group' };
        } else if (type === 'farm') {
            if (!farmId) {
                return res.status(400).json({ error: 'Farm ID is required for farm messages' });
            }
            const farm = await Farm.findById(farmId);
            if (!farm || farm.owner.toString() !== userId) {
                return res.status(403).json({ error: 'Unauthorized or farm not found' });
            }
            query = { farm: farmId, type: 'farm' };
        }
        const messages = await Message.find(query).sort('timestamp').populate('sender', 'username').populate('receiver', 'username');
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMessagesForUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const farms = await Farm.find({ owner: userId }).select('_id');
        const farmIds = farms.map(farm => farm._id);
        const messages = await Message.find({
            $or: [
                { receiver: userId, type: 'direct' },
                { sender: userId, type: 'direct' }, // Include sent messages
                { farm: { $in: farmIds }, type: 'farm' }
            ]
        }).sort({ timestamp: -1 }).populate('sender', 'username').populate('receiver', 'username');
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};