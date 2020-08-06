const { Comment } = require("../models");

const response = {
    status: true,
    message: "",
    data:[]
}

class CommentController {

  static async getComment(req, res) {
    const comment = await Comment.findAll();
    response.data = comment;
    response.status = "success";
    res.json(response)
  }
  
  static async saveComment(req, res) {
      const {body} = req;

      try { 
        const saveComment = await Comment.create({
        content:body.content,
        status:body.status,
        author_id:body.author_id,
        email:body.email,
        url:body.url,
        post_id:body.post_id
        }) 
        console.log(saveComment)
        response.message = "sukses simpan data"
        res.status(201).json(response)
      } catch (error) {
          response.status = false;
          response.message = error.message;
          res.status(400).json(response)
      }
  }
}


module.exports = CommentController;
