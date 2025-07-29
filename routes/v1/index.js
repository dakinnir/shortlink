const router = require('express').Router()

router.get('/', (request, response) => {
    response.status(200).send({
        message: 'Welcome to ShortLink'
    })
})

module.exports = router