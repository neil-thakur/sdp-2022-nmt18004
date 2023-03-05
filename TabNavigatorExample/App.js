import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import { RNS3 } from 'react-native-aws3';


const Tab = createBottomTabNavigator();

const MealHistoryScreen = ({ textractDump, setTextractDump }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ScrollView style={{borderColor: 'black', borderBottomWidth: 5, borderTopWidth: 5, borderLeftWidth: 5, borderRightWidth: 5}}>
        <Text style={{textAlign: 'center'}}>{textractDump}</Text>
      </ScrollView>
    </View>
  );
};

const ProfileScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
};

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Camera style={{ flex: 0.75, width: '80%'}}  type={Camera.Constants.Type.back}/>
    </View>
  );
};

const ViewExampleScreen = () => {
  return(
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', borderColor:'blue', borderWidth:1 }}>
        <Text>dummy place holder text top view</Text>
      </View>
      <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', borderColor:'purple', borderWidth:1 }}>
        <Text>dummy place holder text bottom view</Text>
      </View>
    </View>
  );
}

const CameraWithButtonsScreen = ({ textractDump, setTextractDump }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [imageUri, setImageUri] = useState(null);
  const [photoName, setPhotoName] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const NEILaccessKeyId = '***'
  const NEILsecretAccessKey = "***";

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
        throw new Error("FAILURE: Failed to upload image to S3!");
      }
      else {
        console.log(
          "SUCCESS: Successfully uploaded image to S3! \n\tS3 Bucket URL: ",
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
        setTextractDump(data.Blocks.map(block => block.Text).join('\n\n'));
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
      setPhotoName(null);
    }
  }

  const handleInputChange = (text) => {
    console.log(text);
    setPhotoName(text);
  };

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

  return(
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {imageUri === null &&
      <Camera 
        style={{ flex: 1, width: '80%', borderColor:'red', borderWidth:5 }}  
        ref={ref => setCamera(ref)}
        type={type}
      />
      }

      {imageUri && 
      <View style={{ flex: 1, width: '95%', alignItems: 'center', justifyContent: 'center', borderColor:'blue', borderWidth:1, backgroundColor:'grey' }}>
        <Image style={{ flex: 1, height: "75%", width:"75%", resizeMode: 'contain' }} source={{ uri: imageUri }} />
      </View>
      }

      <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', borderColor:'#4E4C67', borderWidth:4 }}>
        {imageUri === null &&
          <TouchableOpacity
            style={{
              backgroundColor: '#457EAC',
              textAlign: 'center',
              alignSelf: "center"
            }}
            onPress={takePicture}>
            <Text style={{ fontSize: 25, color: 'white', textAlign: 'center' }}> Scan Nutrition Label </Text>
          </TouchableOpacity>
        }
        <Text></Text>
        {imageUri === null &&  
          <TouchableOpacity
            style={{
              backgroundColor: '#C2AFF0',
              textAlign: 'center',
              alignSelf: "center"
            }}
            onPress={flipCamera}>
            <Text style={{ fontSize: 20, color: 'white', textAlign: 'center'}}> Flip Camera </Text>
          </TouchableOpacity>
        }
        <Text></Text>
        {imageUri && 
          <TouchableOpacity
            style={{
              backgroundColor: '#48AD59',
            }}
            onPress={savePicture}
          >
            <Text style={{ fontSize: 20, color: 'white', textAlign: 'center'}}>Save</Text>
          </TouchableOpacity>
        }
        <Text></Text>
        {imageUri && 
          <TouchableOpacity
            style={{
              backgroundColor: '#E73323',
            }}
            onPress={() => {setImageUri(null)}}
          >
            <Text style={{ fontSize: 20, color: 'white', textAlign: 'center'}}>Cancel</Text>
          </TouchableOpacity>
        }
        <Text></Text>
        {imageUri && photoName === null &&
          <TextInput
            style={{ borderColor: 'purple', backgroundColor: '#DCD6F7', width: 227, height: 40}}
            value={photoName}
            onSubmitEditing={(value) => handleInputChange(value.nativeEvent.text)}
            placeholder={"Enter 'filename.jpg'"}
            placeholderTextColor='black'
            textAlign="center"
          />
        }
      </View>
    </View>
  );
}

export default App = () => {
  const [textractDump, setTextractDump] = React.useState('')

  return (
    <NavigationContainer>
      <Tab.Navigator>
        {/* <Tab.Screen name="Camera w/ Button" component={CameraWithButtonsScreen}  /> */}
        <Tab.Screen name="Camera w/ Button">
          {(props) => <CameraWithButtonsScreen textractDump={textractDump} setTextractDump={setTextractDump} />}
        </Tab.Screen> 
        {/* <Tab.Screen name="Meal History" component={MealHistoryScreen} initialParams={{textractDump: textractDump}} /> */}
        <Tab.Screen name="Meal History">
          {(props) => <MealHistoryScreen textractDump={textractDump} setTextractDump={setTextractDump} />}
        </Tab.Screen>
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="View Example" component={ViewExampleScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};


