const mime = require("mime");
const fs = require("fs");

const mimeTypes = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
};

const uploadImage = async (pic, fileName) => {
  return new Promise((resolve, reject) => {
    // to declare some path to store your converted image
    var matches = pic.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
      response = {};
    if (matches.length !== 3) {
      return new Error("Invalid input string");
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], "base64");
    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    let extension = mime.getExtension(type);
    let vFileName = fileName + "." + extension;
    let filepath = "./uploads/" + vFileName;
    fs.writeFileSync(filepath, imageBuffer, "utf8");
    resolve(filepath);
  });
};

const imageConvert = (path) => {
  const extension = path.split(".").pop();
  const mimeType = mimeTypes[extension] || "application/octet-stream";
  const prefix = `data:${mimeType};base64,`;
  const contents = fs.readFileSync(path, { encoding: "base64" });
  return prefix + contents;
  //   const contents = fs.readFileSync(path, {
  //     encoding: "base64",
  //   });
  //   return contents;
};

module.exports = {
  uploadImage,
  imageConvert,
};
