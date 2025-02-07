import {Router} from "express";
import {verifyJWT} from "../Middleware/verifyJWT.js";
import multer from "multer"
import {giveReview,editReview,deleteReview,giveLike,giveUnLike} from "../Controller/User/giveReview.controller.js"
const upload = multer();

export const review = Router();

review.route("/give-review/:id").post(verifyJWT,upload.none(),giveReview);
review.route("/edit-review/:id").post(verifyJWT,upload.none(),editReview);
review.route("/del-review/:id").delete(verifyJWT,upload.none(),deleteReview);
review.route("/give-like/:id").post(verifyJWT,upload.none(),giveLike);
review.route("/give-un-like/:id").post(verifyJWT,upload.none(),giveUnLike);