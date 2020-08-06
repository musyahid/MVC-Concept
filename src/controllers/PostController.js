const { Post, Comment } = require("../models");

const response = {
    status: true,
    message: "",
    data:[]
}

class PostController {

  static async getPost(req, res) {
    const post = await Post.findAll();
    response.data = post;
    response.status = "success";
    res.json(response)
  }
  
  static async savePost(req, res) {
      const {body} = req;

      try { 
        const savePost = await Post.create({
        title:body.title,
        content:body.content,
        tags:body.tags,
        status:body.status,
        author_id:body.author_id
        }) 
        console.log(savePost)
        response.message = "sukses simpan data"
        res.status(201).json(response)
      } catch (error) {
          response.status = false;
          response.message = error.message;
          res.status(400).json(response)
      }
  }

  static async getPostById(req, res) {
    const {id} = req.params;
    const postDetail = await Post.findByPk(id, {
        include: Comment
    })

    try {
        if(!postDetail) throw new Error("Data Not Found")
        response.data = postDetail;
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

module.exports = PostController;
