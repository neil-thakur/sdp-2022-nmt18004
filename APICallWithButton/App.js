import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default function App() {
  
  /* this defines state variables and hooks */
  let [calories, setCalories] = React.useState('')
  let [caloriesGoal, setCaloriesGoal] = React.useState('')
  let [carbs, setCarbs] = React.useState('')
  let [carbsGoal, setCarbsGoal] = React.useState('')
  let [fats, setFats] = React.useState('')
  let [fatsGoal, setFatsGoal] = React.useState('')
  let [protein, setProtein] = React.useState('')
  let [proteinGoal, setProteinGoal] = React.useState('')
  
  /* API request to AWS using fetch */
  const nodeJS_NativeAPICall = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    /* AWS API endpoint */
    fetch("https://y3xs5g62z3.execute-api.us-east-1.amazonaws.com/test/getDashboardValues?view=dashboard", requestOptions)
      .then(response => response.json())
      .then(result => { 
        /* this is how we set variable values */
        setCalories(result.data['calories']);
        setCaloriesGoal(result.data['caloriesGoal']);

        setCarbs(result.data['carbohydrates']);
        setCarbsGoal(result.data['carbohydratesGoal']);

        setFats(result.data['fats']);
        setFatsGoal(result.data['fatsGoal']);

        setProtein(result.data['protein']);
        setProteinGoal(result.data['proteinGoal']);
      })
      .catch(error => console.log('error', error));
  }

  return (
    <View style={styles.container}>
      {/* this is dumb title text */}
      <Text style={styles.title}>nmt18004 v1.0.0</Text>
      <Text style={{fontSize: 18}}>
        <Text style={{fontWeight: "bold"}}>Example: </Text>
        <Text>API request triggered by button press</Text>
      </Text>
      <Text></Text>
      <Text></Text>
      <Text>
        <Text style={{fontWeight: "bold"}}>Full URL: </Text> 
        <Text>https://y3xs5g62z3.execute-api.us-east-1.amazonaws.com/test/getDashboardValues?view=dashboard</Text>
      </Text>
      <Text></Text>
      <Text>
        <Text style={{fontWeight: "bold"}}>Protocol: </Text> 
        <Text>https</Text>
      </Text>
      <Text></Text>
      <Text>
        <Text style={{fontWeight: "bold"}}>Host: </Text> 
        <Text>y3xs5g62z3.execute-api.us-east-1.amazonaws.com</Text>
      </Text>
      <Text></Text>
      <Text>
        <Text style={{fontWeight: "bold"}}>Deployment Stage: </Text> 
        <Text>test</Text>
      </Text>
      <Text></Text>
      <Text>
        <Text style={{fontWeight: "bold"}}>Resource: </Text> 
        <Text>getDashboardValues</Text>
      </Text>
      <Text></Text>
      <Text>
        <Text style={{fontWeight: "bold"}}>Query String Parameters: </Text> 
        <Text>?view=dashboard</Text>
      </Text>
      <Text></Text>
      <Text></Text>
      <StatusBar style="auto" />

      {/* this is button that triggers API request */}
      {/* look at onPress={...} */}
      <TouchableHighlight onPress={nodeJS_NativeAPICall}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Use Fetch API</Text>
        </View>
      </TouchableHighlight>
      <Text></Text>
      
      {/* this is where we place the values*/}
      {/* the '\t' is tabbing to make it look nice for demo */}
      <View>
        <Text>Calories:{'\t\t\t\t'}{calories}</Text>
        <Text>Calories Goal:{'\t\t\t'}{caloriesGoal}</Text>
        <Text></Text>
        <Text>Carbohydrates:{'\t\t\t'}{carbs}</Text>
        <Text>Carbohydrates Goal:{'\t\t'}{carbsGoal}</Text>
        <Text></Text>
        <Text>Fat:{'\t\t\t\t\t\t'}{fats}</Text>
        <Text>Fat Goal:{'\t\t\t\t'}{fatsGoal}</Text>
        <Text></Text>
        <Text>Protein:{'\t\t\t\t\t'}{protein}</Text>
        <Text>Protein Goal:{'\t\t\t\t'}{proteinGoal}</Text>
      </View>
    </View>
    
  );
}

/* got these styles from a tutorial and by just playing around */
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

/* 
tutorial links or helpful websites: 
  https://rapidapi.com/blog/how-to-make-rest-api-calls-in-react-native/
  https://reactnative.dev/docs/network
  Postman App
  https://reactjs.org/docs/hooks-state.html
 */

/* just to make sure that this ends up in GitHub repository */