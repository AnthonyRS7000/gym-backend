const express = require('express');
const router = express.Router();
const { getProfile,updateProfile } = require('../controllers/userController');
const authenticateToken = require('../middlewares/verificarToken.js');

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile); // ← ¡IMPORTANTE!
module.exports = router;
