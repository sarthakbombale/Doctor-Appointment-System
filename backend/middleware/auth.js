const jwt = require('jsonwebtoken')
require('dotenv').config()

function auth(req, res, next){

console.log(req.header.authorization,"*******")
token = req.headers.authorization
if(token.startsWith('Bearer')){
    console.log(token,"-----------token--------")
    token = token.split(' ')[1]
    console.log(token, "after renoving bearer")

    decoded = jwt.decode(token, process.env.SECRET_KEY)
    console.log("----decoded-----", decoded)
    req.user = decoded
    next()
}else{
    res.status(400).send({msg:"auth hearer misisng"})
}
}
module.exports = {auth}