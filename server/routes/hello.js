var express = require('express');
var router = express.Router();

/**
 * @api {get} /hello Respond back name passed as query
 * @apiName Ping Name
 *
 * @apiParam {String} name of the user.
 *
 * @apiSuccess {Boolean} err error if occured.
 * @apiSuccess {String} message status message.
 * @apiSuccess {String} name query name.
 */
router.get('/', function(req, res, next) {
   if (req.query.name) {
      return res.json({
         'err' : false,
         'message' : 'name found in query',
         'name' : req.query.name
      })
   } else {
      return res.json({
         'err' : true,
         'message' : 'no name found.',
         'name' : ''
      })
   }
});

module.exports = router;
