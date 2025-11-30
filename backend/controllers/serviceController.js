// backend/controllers/serviceController.js
import Service from '../models/Service.js';

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: 1 });
    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Create service
// @route   POST /api/services
// @access  Private
export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private
export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }

    Object.assign(service, req.body);
    await service.save();

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ 
        success: false,
        message: 'Service not found' 
      });
    }

    await service.deleteOne();
    res.json({ 
      success: true,
      message: 'Service deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};