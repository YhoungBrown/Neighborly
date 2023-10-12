import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Button, Input, Image } from '@rneui/base';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // Check if a user is already logged in
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                // If a user is already logged in, navigate to the home screen
                navigation.replace("Home");
            }
        });

        // Unsubscribe from the listener when the component unmounts
        return unsubscribe;
    }, []);

    const signIn = () => {
      signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
              // Successfully signed in
              const user = userCredential.user;
              // You can navigate to the home screen or perform other actions here
          })
          .catch((error) => {
              // Handle sign-in errors
              alert(error.message);
          });
  };
  

    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <StatusBar style='light' />
            <Image
                source={require("../assets/signal.png")}
                style={{ width: 200, height: 200 }}
            />

            <View style={styles.inputContainer}>
                <Input placeholder='Email' autoFocus type="Email" value={email} onChangeText={text => setEmail(text)} />

                <Input placeholder='Password' secureTextEntry autoFocus type="password" value={password} onChangeText={text => setPassword(text)} onSubmitEditing={signIn}/>
            </View>

            <Button title="Login" containerStyle={styles.button} onPress={signIn} />
            <Button title="Register" type='outline' containerStyle={styles.button} onPress={() => navigation.navigate("Register")} />
        </KeyboardAvoidingView>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white",
    },
    inputContainer: {
        width: 300,
    },
    button: {
        width: 200,
        marginTop: 10
    },
});
