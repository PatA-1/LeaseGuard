const prisma = require("../utils/prisma");

const getProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      where: {
        userId: req.user.id
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createProperty = async (req, res) => {
  try {
    const { name, address } = req.body;

    const property = await prisma.property.create({
      data: {
        name,
        address,
        userId: req.user.id
      }
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id, 10);

    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        userId: req.user.id
      },
      include: {
        rooms: true
      }
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getProperties,
  createProperty,
  getPropertyById
};