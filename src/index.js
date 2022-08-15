const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Image = require("./models/Image");
const path = require("path");

dotenv.config();
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, './uploads')));


// mongoose connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.log("Error:", err.message);
  });


// multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `uploads/${file.originalname}-${Date.now()}.${ext}`);
    }
});

const upload = multer({ storage });

// cors
const allowDomain = 'http://localhost:5173';
app.use(cors({
    origin: allowDomain,
    methods: ["GET", "POST", "DELETE"],
    credentials: true
}));

app.post("/api/image", upload.single('image'), (req, res) => {
    if(!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        res.send({
            status: "error",
            message: "File type is not supported"
        })
    }else{
        const newImage = {
            name: req.file.originalname,
            path: req.file.path
        }
        Image.create(newImage)
            .then(image => {
                res.send({
                    status: "success",
                    message: "Image uploaded successfully",
                    data: image
                })
            }
        )
    }
})



app.get("/api/images", (req, res) => {
    try{
        Image.find()
            .then(images => {
                res.send({
                    status: "success",
                    data: images
                })
            }
        )
    }catch(err){
        res.send({
            status: "error",
            message: err.message
        })
    }
})

app.delete("/api/image/:id", (req, res) => {
    try{
        Image.findByIdAndDelete(req.params.id)
            .then(image => {
                res.send({
                    status: "success",
                    message: "Image deleted successfully",
                    data: image
                })
            }
        )
    }catch(err){
        res.send({
            status: "error",
            message: err.message
        })
    }
})


app.listen(process.env.PORT || 4000, () => {
    console.log("server started at port 4000");
});