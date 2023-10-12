import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react';
import { Button, Input, color } from '@rneui/base';
import Icon from 'react-native-vector-icons/AntDesign';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const AddChatScreen = ({navigation}) => {

    const [input, setInput] = useState("");

    const createChat = async () => {
        await addDoc(collection(db, "chats"), {
            chatName: input
        })
        .then(() => {
            navigation.goBack();
            setInput("");
        })
        .catch((error) => alert(error.message));
    }


    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Add a new Chat",
            headerBackTitle: "Chats",
            
        })
    }, [navigation])

  return (
    <View style={styles.container}>
      <Input 
        placeholder='Enter a chat name'
        onChangeText={text => setInput(text)}
        leftIcon={
                <Icon name="wechat" type="antdesign" size={24} color="black"/>
            }
        onSubmitEditing={createChat}
      />
      <Button disabled={!input} onPress={createChat} title="Create new Chat"/>
    </View>
  )
}

export default AddChatScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 30,
        height: "100%",
    }
})