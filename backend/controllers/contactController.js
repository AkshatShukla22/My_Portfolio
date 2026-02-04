// backend/controllers/contactController.js
import Contact from '../models/Contact.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Submit contact form
// @route   POST /api/contact/submit
// @access  Public
export const submitContactForm = async (req, res, next) => {
  try {
    console.log('📧 Contact form submission received:', req.body);
    
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
      console.log('❌ Validation failed - missing fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Get contact info to find primary email
    const contact = await Contact.findOne();
    console.log('📋 Contact data found:', contact ? 'Yes' : 'No');
    
    if (!contact || !contact.emails || contact.emails.length === 0) {
      console.log('❌ No contact email configured');
      return res.status(500).json({
        success: false,
        message: 'Contact email not configured. Please contact the administrator.'
      });
    }

    // Find primary email or use first email
    const primaryEmail = contact.emails.find(e => e.isPrimary) || contact.emails[0];
    console.log('📧 Sending to:', primaryEmail.email);

    // Create email HTML template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
          }
          .header {
            background-color: #4a5568;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .field {
            margin-bottom: 20px;
          }
          .label {
            font-weight: bold;
            color: #4a5568;
            margin-bottom: 5px;
          }
          .value {
            padding: 10px;
            background-color: #f7fafc;
            border-left: 3px solid #4299e1;
            border-radius: 4px;
          }
          .message-box {
            padding: 15px;
            background-color: #f7fafc;
            border-radius: 4px;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #718096;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">From:</div>
              <div class="value">${name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${email}</div>
            </div>
            
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${subject}</div>
            </div>
            
            <div class="field">
              <div class="label">Message:</div>
              <div class="message-box">${message}</div>
            </div>
            
            <div class="footer">
              This message was sent from your portfolio contact form.
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email with try-catch
    try {
      await sendEmail({
        to: primaryEmail.email,
        subject: `Portfolio Contact: ${subject}`,
        html: emailHtml,
        replyTo: email,
      });
      
      console.log('✅ Email sent successfully');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      throw new Error('Failed to send email: ' + emailError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('❌ Contact form submission error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send message. Please try again later.'
    });
  }
};

// ... rest of the controller functions remain the same

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

// @desc    Submit contact form
// @route   POST /api/contact/submit
// @access  Public
export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Get contact info to find primary email
    const contact = await Contact.findOne();
    
    if (!contact || !contact.emails || contact.emails.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Contact email not configured'
      });
    }

    // Find primary email or use first email
    const primaryEmail = contact.emails.find(e => e.isPrimary) || contact.emails[0];

    // Create email HTML template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
          }
          .header {
            background-color: #4a5568;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .field {
            margin-bottom: 20px;
          }
          .label {
            font-weight: bold;
            color: #4a5568;
            margin-bottom: 5px;
          }
          .value {
            padding: 10px;
            background-color: #f7fafc;
            border-left: 3px solid #4299e1;
            border-radius: 4px;
          }
          .message-box {
            padding: 15px;
            background-color: #f7fafc;
            border-radius: 4px;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #718096;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">From:</div>
              <div class="value">${name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${email}</div>
            </div>
            
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${subject}</div>
            </div>
            
            <div class="field">
              <div class="label">Message:</div>
              <div class="message-box">${message}</div>
            </div>
            
            <div class="footer">
              This message was sent from your portfolio contact form.
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    await sendEmail({
      to: primaryEmail.email,
      subject: `Portfolio Contact: ${subject}`,
      html: emailHtml,
      replyTo: email, // This allows you to reply directly to the sender
    });

    res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
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