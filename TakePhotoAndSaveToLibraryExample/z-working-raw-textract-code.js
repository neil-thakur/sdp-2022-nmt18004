import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, Platform, Button } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
//import RNFetchBlob from 'rn-fetch-blob';
import uuid from 'react-native-uuid';
import { RNS3 } from 'react-native-aws3';
import { Textract } from 'aws-sdk';

export default App = () => {

    const doSomething = () => {
        const photoName = 'coke-cherry.jpg'
        
        const params = {
        Document: {
            S3Object: {
            Bucket: 'neil-thakur-test-bucket-2',
            Name: photoName
            },
        }
        };

        AWS.config.update({
            accessKeyId: "***",
            secretAccessKey: "***",
            region: "us-east-1"
          });      

        var textract = new AWS.Textract({region: 'us-east-1'});
        textract.detectDocumentText(params, (err, data) => {
            if (err) {
            console.log('Error analyzing photo:', err);
            } else {
            console.log('Extracted text:', data.Text);
            console.log('Text layout:', data.Blocks);
            }
        });
    }

    return(
        <View>
            <Text>
                Press me!
            </Text>
            <Text>
                Press me!
            </Text>
            <Text>
                Press me!
            </Text>
            <Button title="Do it!" onPress={doSomething}/>
        </View>
    )
  }

