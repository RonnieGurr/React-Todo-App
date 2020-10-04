require('dotenv').config;
const { contentSecurityPolicy } = require('helmet');
const jwt = require('jsonwebtoken');
const Tokens = require('../../models/Tokens');

let expired = false

module.exports = {
    authToken: function authToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token === null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user.email
        next()
    })
    },
    authRefresh: function(req, res, next) {
        const authHeader = req.headers['authorization']
        const refreshToken = authHeader && authHeader.split(' ')[1]
        if (refreshToken === null) res.sendStatus(401)
        Tokens.find({refreshToken: refreshToken}, function(err, docs) {
            if (err) {
                return res.sendStatus(500)
            } else {
                if (docs.length === 0) return res.sendStatus(403)
                
                if ((new Date() - new Date(docs[0].creationTime)) > 1 * 60 * 1000) { //For testing purpose set to 14 days 
                    console.log("\x1b[31m", docs[0].refreshToken + ' has expired!') //Remove token if the token provided has expired and send a 403
                    expired = true
                }
            }
        })

        if (expired) return res.sendStatus(403)

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            const accessToken = jwt.sign({email: user.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10s'})
            res.json({token: accessToken})
        })
    },
    genToken: function genToken(user) {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
    },
    genRefresh: function genRefresh(user) {
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
        const newToken = new Tokens({
            refreshToken: refreshToken
        })
        newToken.save().then(data => {
            console.log('saved')
        }).catch(err => {
            console.log(err)
        })

        return refreshToken

    }
}
