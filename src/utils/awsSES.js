import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } from '../config/config.js';

// Set up AWS SES configuration
const config = {
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
};

// Create a new SES object
const client = new SESClient(config);

// Example usage

const emailParams = {
  // SendEmailRequest
  Source: String, // required
  Destination: {
    // Destination
    ToAddresses: [
      // AddressList
      String,
    ],
    CcAddresses: [String],
    BccAddresses: [String],
  },
  Message: {
    // Message
    Subject: {
      // Content
      Data: String, // required
      Charset: String,
    },
    Body: {
      // Body
      Text: {
        Data: String, // required
        Charset: String,
      },
      Html: {
        Data: String, // required
        Charset: String,
      },
    },
  },
  ReplyToAddresses: [String],
  ReturnPath: String,
  SourceArn: String,
  ReturnPathArn: String,
  Tags: [
    // MessageTagList
    {
      // MessageTag
      Name: String, // required
      Value: String, // required
    },
  ],
  ConfigurationSetName: String,
};

const SendEmail = new SendEmailCommand(emailParams);
const response = await client.send(SendEmail);

console.log(response);

export default SendEmail;
