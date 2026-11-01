const detectFileType = (buffer) => {
  if (!Buffer.isBuffer(buffer)) {
    return null;
  }

  if (buffer.subarray(0, 5).toString("ascii") === "%PDF-") {
    return { mime: "application/pdf", extension: "pdf" };
  }

  if (
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    return { mime: "image/png", extension: "png" };
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: "image/jpeg", extension: "jpg" };
  }

  return null;
};

module.exports = detectFileType;
