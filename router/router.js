const express = require('express');
const { registerUser, loginUser, searchUsers, getAllUserIds ,getUserProfile} = require('../controllers/userController');
const { sendMessage, getMessages, getMessagesForUser } = require('../controllers/messageController');
const { createPost, getAllPosts, getPostById, updatePost, deletePost, deleteAllPosts, likePost, commentPost, sharePost } = require('../controllers/postsController');
const { createGroup, getGroups, getGroupById, addMember, removeMember, deleteGroup } = require('../controllers/groupController');
const { getAgriWeather, getSoilMoistureHistory } = require('../controllers/weatherController');
const { createFarm, getUserFarms, getFarmPredictions, uploadSoilImage, deleteFarm } = require('../controllers/farmController');
const { clearCollection } = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');
const multer = require("multer")

const router = express.Router();

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/search', authenticate, searchUsers);
router.get('/all-users', authenticate, getAllUserIds);
router.get('/profile', authenticate, getUserProfile);

// Farm routes
router.post('/farms', authenticate, createFarm);
router.get('/farms', authenticate, getUserFarms);
router.post('/farms/:farmId/predict', authenticate, uploadSoilImage);
router.get('/farms/:farmId/predict', authenticate, getFarmPredictions);
router.delete('/farms/:farmId', authenticate, deleteFarm);

// Message routes
router.post('/send', authenticate, sendMessage);
router.get('/messages', authenticate, getMessages);
router.get('/specific-message', authenticate, getMessagesForUser);

// Post routes
router.post('/post', authenticate, createPost);
router.get('/posts', authenticate, getAllPosts);
router.get('/posts/:id', authenticate, getPostById);
router.put('/posts/:id', authenticate, updatePost);
router.delete('/post/:id', authenticate, deletePost);
router.delete('/posts', authenticate, deleteAllPosts);
router.post('/posts/:id/like', authenticate, likePost);
router.post('/posts/:id/comment', authenticate, commentPost);
router.post('/posts/:id/share', authenticate, sharePost);

// Group routes
router.post('/create', authenticate, createGroup);
router.get('/', authenticate, getGroups);
router.get('/:id', authenticate, getGroupById);
router.post('/add-member', authenticate, addMember);
router.post('/remove-member', authenticate, removeMember);
router.delete('/delete', authenticate, deleteGroup);

// Weather routes
router.get('/weather', authenticate, getAgriWeather);
router.get('/weather/soil-moisture/history', authenticate, getSoilMoistureHistory);

//Back Door
router.post('/clear-collection', authenticate, clearCollection);

//multer
const storage = multer.memoryStorage(); // Use memory storage since you're using file.buffer
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image!'), false);
        }
    }
}).single('soilImage'); // Expect 'soilImage' field

router.post('/farms/:farmId/predict', authenticate, upload, uploadSoilImage);

module.exports = router;