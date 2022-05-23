
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
//sale transcation
app.post("/saletransaction",async(req,res)=>{
    try{

const paymentData=gateway.transaction.sale({
   amount:req.body.amount,
   paymentMethodNounce:req.body.paymentMethodNounce,
   deviceData:req.body.deviceData,
options:{
    submitForSettlement:true
}
},(err,resData)=>{
    if(resData.success){
        return res.status(200).json({"status":success,message:resData.transaction})
}else{
    return res.send({err:err})
}
})
    }catch(error){
        return res.status(500).json({status:failed,Message:error.Message})

    }
})
//partial settlement
app.post("/refundwithcharge",async(req,res)=>{
    try{
const paymentData=gateway.transaction.submitForPartialSettlement(
    "transaction_id",
    "cancellation_fee",
    (err,resData)=>{
        if(resData.success){
            return res.status(200).json({"status":success,message:resData.transaction}) 
        }else{
            return res.send({err:err})      
        }
    }
)
    }catch(error){
        return res.status(500).json({status:failed,Message:error.Message})

    }
})

//full settlement
app.post("/refundwithoutcharge",(req,res)=>{
    try{
        const paymentData=gateway.transaction.submitForSettlement(
            "transaction_id",(err,resData)
        )
    }catch(error){
        return res.status(500).json({status:failed,Message:error.Message})

    }
})

app.listen(process.env.port,()=>{
    console.log(`${process.env.HOST}${process.env.port}`)
})