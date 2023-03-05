import React, { useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import RNS3 from 'react-native-aws3';
import AWS from 'aws-sdk';

AWS.config.update({
  region: 'your-region',
  credentials: {
    accessKeyId: 'your-access-key',
    secretAccessKey: 'your-secret-key',
  },
});

export default function MyComponent() {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [extractedText, setExtractedText] = useState('');

  const handleTakePhoto = async () => {
    // upload photo to S3
    const file = {
      uri: 'file:///path/to/photo.jpg',
      name: 'photo.jpg',
      type: 'image/jpg',
    };
    const options = {
      bucket: 'your-bucket',
      key: 'photos/photo.jpg',
      contentType: 'image/jpg',
    };
    const response = await RNS3.put(file, options);
    const photoUrl = response.body.postResponse.location;
    setPhotoUrl(photoUrl);

    // wait for photo to be available on S3 before calling Textract
    const s3 = new AWS.S3();
    const params = {
      Bucket: 'your-bucket',
      Key: 'photos/photo.jpg',
    };
    const waitForPhoto = () => {
      return new Promise((resolve, reject) => {
        s3.headObject(params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    };
    await waitForPhoto();

    // call Textract to extract text from image
    const textract = new AWS.Textract();
    const textractParams = {
      Document: {
        S3Object: {
          Bucket: 'your-bucket',
          Name: 'photos/photo.jpg',
        },
      },
    };
    textract.detectDocumentText(textractParams, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(data);
        setExtractedText(data.Blocks.map((block) => block.Text).join('\n'));
      }
    });
  };

  return (
    <View>
      <Button title="Take photo" onPress={handleTakePhoto} />
      {photoUrl && <Image source={{ uri: photoUrl }} style={{ width: 300, height: 300 }} />}
      {extractedText && <Text>{extractedText}</Text>}
    </View>
  );
}
