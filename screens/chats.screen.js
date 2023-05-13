import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ChatHeader from '../components/chat-header.component';
import { serverURL } from '../utils/enums.util';
const getChats = serverURL + '/chat'; // var serverURL => './utils/enums.util.js'

export default function ChatsScreen ({}) {

    const isFocused = useIsFocused();
    const [token, setToken] = useState(null);
    const [chats, setChats] = useState(null);

    useEffect(() => {
        const retrieveData = async (key) => {
            const res = await AsyncStorage.getItem(key);
            console.log(res);
            setToken(res);
        }
        retrieveData('token');
        if (token) {
            axios.get(getChats, {
                headers: {
                    'X-Authorization': token,
                }
            })
            .then(res => {
                console.log('Logging chats: ',res.data);
                setChats(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        } else {
            console.log('Token doesn\'t exist.',token)
        }
    }, [token, isFocused]);

    return (
        <View style={styles.container}>
            <ChatHeader />
            <View style={styles.otherContainer}>
                <Text style={styles.text}>No Maidens</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 60,
        backgroundColor: '#00000020',
        flex: 1,
    },
    otherContainer: {
        backgroundColor: '#00000040',
        flex: 1,
    },
    text: {
        color: '#fff'
    }
})