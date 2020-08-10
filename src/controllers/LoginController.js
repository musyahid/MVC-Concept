 const { Users } = require("../models");
const e = require("express");

const response = {
    status: true,
    message: "",
    data:[]
}

class LoginController {

  
  static async getUser(req, res) {
      const {body} = req;
      try { 
        return await Users.findOne({ 
            where: 
                {
                    username:body.username,
                    password:body.password,
                }
        }) 
      } catch (error) {
          response.status = false;
          response.message = error.message;
          res.status(400).json(response)
      }
  }

}

module.exports = LoginController;
