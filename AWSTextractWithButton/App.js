import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableHighlight, ScrollView } from 'react-native';
import React from 'react';
import { Amplify } from 'aws-amplify'
import awsconfig from './src/aws-exports'

Amplify.configure(awsconfig)

export default function App() {

  let [textractDump, setTextractDump] = React.useState('')

  const doSomething = () => {
    
    var AWS = require('aws-sdk');

    var setCredentials = AWS.config.update({
      accessKeyId: "***",
      secretAccessKey: "***",
      region: "us-east-1"
    });

    var textract = new AWS.Textract({ region: 'us-east-1' });

    const params = {
      Document: {
        S3Object: {
          Bucket: 'neil-thakur-test-bucket',
          //Name: 'Simple Table.png',
          Name: 'S7 Class Schedule.png'
        },
      }
      //FeatureTypes: ['TABLES'],
    };
    
    textract.detectDocumentText(params, function(err, data) {
      if (err) {
        console.log('Error', err);
        setTextractDump(err.toString())
      } else {
        console.log('Text detected:', data.Blocks.map(block => block.Text).join('\n\n'));
        setTextractDump(data.Blocks.map(block => block.Text).join('\n\n'));
      }
    });
  }

  return (
    <View style = {styles.container}>
      
      <View style={{height: '25%', borderColor: 'black', borderBottomWidth: 5, borderTopWidth: 5, borderLeftWidth: 5, borderRightWidth: 5}}>
        <Text style={styles.title}>nmt18004 v1.0.0</Text>
        <Text></Text>
        <Text style={{fontSize: 18}}>
          <Text style={{fontWeight: "bold"}}>Example: </Text>
          <Text>Using Textract API on object in S3</Text>
        </Text>
        <StatusBar style="auto" />
        <Text></Text>
        <TouchableHighlight onPress={doSomething} style ={{alignItems: 'center'}}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Use Textract API</Text>
          </View>
        </TouchableHighlight>
      </View>

      <View style={{height: '10%'}}>

      </View>

      <View style={{height: '25%', width: '75%'}}>
        <ScrollView style={{borderColor: 'black', borderBottomWidth: 5, borderTopWidth: 5, borderLeftWidth: 5, borderRightWidth: 5}}>
          <Text style={{textAlign: 'center'}}>{textractDump}</Text>
        </ScrollView>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  title: {
    fontSize: 35,
    color: '#8f00ff',
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center'
  },
  button: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#0645AD',
    width: '40%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff'
  }
});
