import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

//tell React that we will implement a navigator
import { NavigationContainer } from "@react-navigation/native";
//create a stack navigator
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import HomeScreen from "./src/components/HomeScreen";
import AboutScreen from "./src/components/AboutScreen";

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    //<View style={styles.container}>
      //<Text>Open up App.js to start working on your app!</Text>
      //<StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    //</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
