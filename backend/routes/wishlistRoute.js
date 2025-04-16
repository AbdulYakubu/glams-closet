import express from 'express';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import authUser from '../middleware/authUser.js';

const wishlistRouter = express.Router();

wishlistRouter.post('/add', authUser, addToWishlist);
wishlistRouter.post('/', authUser, getWishlist); // Changed from POST to GET for retrieving wishlist data
wishlistRouter.post('/remove', authUser, removeFromWishlist);

export default wishlistRouter;