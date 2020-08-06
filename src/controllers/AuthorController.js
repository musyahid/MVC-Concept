const { Author, Post, Comment } = require("../models");

const response = {
    status: true,
    message: "",
    data:[]
}

class AuthorController {

  static async getAuthor(req, res) {
    const author = await Author.findAll();
    response.data = author;
    response.status = "success";
    res.json(response)
  }
  
  static async saveAuthor(req, res) {
      const {body} = req;

      try { 
        const saveAuthor = await Author.create({
        username:body.username,
        password:body.password,
        salt:body.salt,
        email:body.email,
        profile:body.profile
        }) 
        console.log(saveAuthor)
        response.message = "sukses simpan data"
        res.status(201).json(response)
      } catch (error) {
          response.status = false;
          response.message = error.message;
          res.status(400).json(response)
      }
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

}

module.exports = AuthorController;
