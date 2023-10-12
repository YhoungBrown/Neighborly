import { ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity} from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import CustomListItem from '../components/CustomListItem'
import { Avatar } from '@rneui/base';
import {auth, db} from "../firebase"
import { signOut } from 'firebase/auth';
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons"
import { collection, doc, onSnapshot } from 'firebase/firestore';


const HomeScreen = ({navigation}) => {
    const [chats, setChats] = useState([]);

    const signOutUser = () => {
        signOut(auth).catch((error) => setError(error)).then(() => navigation.replace("Login"))
        //.finally(() => setLoading(false))
    }
 

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "chats"), (snapshot) => {
            setChats(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                })
            ));
        });

        // Don't forget to unsubscribe when the component unmounts
        return () => {
            unsubscribe();
        };
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Neighborly",
            headerStyle: {backgroundColor: "white"},
            headerTitleStyle: {color: "black"},
            headerTintColor: "black",
            headerLeft : () => (<View style={{ marginLeft: 10}}>
            <TouchableOpacity activeOpacity={0.5} onPress={signOutUser} style={{padding: 10}}>
            <Avatar
                rounded 
                    source={{uri : auth?.currentUser?.photoURL}}
                />
            </TouchableOpacity>    
            </View>),
            headerRight: () => (
                <View style={{
                     flexDirection: 'row',
                     justifyContent: 'space-between',
                     width: 80,
                     marginRight: 20,
                }}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <AntDesign name='camerao' size={24} color="black"/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("AddChat")} activeOpacity={0.5}>
                        <SimpleLineIcons name='pencil' size={24} color="black"/>
                    </TouchableOpacity>
                </View>
            )
        })
    }, []);

    const enterChat = (id, chatName) => {
        navigation.navigate("Chat", {
            id,
            chatName
        });
    };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
      {chats.map(({id, data: {chatName}}) => (
        <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat}/>
      ))}
        
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        height: "100%",
    }
})