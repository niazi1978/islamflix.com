const express = require("express");
const multer = require("multer");
const Video = require("../module/Video");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.fields([{ name: "video" }, { name: "thumbnail" }]), async (req, res) => {
  const { title } = req.body;
  const videoUrl = `/uploads/${req.files.video[0].filename}`;
  const thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;

  const video = new Video({ title, thumbnail, videoUrl });
  await video.save();

  res.json({ message: "Video Uploaded!", video });
});

router.get("/videos", async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});

router.get("/watch/:id", async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: "Video not found" });

  video.views += 1;
  await video.save();

  res.json(video);
});

module.exports = router;
