const Asset = require("../models/Asset");
const createAuditLog = require("../utils/createAuditLog");

// Add Asset
const addAsset = async (req, res) => {
  try {
    const { assetName, assetType, description, value } = req.body;

    const asset = await Asset.create({
      user: req.user.id,
      assetName,
      assetType,
      description,
      value,
    });

    await createAuditLog({
      userId: req.user.id,
      action: "Asset Added",
      category: "Asset Management",
      description: `Added asset: ${asset.assetName} (${asset.assetType || "General"})`,
      status: "success",
    });

    res.status(201).json({
      message: "Asset added successfully",
      asset,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not create the asset.",
    });
  }
};

// Get All Assets
const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find({
      user: req.user.id,
    });

    res.status(200).json({
      assets,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not load assets.",
    });
  }
};

// Update Asset
const updateAsset = async (req, res) => {
  try {
    const updates = {};
    for (const field of ["assetName", "assetType", "description", "value"]) {
      if (Object.hasOwn(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    const asset = await Asset.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    await createAuditLog({
      userId: req.user.id,
      action: "Asset Updated",
      category: "Asset Management",
      description: `Updated asset: ${asset.assetName}`,
      status: "success",
    });

    res.status(200).json({
      message: "Asset updated successfully",
      asset,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not update the asset.",
    });
  }
};

// Delete Asset
const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (asset) {
      await createAuditLog({
        userId: req.user.id,
        action: "Asset Removed",
        category: "Asset Management",
        description: `Removed asset: ${asset.assetName}`,
        status: "success",
      });
    }

    res.status(200).json({
      message: "Asset deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete the asset.",
    });
  }
};

module.exports = {
  addAsset,
  getAssets,
  updateAsset,
  deleteAsset,
};
