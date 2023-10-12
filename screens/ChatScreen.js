import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Avatar } from '@rneui/base'
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp} from 'firebase/firestore';
import { auth, db } from '../firebase';

const ChatScreen = ({navigation, route}) => {

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);


    useLayoutEffect(() => {
      navigation.setOptions({
        title: "Chat",
        headerTitleAlign: "left",
        headerBackTitleVisible: false,
        headerTitle: () => (
          <View style={{flexDirection: 'row',
                        alignItems: "center",
                        }}>
            <Avatar rounded source={{
              uri: messages[0]?.data.photoURL }}/>

            <Text
            style={{color: "white", marginLeft: 10, fontWeight: "700"}}
            >{route.params.chatName}</Text>
          </View>
        ),
        /** dont need the below cos my own default arrow is what's required for my desired result putting this here to remind me how to change it in future.
         * headerLeft: () => (
          <TouchableOpacity style={{marginLeft: 10}} onPress={navigation.goBack}>
            <AntDesign name='arrowleft' color="white" size={24}/>
          </TouchableOpacity>
        )*/
        headerRight: () => (
          <View style={{
            flexDirection: 'row', 
            justifyContent: "space-between", 
            width: 80, 
            marginRight: 20}}>

            <TouchableOpacity style>
              <FontAwesome name='video-camera' size={24} color="white"/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name='call' size={24} color="white"/>
            </TouchableOpacity>
          </View>
        )
      })
    }, [navigation, messages])


    const SendMessage = () => {
      Keyboard.dismiss();
    
      const chatRef = collection(db, "chats");
      const chatDocRef = doc(chatRef, route.params.id);
      const messageRef = collection(chatDocRef, "messages");
    
      addDoc(messageRef, {
        timestamp: serverTimestamp(),
        message: input,
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        photoURL: auth.currentUser.photoURL,
      }).catch((error) => {
        console.error("Error sending the message:", error);
        
      });
    
      setInput(""); 
    };
    
    useLayoutEffect(() => {
      const chatRef = collection(db, 'chats', route.params.id, 'messages');
      const messagesQuery = query(chatRef, orderBy('timestamp', 'desc'));
    
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });
    
      return unsubscribe;
    }, [route]);
    
    


  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "white"}}>
    <StatusBar style='light' />
    <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
        >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <ScrollView contentContainerStyle={{paddingTop: 15}}>
            {/* chat */}
            {messages.map(({id, data}) => (
              data.email === auth.currentUser.email ? (
                <View key={id} style={styles.reciever}>
                    <Avatar 
                    position = "absolute"
                    //for web
                    containerStyle = {{
                      position: 'absolute',
                      bottom: -15,
                      right: -5
                    }}
                    bottom={-15}
                    right={-5}
                    rounded
                    size={30}
                    source={{
                      uri : data.photoURL
                    }}/>
                    <Text style={styles.recieverText}>{data.message}</Text>
                </View>
              ) : (
                <View key={id} style={styles.sender}>
                <Avatar 
                  position = "absolute"
                    //for web
                    containerStyle = {{
                      position: 'absolute',
                      bottom: -15,
                      left: -5
                    }}
                    bottom={-15}
                    left={-5}
                    rounded
                    size={30}
                    source={{
                      uri : data.photoURL
                    }}
                />
                    <Text style={styles.senderText}>{data.message}</Text>
                    <Text style={styles.senderName}>{data.displayName}</Text>
                </View>
              )
            ))}
          </ScrollView>
          <View style={styles.footer}>
              <TextInput 
              placeholder='Enter Message..' style={styles.textInput}
                onChangeText={text => setInput(text)} onSubmitEditing={SendMessage} value={input}
              />

              <TouchableOpacity activeOpacity={0.5} onPress={SendMessage}>
                    <Ionicons name='send' size={24}  color="#2B68E6"/>
              </TouchableOpacity>
          </View>
        </>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>     
    </SafeAreaView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  footer: {
    flexDirection: 'row',
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "gray",
    borderRadius: 30,
  },
  reciever: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  senderName:{
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white",
  },
  recieverText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
  },
  senderText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
})