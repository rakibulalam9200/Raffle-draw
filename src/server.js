const express = require('express')
const morgan = require ('morgan')
const cors = require('cors')
const app = express()

/**
 * middleware
 */
app.use([morgan('dev'),cors(),express.json()])


app.get('/health',(_req,res)=>{
  res.status(200).json({message: "Successs"})
})

app.use((_req,_res,next)=>{
  const error = new Error('Resource Not Found')
  error.status = 404;
  next(error)
})

app.use((error,_req,res,_next)=>{
  if(error.status){
    return res.status(error.status).json({
      message: error.message
    })
  }
})


const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})