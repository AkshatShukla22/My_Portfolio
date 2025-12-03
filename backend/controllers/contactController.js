// backend/controllers/contactController.js
import Contact from '../models/Contact.js';

// @desc    Get contact info
// @route   GET /api/contact
// @access  Public
export const getContact = async (req, res, next) => {
  try {
    let contact = await Contact.findOne();
    
    if (!contact) {
      contact = await Contact.create({
        title: 'Get In Touch',
        subtitle: "Have a project in mind? Let's discuss how I can help you.",
        location: {
          city: 'Your City',
          country: 'Your Country'
        },
        emails: [],
        phoneNumbers: [],
        socialLinks: []
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact info
// @route   PUT /api/contact
// @access  Private
export const updateContact = async (req, res, next) => {
  try {
    let contact = await Contact.findOne();

    if (!contact) {
      contact = await Contact.create(req.body);
    } else {
      contact = await Contact.findByIdAndUpdate(
        contact._id,
        req.body,
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add social link
// @route   POST /api/contact/social
// @access  Private
export const addSocialLink = async (req, res, next) => {
  try {
    const contact = await Contact.findOne();
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    contact.socialLinks.push(req.body);
    await contact.save();

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update social link
// @route   PUT /api/contact/social/:id
// @access  Private
export const updateSocialLink = async (req, res, next) => {
  try {
    const contact = await Contact.findOne();
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const linkIndex = contact.socialLinks.findIndex(
      link => link._id.toString() === req.params.id
    );

    if (linkIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Social link not found'
      });
    }

    contact.socialLinks[linkIndex] = {
      ...contact.socialLinks[linkIndex]._doc,
      ...req.body
    };
    
    await contact.save();

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete social link
// @route   DELETE /api/contact/social/:id
// @access  Private
export const deleteSocialLink = async (req, res, next) => {
  try {
    const contact = await Contact.findOne();
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    contact.socialLinks = contact.socialLinks.filter(
      link => link._id.toString() !== req.params.id
    );
    
    await contact.save();

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add email
// @route   POST /api/contact/email
// @access  Private
export const addEmail = async (req, res, next) => {
  try {
    const contact = await Contact.findOne();
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    contact.emails.push(req.body);
    await contact.save();

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update email
// @route   PUT /api/contact/email/:id
// @access  Private
export const updateEmail = async (req, res, next) => {
  try {
    const contact = await Contact.findOne();
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const emailIndex = contact.emails.findIndex(
      email => email._id.toString() === req.params.id
    );

    if (emailIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }

    contact.emails[emailIndex] = {
      ...contact.emails[emailIndex]._doc,
      ...req.body
    };
    
    await contact.save();

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete email
// @route   DELETE /api/contact/email/:id
// @access  Private
export const deleteEmail = async (req, res, next) => {
  try {
    const contact = await Contact.findOne();
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    contact.emails = contact.emails.filter(
      email => email._id.toString() !== req.params.id
    );
    
    await contact.save();

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add phone number
// @route   POST /api/contact/phone
// @access  Private
export const addPhone = async (req, res, next) => {
  try {
    const contact = await Contact.findOne();
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    contact.phoneNumbers.push(req.body);
    await contact.save();

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update phone number
// @route   PUT /api/contact/phone/:id
// @access  Private
export const updatePhone = async (req, res, next) => {
  try {
    const contact = await Contact.findOne();
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const phoneIndex = contact.phoneNumbers.findIndex(
      phone => phone._id.toString() === req.params.id
    );

    if (phoneIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Phone number not found'
      });
    }

    contact.phoneNumbers[phoneIndex] = {
      ...contact.phoneNumbers[phoneIndex]._doc,
      ...req.body
    };
    
    await contact.save();

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete phone number
// @route   DELETE /api/contact/phone/:id
// @access  Private
export const deletePhone = async (req, res, next) => {
  try {
    const contact = await Contact.findOne();
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    contact.phoneNumbers = contact.phoneNumbers.filter(
      phone => phone._id.toString() !== req.params.id
    );
    
    await contact.save();

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};