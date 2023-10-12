import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React, { useState, useLayoutEffect } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Text } from '@rneui/base';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Back To Login',
    });
  }, [navigation]);

  const register = () => {
    setLoading(true); // Set loading to true when registering

    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        updateProfile(authUser.user, {
          displayName: name,
          photoURL: imageURL || 'https://toppng.com/uploads/preview/roger-berry-avatar-placeholder-11562991561rbrfzlng6h.png',
        });
        setLoading(false); // Set loading to false on success
      })
      .catch((error) => {
        setLoading(false); // Set loading to false on error
        alert(error.message);
      });
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Text h3 style={{ marginBottom: 50 }}>
        Create an account
      </Text>
      <View style={styles.inputContainer}>
        <Input placeholder="Full Name" autoFocus type="text" onChangeText={(text) => setName(text)} />

        <Input placeholder="Email" type="email" onChangeText={(text) => setEmail(text)} />

        <Input placeholder="Password" secureTextEntry type="text" onChangeText={(text) => setPassword(text)} />

        <Input
          placeholder="Profile Picture Url (optional)"
          type="text"
          onChangeText={(text) => setImageURL(text)}
          onSubmitEditing={register}
        />
      </View>

      {loading ? (
        <View style={{ flexDirection: 'row' }}>
          <Text style={{color: "blue"}}>Loading...</Text>
          <ActivityIndicator size="small" color="blue" />
        </View>
      ) : (
        <Button
          containerStyle={styles.button}
          raised
          title="Register"
          onPress={register}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  inputContainer: {
    width: 300,
  },
});
