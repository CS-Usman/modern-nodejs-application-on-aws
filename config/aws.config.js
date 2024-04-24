import AWS from 'aws-sdk';

// aws sdk provides AWS service classes (client classes ) from which we can create service objects

export const s3Client = new AWS.S3({
    region:'us-east-1'
})

export const ssmClient = new AWS.SSM({
    region:'us-east-1'
})