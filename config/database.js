if (process.env.NODE_ENV === 'production') {
    module.exports = { mongoURI: 'mongodb://ebaskom:kemayoran00@ds247327.mlab.com:47327/ebaskom'}
} else {
    module.exports = { mongoURI: 'mongodb://localhost/mysupport-dev'}
}