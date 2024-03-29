import {
    AntDesign,
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
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
    View,
    useColorScheme
} from 'react-native';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import Chatfeed from '../components/channel.component';
import ChatHeader from '../components/chat-header.component';
import { serverURL } from '../utils/enums.util';
import httpErrors from '../utils/httpErrors.util';
const getChats = serverURL + '/chat'; // var serverURL => './utils/enums.util.js'
const createChat = serverURL + '/chat'; // var serverURL => './utils/enums.util.js'

export default function ChatsScreen ({ navigation }) {

    const theme = useColorScheme();
    const isDarkMode = theme === 'dark';
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
            console.log('Logging chats: ',res.data);
            setChats(res.data);
        })
        .catch(error => {
            const {
                status
            } = error.response;
            httpErrors(status);
        })
    }

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
                Toast.show({
                    type: 'success',
                    text1: 'Channel Created!',
                    text2: 'You have created a new channel!'
                })
            }).catch(error => {
                const {
                    status
                } = error.response;
                httpErrors(status);
            })
        } else {
            /**
             * Tell the user to enter a name
             */
            Toast.show({
                type: 'error',
                text1: 'Channel needs a name',
                text2: 'Please enter a name for your new channel!'
            })
        }
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

    return (
        <SafeAreaView style={styles.parent}>
            <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
                <ChatHeader showModal={handleModal} />
                <SafeAreaView style={styles.otherContainer}>
                    <FlatList
                        // ! FOR TESTING
                        // * data={chats.length > 0 ? chats : chatData}
                        style={{ backgroundColor: isDarkMode ? '#000' : '#fff' }}
                        data={chats}
                        ListEmptyComponent={
                            <View style={styles.noChannel}>
                                <AntDesign name='message1' size={64} color={'#fff'} />
                                <Text style={{color: '#fff', fontSize: 18, marginTop: 18}}>No Channels</Text>
                                <Pressable
                                    onPress={handleModal}
                                    style={{backgroundColor: '#4F46E5', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginTop: 24}}
                                    accessible={true}
                                    accessibilityLabel='Channel Modal'
                                    accessibilityHint='Opens the channel creation modal'
                                    accessibilityRole='button'
                                >
                                    <Text style={{fontSize: 18, color: '#fff'}}>Create a channel!</Text>
                                </Pressable>
                            </View>
                        }
                        renderItem={({item}) => (
                            <Pressable
                                onPress={() => navigation.navigate('Channel', { chat_id: item.chat_id })}
                                accessible={true}
                                accessibilityLabel={`${item.name} channel`}
                                accessibilityHint={`Navigates to ${item.name} channel`}
                                accessibilityRole='button'
                            >
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
                            accessibilityLabel='Channel Name'
                            accessibilityHint='The name of the new channel'
                        />
                        <View>
                            {/* Button above hides modal */}
                            <Button
                                title='Cancel'
                                onPress={handleModal}
                                accessible={true}
                                accessibilityLabel='Cancel'
                                accessibilityHint='Cancels creating a new channel'
                                accessibilityRole='button'
                            />
                            {/* Button Below creates a channel */}
                            <Button
                                title='Create'
                                onPress={createChannel}
                                accessible={true}
                                accessibilityLabel='Create'
                                accessibilityHint='Creates your new channel'
                                accessibilityRole='button'
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    parent: {
        flex: 1,
    },
    container: {
        // marginTop: 60,
        backgroundColor: '#000',
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
    },
    noChannel: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 32
    }
})