import {
    Ionicons
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import ChannelHeader from "../components/channel-header.component";
import { serverURL } from '../utils/enums.util';
const updateChannelUrl = serverURL + '/chat/'
const contactsUrl = serverURL + '/contacts'

export default function ChannelSettings({ route, navigation }) {

    const { chat_id } = route.params;
    const [token, setToken] = useState(null);
    const [channelName, setChannelName] = useState('');
    const [flag, setFlag] = useState(true);
    const [members, setMembers] = useState([]);
    const [contacts, setContacts] = useState([]);

    const getChannelData = (token) => {
        axios.get(updateChannelUrl + chat_id, {
            headers: {
                'X-Authorization': token
            },
        }).then(res => {
            console.log('Logging channel data: ',res.data);
            setChannelName(res.data.name)
            setMembers(res.data.members);
        }).catch(error => {
            console.log(error);
        })
    }

    const getContacts = () => {
        axios.get(contactsUrl, {
            headers: {
                'X-Authorization': token,
            }
        }).then(res => {

        })
    }

    const updateChannel = () => {
        axios.patch(updateChannelUrl + chat_id, {
            name: channelName,
        }, {
            headers: {
                'X-Authorization' : token,
            }
        }).then(res => {
            console.log(res.data);
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
        }
    }, [token]);

    return (
        <View style={styles.container}>
            <ChannelHeader navigation={navigation} />
            <Text style={ styles.title }>Channel Settings</Text>
            <TextInput
                style={styles.input}
                onChangeText={setChannelName}
                value={channelName}
            />
            <Pressable onPress={updateChannel} style={styles.button}>
                <Text style={styles.text}>Save</Text>
            </Pressable>
            <Text style={ styles.title }>Member Settings</Text>
            {
                token !== null ?
                <SafeAreaView>
                    <FlatList
                        data={flag ? members : contacts}
                        renderItem={({item}) => <ChannelMember first_name={item?.first_name} last_name={item?.last_name} user_id={item?.user_id} token={token} chat_id={chat_id} />}
                        keyExtractor={item => item.user_id}
                    />
                </SafeAreaView>
                :
                null
            }
        </View>
    )
}

const ChannelMember = ({ first_name, last_name, user_id, token, chat_id }) => {

    const removeUser = () => {
        axios.delete(updateChannelUrl + chat_id + '/user/' + user_id, {
            headers: {
                token: token,
            }
        }).then(res => {
            console.log(res.data);
        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <View style={styles.memberContainer}>
            {/* User's Image */}
            <Image style={styles.userImage} source={require('../assets/avataaars.png')} />
            {/* User's name */}
            <Text style={styles.text}>{ first_name + ' ' + last_name }</Text>
            <Pressable onPress={removeUser} style={styles.redButton}>
                <Ionicons name='person-remove-outline' style={{color: '#fff'}} size={18} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 60,
        backgroundColor: '#000',
    },
    title: {
        fontSize: 26,
        color: '#fff',
        textAlign: 'center',
        marginVertical: 24
    },
    button: {
        backgroundColor: '#4F46E5',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    memberContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 8
    },
    redButton: {
        backgroundColor: '#f00',
        borderRadius: 5,
        padding: 8,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#fff'
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        borderColor: '#fff',
        padding: 10,
        color: '#fff'
    },
    userImage: {
        width: 48,
        height: 48
    }
})