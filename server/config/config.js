/**
 * Config var for app
**/
module.exports = {
	mongoDBURI: process.env.MONGOLAB_URI || 'mongodb://highfiveuser:h5password!@ds141401.mlab.com:41401/highfive',
  // mongoDBUrl: process.env.MONGODB_URL || process.env.MONGOLAB_URI  || 'mongodb://localhost:27017/webstormtroopers',
  // port: process.env.PORT || 4941,
  // secret: process.env.SECRET || 'mysecret'
};
