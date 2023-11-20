const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

// @desc Get all contacts
// @route GET /api/contacts
// @access private

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});
// @desc Create New contact
// @route POST /api/contacts
// @access private

const createContact = asyncHandler(async (req, res) => {
  console.log("The request body is : ", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are not given");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id
  });
  res.status(201).json(contact);
});
// @desc GET a contact
// @route get /api/contacts/:id
// @access private

const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});
// @desc UPDATE contact
// @route put /api/contacts/:id
// @access private

const updateContact = asyncHandler(async (req, res) => {
  //To update the contact in our database,first we need to fetch that contact with the same method as we have done in get a contact.
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if(contact.user_id.toString() !== req.user.id){
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id, //id that we want to update
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});
// @desc DELETE contact
// @route delete /api/contacts/:id
// @access private

const deleteContact = asyncHandler(async (req, res) => {
  //For delete also,first we need to fetch that contact with the same method as we have done in get,update a contact.
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(400);
    throw new Error("Contact not found");
  }

  if(contact.user_id.toString() !== req.user.id){
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }

  // await Contact.deleteOne(contact);
  //or we can do
    await Contact.deleteOne({_id: req.params.id});



  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
