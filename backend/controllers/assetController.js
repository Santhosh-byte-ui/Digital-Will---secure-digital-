const Asset = require("../models/Asset");
const AuditLog = require("../models/AuditLog");

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

    await AuditLog.create({
      user: req.user.id,
      action: "CREATE",
      module: "ASSET",
      details: `Created asset: ${asset.assetName}`,
    });

    res.status(201).json({
      message: "Asset added successfully",
      asset,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
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
      message: error.message,
    });
  }
};

// Update Asset
const updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    );

    await AuditLog.create({
      user: req.user.id,
      action: "UPDATE",
      module: "ASSET",
      details: `Updated asset: ${asset.assetName}`,
    });

    res.status(200).json({
      message: "Asset updated successfully",
      asset,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
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
      await AuditLog.create({
        user: req.user.id,
        action: "DELETE",
        module: "ASSET",
        details: `Deleted asset: ${asset.assetName}`,
      });
    }

    res.status(200).json({
      message: "Asset deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addAsset,
  getAssets,
  updateAsset,
  deleteAsset,
};