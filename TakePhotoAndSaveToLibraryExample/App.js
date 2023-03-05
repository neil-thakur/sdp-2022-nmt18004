import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, Platform, TextInput } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
//import RNFetchBlob from 'rn-fetch-blob';
import uuid from 'react-native-uuid';
import { RNS3 } from 'react-native-aws3';
import { Textract } from 'aws-sdk';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [imageUri, setImageUri] = useState(null);
  //const [photoName, setPhotoName] = useState(null);

  const photoName = 'LED_remote.jpg';
  const NEILaccessKeyId = "***";
  const NEILsecretAccessKey = "***";

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const uploadToS3 = async (tmpURI) => {
    const options = {
      /* keyPrefix: 'uploads/', */
      bucket: 'neil-thakur-test-bucket-2',
      region: 'us-east-1',
      accessKey: NEILaccessKeyId,
      secretKey: NEILsecretAccessKey,
      successActionStatus: 201,
    };
    const file = {
      uri: tmpURI,
      name: photoName,
      type: 'image/jpeg',
    };
  
    const response = await RNS3.put(file, options).then(response => {
      if (response.status !== 201) {
        throw new Error("FAILURE: failed to upload image to S3!");
      }
      else {
        console.log(
          "SUCCESS: successfully uploaded image to S3! \n\tS3 Bucket URL: ",
          response.body.postResponse.location
        );
      }
      })
      .catch(error => {console.log(error)})
      .progress((e) => console.log(e.loaded / e.total)
    );

    return true;
  };

  const getTextractAnalysis = async () => {
    //hard code AWS credentials
    AWS.config.update({
      accessKeyId: NEILaccessKeyId,
      secretAccessKey: NEILsecretAccessKey,
      region: "us-east-1"
    }); 

    const params = {
      Document: {
        S3Object: {
          Bucket: 'neil-thakur-test-bucket-2',
          Name: photoName
        },
      }
    };

    var textract = new AWS.Textract({region: 'us-east-1'});
    const response = await textract.detectDocumentText(params, (err, data) => {
      if (err) {
        console.log('FAILURE: Error analyzing photo:', err);
      } else {
        /* console.log('Extracted text:', data.Text); */
        /* console.log('Text layout:', data.Blocks); */
        console.log('SUCCESS: Text detected:', data.Blocks.map(block => block.Text).join('\n\n'));
      }
    });
    return true;
  }

  const takePicture = async () => {
    if (camera) {
      const { uri } = await camera.takePictureAsync({ quality: 0.75 });
      setImageUri(uri);
    }
  };

  const savePicture = async () => {
    if(imageUri !== null)
    {
      MediaLibrary.saveToLibraryAsync(imageUri);
      console.log('SUCCESS: Photo saved to library. \n\tFile URI: ', imageUri);
      await uploadToS3(imageUri);
      console.log('SUCCESS: Photo uploaded to S3!')
      await getTextractAnalysis();
      console.log('SUCCESS: Recieved AWS Textract document analysis of S3 object!')
      setImageUri(null);
    }
  }

  const flipCamera = async () => {
    setType(
      type === Camera.Constants.Type.back
      ? Camera.Constants.Type.front
      : Camera.Constants.Type.back
    );
  }

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} ref={ref => setCamera(ref)} type={type}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              left: '25%',
              display: 'inline-block',
              top: '85%',
              backgroundColor: '#457EAC',
              textAlign: 'center',
              alignSelf: "center"
            }}
            onPress={takePicture}>
            <Text style={{ fontSize: 25, color: 'white', textAlign: 'center' }}> Scan Nutrition Label </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              position: 'absolute',
              left: '38%',
              top: '90%',
              backgroundColor: '#C2AFF0',
            }}
            onPress={flipCamera}>
            <Text style={{ fontSize: 20, color: 'white', textAlign: 'center'}}> Flip Camera </Text>
          </TouchableOpacity>
        </View>
      </Camera>
      {imageUri && <Image style={{ flex: 1 }} source={{ uri: imageUri }} />}
      {imageUri && 
        <TouchableOpacity
          style={{
          position: 'absolute',
          left: '45%',
          top: '90%',
          backgroundColor: '#48AD59',}}
          onPress={savePicture}
        >
          <Text style={{ fontSize: 20, color: 'white', textAlign: 'center'}}>Save</Text>
        </TouchableOpacity>
      }
      {imageUri && 
        <TouchableOpacity
          style={{
          position: 'absolute',
          left: '43%',
          top: '93%',
          backgroundColor: '#E73323',}}
          onPress={() => {setImageUri(null)}}
        >
          <Text style={{ fontSize: 20, color: 'white', textAlign: 'center'}}>Cancel</Text>
        </TouchableOpacity>
      }
      
    </View>
  );
}
