import { Router } from "express";
import { verifyToken } from "../middlewares/Authmiddleware.js";
import { getContactsForDMList, searchContacts } from "../controllers/ContactsController.js"; // Ensure path is correct

const ContactRoutes = Router();
ContactRoutes.post("/search-contacts", verifyToken, searchContacts);
ContactRoutes.get("/get-contacts-for-DM",verifyToken,getContactsForDMList)

export default ContactRoutes;
