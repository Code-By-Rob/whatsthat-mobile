import {
    AntDesign,
    Ionicons
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import ChannelHeader from "../components/channel-header.component";
import Contact from '../components/contact.component';
import CustomButton from '../components/custom-button.component';
import SearchInput from '../components/search-input.component';
import CustomTextInput from '../components/text-input.component';
import { serverURL } from '../utils/enums.util';
import httpErrors from '../utils/httpErrors.util';
const updateChannelUrl = serverURL + '/chat/'
const userDataUrl = serverURL + '/user/';
const contactsUrl = serverURL + '/contacts'
const searchUrl = serverURL + '/search'

export default function ChannelSettings({ route, navigation }) {

    const isFocused = useIsFocused();
    const { chat_id } = route.params;
    const [token, setToken] = useState(null);
    const [channelName, setChannelName] = useState('');
    const [flag, setFlag] = useState(true);
    const [members, setMembers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [query, setQuery] = useState('');
    const [images, setImages] = useState([]);

    const getChannelData = (token) => {
        axios.get(updateChannelUrl + chat_id, {
            headers: {
                'X-Authorization': token
            },
        }).then(res => {
            console.log('Logging channel data: ',res.data);
            const {
                members
            } = res.data;
            members.forEach((item, index) => {
                console.log(members);
                getImage(item?.user_id, token);
            })
            setChannelName(res.data.name)
            setMembers(res.data.members);
        }).catch(error => {
            console.log(error);
            const {
                status
            } = error.response;
            httpErrors(status);
        })
    }

    const getContacts = (token) => {
        axios.get(contactsUrl, {
            headers: {
                'X-Authorization' : token,
            }
        }).then(res => {
            console.log('logging channel settings contacts: ',res.data);
            setContacts(res.data);
        }).catch(error => {
            console.log(error);
            const {
                status
            } = error.response;
            httpErrors(status);
        })
    }

    const getImage = (user_id, token) => {
        axios.get(userDataUrl + user_id + '/photo', {
            headers: {
                'X-Authorization' : token,
            }
        }).then(res => {
            setImages(prev => [...prev, { user_id: user_id, image: res.data.uri }])
        }).catch(error => {
            const {
                status
            } = error.response;
            httpErrors(status);
        })
    }

    const returnUsersImage = (user_id) => {
        const filter = images.filter(item => item.user_id === user_id);
        return filter[0]?.image;
    }

    const addContactToChannel = (user_id) => {
        axios.post(updateChannelUrl + chat_id + '/user/' + user_id, {}, {
            headers: {
                'X-Authorization': token,
            }
        }).then(res => {
            getChannelData(token);
            Toast.show({
                type: 'success',
                text1: 'Added Contact to Channel!',
                text2: 'The contact has been added to this channel!'
            })
        }).catch(error => {
            const {
                status
            } = error.response
            httpErrors(status);
        })
    }

    const removeContactFromChannel = (user_id) => {
        axios.delete(updateChannelUrl + chat_id + '/user/' + user_id, {
            headers: {
                'X-Authorization': token,
            }
        }).then(res => {
            console.log(res.data);
            getChannelData(token);
            Toast.show({
                type: 'success',
                text1: 'Removed User from Channel',
                text2: 'You have successfully removed this user from the channel.'
            })
        }).catch(error => {
            console.log(error);
            const {
                status
            } = error.response;
            httpErrors(status);
        })
    }

    const updateChannel = () => {
        if (channelName.length > 0) {
            axios.patch(updateChannelUrl + chat_id, {
                name: channelName,
            }, {
                headers: {
                    'X-Authorization' : token,
                }
            }).then(res => {
                console.log(res.data);
                Toast.show({
                    type: 'success',
                    text1: 'Updated Channel',
                    text2: 'Your channel has been updated!',
                })
            }).catch(error => {
                console.log(error);
                const {
                    status
                } = error.response;
                httpErrors(status);
            })
        } else {
            Toast.show({
                type: 'error',
                text1: 'Channel Name Invalid',
                text2: 'The channel name must have a length greater than zero!'
            })
        }
    }

    const handleContactsSearch = (text) => {
        if (text.length === 0) {
            getContacts(token);
        }
        setQuery(text);
    }

    const search = () => {
        if (query.length > 0) {
            axios.get(searchUrl + `?q=${query}&search_in=contacts&limit=${10}`, {
                headers: {
                    'X-Authorization': token
                }
            })
            .then(res => {
                if (res.data.length === 0) {
                    // let the user know that there is no one of the name they searched
                    Toast.show({
                        type: 'error',
                        text1: 'No Users',
                        text2: 'There are no users found from that query',
                    })
                } else {
                    setContacts(res.data);
                }
            })
            .catch(error => {
                const {
                    status
                } = error.response;
                httpErrors(status);
            })
        } else {
            Toast.show({
                type: 'error',
                text1: 'Query Empty',
                text2: 'Query is empty. To search please enter a user\'s name.'
            });
        }
    };

    useEffect(() => {
        if (!token) {
            const retrieveData = async (key) => {
                const res = await AsyncStorage.getItem(key);
                console.log('Logging token: ', res);
                setToken(res);
                getChannelData(res);
                getContacts(res);
            }
            retrieveData('token');
        }
    }, [token, isFocused]);

    return (
        <SafeAreaView style={styles.parent}>
            <View style={styles.container}>
                <ChannelHeader navigation={navigation} />
                <Text style={ styles.title }>Channel Settings</Text>
                <CustomTextInput
                    handleChange={setChannelName}
                    value={channelName}
                />
                {/* <Pressable onPress={updateChannel} style={styles.button}>
                    <Text style={[styles.text, { textAlign: 'center' }]}>Save</Text>
                </Pressable> */}
                <CustomButton onPressFunction={updateChannel} text='Save' />
                <Text style={styles.title}>Member Settings</Text>
                <View style={styles.tabs}>
                    {/* Show the channel's members */}
                    <Pressable onPress={() => setFlag(true)} style={[styles.tabButton, { borderBottomLeftRadius: 12, borderTopLeftRadius: 12, borderEndWidth: 0 }, flag ? { backgroundColor: '#4F46E5' } : null]}>
                        <Text style={[styles.tabText, flag ? { color: '#fff' } : null]}>Members</Text>
                    </Pressable>
                    {/* Show the user's contacts */}
                    <Pressable onPress={() => setFlag(false)} style={[styles.tabButton, { borderBottomRightRadius: 12, borderTopRightRadius: 12, borderStartWidth: 0 }, flag ? null : { backgroundColor: '#4F46E5' }]}>
                        <Text style={[styles.tabText, flag ? null : { color: '#fff' }]}>Contacts</Text>
                    </Pressable>
                </View>
                {/* Add contact search functionality here */}
                {
                    flag ?
                    null
                    :
                    <View style={{ marginHorizontal: 16, marginTop: 12 }}>
                        <SearchInput handleChangeText={(text) => handleContactsSearch(text)} search={search} query={query} />   
                    </View>
                }
                {
                    token !== null ?
                    <SafeAreaView>
                        <FlatList
                            data={flag ? members : contacts}
                            ListEmptyComponent={
                                <View style={styles.emptyList}>
                                    <AntDesign name='contacts' size={64} color={'#fff'} />
                                    <Text style={{color: '#fff', marginTop: 16}}>
                                        {/* Add an image here */}
                                        This list is empty!
                                    </Text>
                                </View>
                            }
                            renderItem={({item}) => (
                                <View>
                                    {
                                        flag ?
                                        <ChannelMember key={item?.user_id} first_name={item?.first_name} last_name={item?.last_name} user_id={item?.user_id} token={token} chat_id={chat_id} image={returnUsersImage(item?.user_id)} removeUser={removeContactFromChannel} />
                                        :
                                        <Contact key={item?.user_id} first_name={item?.first_name || item?.given_name} last_name={item?.last_name || item?.family_name} image={null} user_id={item?.user_id} addContact={addContactToChannel} isContact={false} isBlocked={false} />
                                    }
                                </View>
                            )}
                            keyExtractor={item => item.user_id}
                        />
                    </SafeAreaView>
                    :
                    null
                }
            </View>
        </SafeAreaView>
    )
}

const ChannelMember = ({ first_name, last_name, user_id, image, removeUser }) => {

    return (
        <View style={styles.memberContainer}>
            {/* User's Image */}
            <Image style={styles.userImage} source={image ? { uri: image } : require('../assets/avataaars.png')} />
            {/* User's name */}
            <Text style={styles.text}>{ first_name + ' ' + last_name }</Text>
            <Pressable onPress={() => removeUser(user_id)} style={styles.redButton}>
                <Ionicons name='person-remove-outline' style={{color: '#fff'}} size={18} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    parent: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    title: {
        fontSize: 26,
        color: '#fff',
        textAlign: 'center',
        marginVertical: 16
    },
    button: {
        backgroundColor: '#4F46E5',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginVertical: 12
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
    userImage: {
        width: 48,
        height: 48,
        borderRadius: 80,
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#000',
        paddingTop: 8,
        paddingHorizontal: 28
    },
    tabButton: {
        borderWidth: 2,
        borderColor: '#4F46E5',
        width: '50%',
        paddingVertical: 8
    },
    tabText: {
        color: '#4F46E5',
        textAlign: 'center',
    },
    emptyList: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 32
    },
})