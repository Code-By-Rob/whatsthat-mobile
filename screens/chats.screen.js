import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import Modal from 'react-native-modal';
import Chatfeed from '../components/channel.component';
import ChatHeader from '../components/chat-header.component';
import { serverURL } from '../utils/enums.util';
import { chatData } from '../utils/testdata.util';
const getChats = serverURL + '/chat'; // var serverURL => './utils/enums.util.js'
const createChat = serverURL + '/chat'; // var serverURL => './utils/enums.util.js'

export default function ChatsScreen ({ navigation }) {

    const isFocused = useIsFocused();
    const [token, setToken] = useState(null);
    const [chats, setChats] = useState([]); // stores the retrieved chats
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [text, onChangeText] = useState('');

    const handleModal = () => setIsModalVisible(() => !isModalVisible);

    const getChannels = () => {
        axios.get(getChats, { // get chats from /chat
            headers: {
                'X-Authorization': token,
            }
        })
        .then(res => {
            /**
             * Example Value : Schema
             *  [
                    {
                        "chat_id": 14,
                        "name": "The Rod Stewart Appreciation Society",
                        "creator": {
                        "user_id": 14,
                        "first_name": "Ashley",
                        "last_name": "Williams",
                        "email": "ashley.williams@mmu.ac.uk"
                        },
                        "last_message": {
                            "message_id": 14,
                            "timestamp": 1640013942,
                            "message": "Welcome to all our new members",
                            "author": {
                                "user_id": 14,
                                "first_name": "Ashley",
                                "last_name": "Williams",
                                "email": "ashley.williams@mmu.ac.uk"
                            }
                        }
                    }
                ]
             */
            console.log('Logging chats: ',res.data);
            setChats(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        const retrieveData = async (key) => {
            const res = await AsyncStorage.getItem(key);
            console.log(res);
            setToken(res);
        }
        retrieveData('token');
        if (token) {
            getChannels();
        } else {
            console.log('Token doesn\'t exist.',token)
        }
    }, [token, isFocused]);

    const createChannel = () => {
        if (text.length > 0) {
            axios.post(createChat, {
                name: text
            }, {
                headers: {
                    'X-Authorization': token,
                }
            }).then(res => {
                console.log(res.data);
                onChangeText('');
                getChannels();
                handleModal();
            }).catch(error => {
                console.log('Logging error',error);
                console.log('Logging error',error.message);
            })
        } else {
            /**
             * Tell the user to enter a name
             */
            console.log('text is empty!');
        }
    }

    return (
        <View style={styles.container}>
            <ChatHeader showModal={handleModal} />
            <SafeAreaView style={styles.otherContainer}>
                <FlatList
                    data={chats.length > 0 ? chats : chatData}
                    renderItem={({item}) => (
                        <Pressable onPress={() => navigation.navigate('Channel', { chat_id: item.chat_id })}>
                            <Chatfeed name={item.name} chat_id={item.chat_id} last_message={item.last_message} />
                        </Pressable>
                    )}
                    keyExtractor={item => item.chat_id}
                />
            </SafeAreaView>
            <Modal isVisible={isModalVisible}>
                <View style={styles.modal}>
                    <Text style={styles.text}>Create a channel</Text>
                    <TextInput
                        onChangeText={onChangeText}
                        value={text}
                        placeholder='Channel name'
                        placeholderTextColor={'#ffffff60'}
                        style={styles.channelNameInput}
                        autoFocus={true}
                    />
                    <View>
                        {/* Button above hides modal */}
                        <Button title='Cancel' onPress={handleModal} />
                        {/* Button Below creates a channel */}
                        <Button title='Create' onPress={createChannel} />
                    </View>
                </View>
            </Modal>
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
        color: '#fff',
        fontSize: 20,
        textAlign: 'center'
    },
    modal: {
        backgroundColor: '#00000090',
        height: '30%',
        borderRadius: 24
    },
    channelNameInput: {
        height: 40,
        margin: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        padding: 10,
        color: '#fff'
    }
})