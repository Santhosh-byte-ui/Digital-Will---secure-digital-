const PDFDocument = require("pdfkit");
const Will = require("../models/Will");

const downloadWillPDF = async (req, res) => {
  try {
    const will = await Will.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user.id },
        {
          "beneficiaries.email": req.user.email,
          deathVerificationStatus: "Verified",
        },
      ],
    });

    if (!will) {
      return res.status(404).json({
        message: "Will not found",
      });
    }

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${will.title.replace(/[^a-zA-Z0-9._-]/g, "_") || "will"}.pdf"`,
    );

    doc.pipe(res);

    doc.fontSize(22).text("DIGITAL WILL", {
      align: "center",
    });

    doc.moveDown();

    doc.text(`Title: ${will.title}`);
    doc.text(`Status: ${will.status}`);
    doc.text(`Verification: ${will.deathVerificationStatus}`);

    doc.moveDown();

    doc.fontSize(18).text("Assets");

    will.assets.forEach((asset) => {
      doc.text(`• ${asset.assetName} | ${asset.assetType} | ₹${asset.value}`);
    });

    doc.moveDown();

    doc.fontSize(18).text("Beneficiaries");

    will.beneficiaries.forEach((person) => {
      doc.text(
        `• ${person.name} (${person.email}) - ${person.sharePercentage}%`,
      );
    });

    doc.moveDown();

    doc.fontSize(18).text("Instructions");

    doc.text(will.instructions);

    doc.end();
  } catch (error) {
    console.error(`PDF generation failed (${error.name}).`);
    res.status(500).json({
      message: "Could not generate the will PDF.",
    });
  }
};

module.exports = {
  downloadWillPDF,
};
