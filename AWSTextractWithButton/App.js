import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableHighlight, ScrollView } from 'react-native';
import { Textract } from 'aws-sdk/clients/textract';

export default function App() {

  const doSomething = () => {
    
    var AWS = require('aws-sdk');

    var setCredentials = AWS.config.update({
      accessKeyId: "AKIAQWTE7QBLRKHRBT6W",
      secretAccessKey: "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",
      region: "us-east-1"
    });

    var textract = new AWS.Textract({ region: 'us-east-1' });
    
    const params = {
      Document: {
        S3Object: {
          Bucket: 'neil-thakur-test-bucket',
          Name: 'S7 Class Schedule.png',
        },
      }
      //FeatureTypes: ['TABLES', 'FORMS'],
    };
    
    textract.detectDocumentText(params, function(err, data) {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('Text detected:', data.Blocks.map(block => block.Text).join('\n'));
      }
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>nmt18004 v1.0.0</Text>
      <Text style={{fontSize: 18}}>
        <Text style={{fontWeight: "bold"}}>Example: </Text>
        <Text>Using Textract API on object in S3</Text>
      </Text>
      <StatusBar style="auto" />
      <TouchableHighlight onPress={doSomething}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Use Textract API</Text>
        </View>
      </TouchableHighlight>
      <Text>Output is pasted below</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 35,
    color: '#8f00ff',
    fontWeight: 'bold'
  },
  button: {
    padding: 10,
    marginVertical: 15,
    backgroundColor: '#0645AD'
  },
  buttonText: {
    color: '#fff'
  }
});
