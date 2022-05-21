
const express=require('express')
const braintree=require('braintree')

const app=express()
require('dotenv').config()
const port=process.env.port || 7000;


const config={
    environment: braintree.Environment.Sandbox,
    merchantId:process.env.MERCHANT_ID,
    publicKey:process.env.PUBLIC_KEY,
    privateKey:process.env.PRIVATE_KEY
}

const gateway=new braintree.BraintreeGateway(config)

app.get('/tokengeneration',async(req,res)=>{
try{
gateway.clientToken.generate({},(err,resData)=>{
if(err){
    return res.send({err:err})
}else{
    console.log(resData)
   // process.exit(1)
    return res.status(200).json({ 'status': 'success', "result": resData })
}
})
}catch(error){
    return res.status(500).json({status:failed,Message:error.Message})
}
})

app.listen(process.env.port,()=>{
    console.log(`${process.env.HOST}${process.env.port}`)
})