import mongodb from 'mongodb';
const { MongoClient, ObjectId } = mongodb

const { URI_TO_CONNECT_MONGODB, DB_NAME, COLLECTION_MUSIC, SUCCESS, SERVER_ERR } = process.env

const connectDbAndRunQueries = async (apiName, req, res) => {

  try {
    const client = await new MongoClient(URI_TO_CONNECT_MONGODB, { useNewUrlParser: true, useUnifiedTopology: true }).connect()
    const collection = client.db(DB_NAME).collection(COLLECTION_MUSIC)

    chooseApiAndSendResponse(apiName, collection, req, res, client)
  } catch (err) {
    console.log('FAILED TO CONNECT DB ...', err)
  }
}

const chooseApiAndSendResponse = (apiName, collection, req, res, client) => {
  switch (apiName) {
    case 'getSongs':
      makeGetSongs(collection, req, res, client)
      break;
    case 'updateRating':
      makeUpdateRating(collection, req, res, client)
      break;
  }
}

const makeGetSongs = async (collection, req, res, client) => {

  let output = { "message": "failed" }
  try {
    const data = await collection.find({}).toArray()
    output = [...data] || []
  } catch (err) {
    console.log("Error occurred .. ", err)
  } finally {
    sendResponseAndCloseConnection(client, output, res)
  }
}

const makeUpdateRating = async (collection, req, res, client) => {
  let output = { message: 'failed' }
  try {
    let { id, rating } = req.params

    rating = (isNaN(parseInt(rating))) ? 1 : parseInt(rating)

    const docs = await collection.updateOne({ _id: ObjectId(id) }, { $set: { rating } })
    output = { message: 'success' }
  } catch (err) {
    console.log('Error occurred', err)
  } finally {
    sendResponseAndCloseConnection(client, output, res)
  }
}

function sendResponseAndCloseConnection(client, output, res) {
  if (output && res) {
    console.log(`========================\nOUTPUT AS RECEIVED AND BEFORE SENDING\n==================\n`, output)
    res.status(SUCCESS).json(output)
  } else {
    res.status(SERVER_ERR).json({ msg: "Internal Server Error" })
  }

  client.close()
}

export { connectDbAndRunQueries }
