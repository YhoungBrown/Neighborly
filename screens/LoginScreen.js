import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Input, Image } from '@rneui/base';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView } from 'react-native';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // Add loading state

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
        setLoading(true); // Set loading to true when signing in
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Successfully signed in
                const user = userCredential.user;
                // You can navigate to the home screen or perform other actions here
            })
            .catch((error) => {
                // Handle sign-in errors
                setLoading(false); // Set loading to false on error
                alert(error.message);
            });
    };

    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <StatusBar style='light' />
            <Image
                source={{
                    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKI29kVKdlvyr4z21MZ7X45qHbkQnlTi_L_eJkP_dF5EceZyJnGLHex0ga7fuQhuUcN_4&usqp=CAU"
                }}
                style={{ width: 200, height: 70, marginBottom: 10}}
            />

            <View style={styles.inputContainer}>
                <Input placeholder='Email' autoFocus type="Email" value={email} onChangeText={text => setEmail(text)} />

                <Input placeholder='Password' secureTextEntry autoFocus type="password" value={password} onChangeText={text => setPassword(text)} onSubmitEditing={signIn} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="blue" />
                    <Text style={styles.loadingText}>Logging in...</Text>
                </View>
            ) : (
                <Button title="Login" containerStyle={styles.button} onPress={signIn} />
            )}

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
        marginTop: 10,
    },
    loadingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        marginTop: 20,
    },
    loadingText: {
        color: "blue",
    },
});
