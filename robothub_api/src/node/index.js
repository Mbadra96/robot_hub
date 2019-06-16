const express = require('express');
const app = express();
const port = 3000
const fs = require('fs')
const rosnodejs = require('rosnodejs')
const src = '/home/badra/ros_ws/Web_ws/src/robothub_api/src/node/data.json'

let topicsdata=[]
rosnodejs.initNode('/my_node');
const nh = rosnodejs.nh;
topics = JSON.parse(fs.readFileSync(src,'utf8')).topics
topics.forEach(element => {
  if(element.name === "/rosout" || element.name ==='/rosout_agg'){
    console.log(`Logs in ${element.name}`);
    
}else{
  console.log(`Subscribed to ${element.name}`)
  topicsdata.push({name:element.name,data:''})
  app.get(`${element.name}`,(req,res)=>{
    let el = topicsdata.find((el)=>{
      return el.name===`${element.name}`
    })
    res.json(el.data)
  })
  let sub = nh.subscribe(element.name, element.type,(msg)=>{
    let el = topicsdata.find((el)=>{
      return el.name===`${element.name}`
    })
    el.data = msg
    console.log(`new message at ${element.name}`);
    
  });
}
});


app.get('/',(req,res)=>{
  res.json(topics)
})
app.get('/stop',(req,res)=>{
  res.send("OK!!")
  process.exit(1)
})

app.listen(port,()=>{
  console.log("Listening on port 3000");
  
})