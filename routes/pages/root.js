const express = require('express')
const router = express.Router()

router.get('/', (req, res) => res.redirect(req.user?.isAdmin ? '/admin/restaurants' : '/restaurants'))

module.exports = router
