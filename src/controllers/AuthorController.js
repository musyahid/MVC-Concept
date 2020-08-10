const { Author, Post, Comment } = require("../models");
const multer = require('multer')

const response = {
    status: true,
    message: "",
    data:[]
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    console.log(file)
    cb(null, file.originalname)
  }
})

class AuthorController {

  static async getAuthor(req, res) {
    const author = await Author.findAll();
    response.data = author;
    response.status = "success";
    res.json(response)
  }
  
  static async saveAuthor(req, res) {
    const upload = multer({ storage }).single('foto')
    upload(req, res, async function(err) {
      if (err) {
        return res.send(err)
      }
  
      console.log('file uploaded to server')

       try { 
        const saveAuthor = await Author.create({
        username:req.body.username,
        password:req.body.password,
        salt:req.body.salt,
        email:req.body.email,
        profile:req.body.profile
        }) 
        console.log(saveAuthor)
        response.message = "sukses simpan data"
        res.status(201).json(response)
      } catch (error) {
          response.status = false;
          response.message = error.message;
          res.status(400).json(response)
      }
  
      // SEND FILE TO CLOUDINARY
      const cloudinary = require('cloudinary').v2
      cloudinary.config({
        cloud_name: 'musyahid',
        api_key: '533954739286819',
        api_secret: 'e4htIfFtQVjBTqXci2ukq08rhKs'
      })
  
      const path = req.file.path
      const uniqueFilename = new Date().toISOString()
  
      cloudinary.uploader.upload(
        path,
        { public_id: `Author/${uniqueFilename}`, tags: `Author` }, // directory and tags are optional
        function(err, image) {
          if (err) return res.send(err)
          console.log('file uploaded to Cloudinary')
  
          var fs = require('fs')
          fs.unlinkSync(path)
  
          res.json(image)
        }
      )
    })

     
  }

  static async getAuthorById(req, res) {
      const {id} = req.params;
      const authorDetail = await Author.findByPk(id, {
          include: Post
      })
      try {
          if(!authorDetail) throw new Error("Data Not Found")
          response.data = authorDetail;
          response.status = "success";
          res.json(response)
      } catch (error) {
            response.message = error.message;
            response.data = [];
            response.status = "fail";
            res.status(404).json(response)
      }
  }

  static async updateAuthor(req, res) {
    const {body} = req;
    const {id} = req.params;
    
    try {
      const updateAuthor = await Author.update({
        username:body.username,
        password:body.password,
        salt:body.salt,
        email:body.email,
        profile:body.profile
      }, {
        where: {
          id: id
        }
      })
      if(!updateAuthor) throw new Error("Data Not Found")
      response.status = "success"
      response.message = "data updated"
      res.status(200).json(response)
    } catch (error) {
      response.status = false;
      response.message = error.message;
      res.status(400).json(response)
    }
  }

  static async deleteAuthor(req, res) {
    const {id} = req.params;
    const deleteAuthor = await Author.destroy({
      where: {
        id: id
      }
    })

    try {
      if(deleteAuthor === 0) throw new Error("Data Not Found")
      response.status = "success";
      response.message = "Data Deleted";
      res.json(response)
    } catch (error) {
      response.message = error.message;
      response.data = [];
      response.status = "fail";
      res.status(404).json(response)
    }
  }

}

module.exports = AuthorController;
