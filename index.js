const express = require('express')
const app = express()
const db = require('cyclic-dynamodb')
const https = require('https');
const slackEndPoint = "https://hooks.slack.com/services/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";

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
// var options = {
//   dotfiles: 'ignore',
//   etag: false,
//   extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
//   index: ['index.html'],
//   maxAge: '1m',
//   redirect: false
// }
// app.use(express.static('public', options))
// #############################################################################

// Create or Update an item
app.post('/zoom', async (req, res) => {
  console.log(req.body)
  
    const event = req.body.event;
  const accountId = req.body.payload.account_id;
  console.log(`event ${event} accountId ${accountId}`);
  const result = "OK";
  res.json(result).end();
  
  let status = "busy";
  if(event == "meeting.ended" ){
	status = "available";
  }
  sendRequest({"text":status});
  
  
  
})


sendRequest = ( data => {

  
    const options = {
      hostname: slackEndPoint,
      port: 443,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const body = [];

    const req = https.request(options, res => {
      res.on('data', d=> {
        body.push(data);
      });
      res.on('end');
    });
    
    req.on('error', e => {
      reject(e);
    });
    
    req.write(JSON.stringify(data));
    req.end();


})

// Delete an item
/*app.delete('/:col/:key', async (req, res) => {
  const col = req.params.col
  const key = req.params.key
  console.log(`from collection: ${col} delete key: ${key} with params ${JSON.stringify(req.params)}`)
  const item = await db.collection(col).delete(key)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Get a single item
app.get('/:col/:key', async (req, res) => {
  const col = req.params.col
  const key = req.params.key
  console.log(`from collection: ${col} get key: ${key} with params ${JSON.stringify(req.params)}`)
  const item = await db.collection(col).get(key)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Get a full listing
app.get('/:col', async (req, res) => {
  const col = req.params.col
  console.log(`list collection: ${col} with params: ${JSON.stringify(req.params)}`)
  const items = await db.collection(col).list()
  console.log(JSON.stringify(items, null, 2))
  res.json(items).end()
})*/
// Catch all handler for all other request.
app.use('*', (req, res) => {
  res.json({ msg: 'no route handler found' }).end()
})

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
})
