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

  static async getCommentById(req, res) {
    const {id} = req.params;
    const commentDetail = await Comment.findByPk(id)
    try {
        if(!commentDetail) throw new Error("Data Not Found")
        response.data = commentDetail;
        response.status = "success";
        res.json(response)
    } catch (error) {
          response.message = error.message;
          response.data = [];
          response.status = "fail";
          res.status(404).json(response)
    }
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

  static async updateComment(req, res) {
    const {body} = req;
    const {id} = req.params;
    
    try {
      const updateComment = await Comment.update({
          content:body.content,
          status:body.status,
          author_id:body.author_id,
          email:body.email,
          url:body.url,
          post_id:body.post_id
      }, {
        where: {
          id: id
        }
      })
      if(!updateComment) throw new Error("Data Not Found")
      response.status = "success"
      response.message = "data updated"
      res.status(200).json(response)
    } catch (error) {
      response.status = false;
      response.message = error.message;
      res.status(400).json(response)
    }
  }

  static async deleteComment(req, res) {
    const {id} = req.params;
    const commentAuthor = await Comment.destroy({
      where: {
        id: id
      }
    })

    try {
      if(commentAuthor === 0) throw new Error("Data Not Found")
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


module.exports = CommentController;
