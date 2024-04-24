import {s3Client,ssmClient} from "../config/aws.config.js"

export const test = async(req,res,next)=>{
    res.send('Hello World!');
}