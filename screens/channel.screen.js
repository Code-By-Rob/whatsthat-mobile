import {
    Ionicons
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    Button,
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import Modal from 'react-native-modal';
import ChannelHeader from '../components/channel-header.component';
import ChatInput from '../components/chat-input.component';
import Message from '../components/message.component';
import { serverURL } from '../utils/enums.util';
const getChannelDetails = serverURL + '/chat/';

export default function Channel({ route, navigation }) {

    const { chat_id } = route.params;
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [name, setName] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [editMessage, setEditMessage] = useState('');
    const [message_id, setMessage_id] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleModal = (message, message_id) => {
        setEditMessage(message);
        setMessage_id(message_id);
        setIsModalVisible(prev => !prev);
    }

    const getChannelData = (token) => {
        axios.get(getChannelDetails + chat_id, {
            headers: {
                'X-Authorization': token
            },
        }).then(res => {
            console.log('Logging channel data: ',res.data);
            setMessages(res.data.messages);
            setName(res.data.name)
        }).catch(error => {
            console.log(error);
        })
    }

    const sendMessage = () => {
        console.log(token);
        if (message.length > 0) {
            axios.post(getChannelDetails + chat_id + '/message', {
                message: message,
            }, {
                headers: {
                    'X-Authorization': token,
                }
            }).then(res => {
                console.log(res.data);
                setMessage('');
                getChannelData(token);
            }).catch(error => {
                console.log(error);
            })
        }
    }

    const updateMessage = () => {
        axios.patch(getChannelDetails + chat_id + '/message/' + message_id, {
            message: editMessage
        }, {
            headers: {
                'X-Authorization': token
            }
        }).then(res => {
            console.log('logging update message success: ',res.data);
            setIsModalVisible(prev => !prev);
            getChannelData(token);
            /**
             * Write to new message to the message
             */
        }).catch(error => {
            console.log('logging update message error: ',error);
            console.log('logging update message error: ',error.message);
        })
    }

    const deleteMessage = () => {
        axios.delete(getChannelDetails + chat_id + '/message/' + message_id, {
                headers: {
                    'X-Authorization' : token
                }
            })
            .then(res => {
                console.log(res.data);
                setIsModalVisible(prev => !prev);
                getChannelData(token);
            }).catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        if (!token) {
            const retrieveData = async (key) => {
                const res = await AsyncStorage.getItem(key);
                console.log('Logging token: ', res);
                setToken(res);
                getChannelData(res);
            }
            retrieveData('token');
            const retrieveId = async (key) => {
                const res = await AsyncStorage.getItem(key);
                console.log('Logging id: ',JSON.parse(res));
                setUserId(res);
            }
            retrieveId('id');
        }
    }, [token]);

    return (
        <View style={styles.container}>
            <ChannelHeader navigation={navigation} name={name} chat_id={chat_id} />
            {
                userId ?
                <SafeAreaView style={{flex: 9}}>
                    <FlatList
                        data={messages}
                        inverted
                        contentContainerStyle={{ flexDirection: 'column' }}
                        renderItem={({item}) => <Message message={item?.message} message_id={item?.message_id} isUser={parseInt(item.author.user_id) === parseInt(userId) ? true : false} timestamp={item?.timestamp} handleModal={handleModal} />}
                        keyExtractor={item => item?.message_id}
                    />
                </SafeAreaView>
                :
                null
            }
            {/* Chat input for messages */}
            <ChatInput chat_id={chat_id} message={message} setMessage={setMessage} sendMessage={sendMessage} />
            {/* Modal for handling update and delete */}
            <Modal isVisible={isModalVisible}>
                <View style={styles.modal}>
                    <Pressable onPress={() => setIsModalVisible(prev => !prev)}>
                        <Ionicons name='exit-outline' style={{ textAlign: 'right' }} size={24} color={'#fff'} />
                    </Pressable>
                    <Text style={styles.text}>Edit a message</Text>
                    <TextInput
                        onChangeText={setEditMessage}
                        value={editMessage}
                        placeholder='Channel name'
                        placeholderTextColor={'#ffffff60'}
                        style={styles.input}
                        autoFocus={true}
                    />
                    <View>
                        {/* Button above hides modal */}
                        <Button title='Delete' onPress={deleteMessage} />
                        {/* Button Below creates a channel */}
                        <Button title='Update' onPress={updateMessage} />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 60,
        backgroundColor: '#000000',
        flex: 1,
    },
    modal: {
        backgroundColor: '#00000090',
        height: '30%',
        borderRadius: 24
    },
    text: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center'
    },
    input: {
        height: 40,
        margin: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        padding: 10,
        color: '#fff'
    },
})