import {
    AntDesign,
    Ionicons
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Button,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
    useColorScheme
} from 'react-native';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import ChannelHeader from '../components/channel-header.component';
import ChatInput from '../components/chat-input.component';
import Message from '../components/message.component';
import { serverURL } from '../utils/enums.util';
import httpErrors from '../utils/httpErrors.util';
const getChannelDetails = serverURL + '/chat/';
const userDataUrl = serverURL + '/user/';

export default function Channel({ route, navigation }) {

    const theme = useColorScheme();
    const isDarkMode = theme === 'dark';
    const { chat_id } = route.params;
    const isFocused = useIsFocused();
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [name, setName] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [messageLimit, setMessageLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [images, setImages] = useState([]);
    const [editMessage, setEditMessage] = useState('');
    const [message_id, setMessage_id] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleModal = (message, message_id) => {
        setEditMessage(message);
        setMessage_id(message_id);
        setIsModalVisible(prev => !prev);
    }

    const getChannelData = (token) => {
        axios.get(getChannelDetails + chat_id + `?limit=${messageLimit}&offset=${offset}`, {
            headers: {
                'X-Authorization': token,
            },
        }).then(res => {
            const {
                members
            } = res.data;
            console.log(members);
            members.forEach((item) => {
                console.log('loggin individual member: ',item);
                getImage(item?.user_id, token);
            })
            setOffset(prev => prev + messageLimit);
            setMessages(res.data.messages);
            setName(res.data.name)
        }).catch(error => {
            console.log(error);
            if (error.response) {
                const {
                    status
                } = error.response;
                httpErrors(status);
            }
        });
    };

    const sendMessage = () => {
        if (message.length > 0) {
            axios.post(getChannelDetails + chat_id + '/message', {
                message: message,
            }, {
                headers: {
                    'X-Authorization': token,
                }
            }).then(res => {
                setMessage('');
                getChannelData(token);
            }).catch(error => {
                console.log(error);
                const {
                    status
                } = error.response;
                httpErrors(status);
            });
        }
    };

    const updateMessage = () => {
        if (editMessage.length > 0) {
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
                Toast.show({
                    type: 'success',
                    text1: 'Updated Message!',
                    text2: 'The message has been updated.'
                });
                /**
                 * Write to new message to the message
                 */
            }).catch(error => {
                console.log('logging update message error: ',error);
                console.log('logging update message error: ',error.message);
                const {
                    status
                } = error.response;
                httpErrors(status);
            });
        } else {
            Toast.show({
                type: 'error',
                text1: 'Message Invalid!',
                text2: 'A message of length zero is invalid. Delete the message instead!'
            });
        }
    };

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
                Toast.show({
                    type: 'success',
                    text1: 'Deleted Message',
                    text2: 'Your message has been deleted!'
                })
            }).catch(error => {
                console.log(error);
                const {
                    status
                } = error.response;
                httpErrors(status);
            });
    };

    const getImage = (user_id, token) => {
        axios.get(userDataUrl + user_id + '/photo', {
            headers: {
                'X-Authorization': token,
            }
        }).then(res => {
            setImages(prev => [...prev, {user_id: user_id, image: res.data.uri}]);
            setLoading(false);
        }).catch(error => {
            console.log(error);
            const {
                status
            } = error.response;
            httpErrors(status);
        })
    }

    const returnUsersImage = (user_id) => {
        const filter = images.filter(item => parseInt(item.user_id) === parseInt(user_id));
        return filter[0]?.image;
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
    }, [token, isFocused]);

    return (
        <SafeAreaView style={[styles.parent, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
            {
                loading ?
                <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#000000' : '#ffffff' }]}>
                    <ActivityIndicator size={'large'} color={'#fff'} />
                </View>
                :
                <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
                    <ChannelHeader navigation={navigation} name={name} chat_id={chat_id} />
                    {
                        userId ?
                        <SafeAreaView style={{flex: 9}}>
                            <FlatList
                                data={messages}
                                inverted
                                contentContainerStyle={{ flexDirection: 'column' }}
                                ListEmptyComponent={
                                    <View style={[styles.noMessages, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
                                        <AntDesign name='message1' size={64} color={ isDarkMode ? '#fff' : '#000' } />
                                        <Text style={{color: isDarkMode ? '#fff' : '#000', fontSize: 18, marginTop: 6}}>No Messages</Text>
                                        <Pressable 
                                            onPress={() => navigation.navigate('ChannelSettings', { chat_id: chat_id })} 
                                            style={{backgroundColor: '#4F46E5', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginTop: 24}}
                                            accessible={true}
                                            accessibilityLabel='Add a member'
                                            accessibilityHint='Navigates to channel settings to add a member'
                                            accessibilityRole='button'
                                        >
                                            <Text style={{fontSize: 18, color: '#fff'}}>Add a member!</Text>
                                        </Pressable>
                                    </View>
                                }
                                renderItem={({item}) => <Message message={item?.message} message_id={item?.message_id} image={returnUsersImage(item?.author?.user_id)} isUser={parseInt(item.author.user_id) === parseInt(userId) ? true : false} timestamp={item?.timestamp} handleModal={handleModal} />}
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
                            <Pressable 
                                onPress={() => setIsModalVisible(prev => !prev)}
                                accessible={true}
                                accessibilityLabel='Close modal'
                                accessibilityHint='Closes the modal'
                                accessibilityRole='button'
                            >
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
                                accessibilityLabel='Edit message input'
                                accessibilityHint='Type in here to edit your message'
                            />
                            <View>
                                {/* Button above hides modal */}
                                <Button 
                                    title='Delete'
                                    onPress={deleteMessage}
                                    accessible={true}
                                    accessibilityLabel='Delete message'
                                    accessibilityHint='Deletes the current message'
                                    accessibilityRole='button'
                                />
                                {/* Button Below creates a channel */}
                                <Button 
                                    title='Update' 
                                    onPress={updateMessage} 
                                    accessible={true}
                                    accessibilityLabel='Update message'
                                    accessibilityHint='Updates the message with the text in the input'
                                    accessibilityRole='button'
                                />
                            </View>
                        </View>
                    </Modal>
                </KeyboardAvoidingView>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    parent: {
        flex: 1,
        // backgroundColor: '#000000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    container: {
        // marginTop: 60,
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
    noMessages: {
        backgroundColor: '#000',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    }
})