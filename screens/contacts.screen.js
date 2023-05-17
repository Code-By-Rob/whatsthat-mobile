import {
    AntDesign,
    Octicons
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Contact from '../components/contact.component';
import { serverURL } from '../utils/enums.util';
const contactsUrl = serverURL + '/contacts';
const searchUrl = serverURL + '/search'
const userUrl = serverURL + '/user/'
const blockedUrl = serverURL + '/blocked'

export default function ContactsScreen ({}) {

    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [searchUsers, setSearchUsers] = useState([]);
    const [blocked, setBlocked] = useState([]);
    const [query, setQuery] = useState('');
    const tabsFlagOptions = {
        contacts: 'contacts',
        search: 'search',
        blocked: 'blocked'
    }
    const [flag, setFlag] = useState(tabsFlagOptions['contacts']);

    const getContacts = (token) => {
        setFlag(tabsFlagOptions['contacts']);
        axios.get(contactsUrl, {
            headers: {
                'X-Authorization' : token,
            }
        }).then(res => {
            console.log(res.data);
            setContacts(res.data);
        }).catch(error => {
            console.log(error);
        })
    }

    const getBlocked = () => {
        setFlag(tabsFlagOptions['blocked']);
        axios.get(blockedUrl, {
            headers: {
                'X-Authorization': token,
            }
        }).then(res => {
            console.log('Logging blocked: ',res.data);
            setBlocked(res.data);
        }).catch(error => {
            console.log(error);
        })
    }

    const hanldeSearchChange = (text) => {
        console.log(text);
        console.log('got here!');
        text.length > 0 ? setFlag(tabsFlagOptions['search']) : setFlag(tabsFlagOptions['contacts']);
        setQuery(text);
    }

    const search = () => {
        axios.get(searchUrl + `?q=${query}&search_in=${'all'}&limit=${10}`, {
            headers: {
                'X-Authorization': token
            }
        })
            .then(res => {
                console.log(res.data);
                setSearchUsers(res.data);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const addContact = (user_id) => {
        axios.post(userUrl + user_id + '/contact', {}, {
            headers: {
                'X-Authorization': token,
            }
        }).then(res => {
            console.log(res.data);
            getContacts(token);
            Toast.show({
                type: 'success',
                text1: 'Added Contact',
                text2: 'Has been added as a contact!',
            })
        }).catch(error => {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Problem',
                text2: 'Has been added as a contact!',
            })
        })
    }

    const removeContact = (user_id) => {
        console.log(token);
        axios.delete(userUrl + user_id + '/contact', {
            headers: {
                'X-Authorization': token,
            }
        }).then(res => {
            console.log(res);
            getContacts(token);
            Toast.show({
                type: 'success',
                text1: 'Removed Contact',
                text2: 'Has been added as a contact!',
            })
        }).catch(error => {
            console.log(error);
        })
    }

    const blockContact = (user_id) => {
        axios.post(userUrl + user_id + '/block', {}, {
            headers: {
                'X-Authorization': token
            }
        }).then(res => {
            console.log(res.data);
            getContacts(token);
            Toast.show({
                type: 'success',
                text1: 'User Blocked',
                text2: 'Has been added as a contact!',
            })
        }).catch(error => {
            console.log(error);
        })
    }

    const unblockContact = (user_id) => {
        axios.delete(userUrl + user_id + '/block', {
            headers: {
                'X-Authorization': token,
            }
        }).then(res => {
            console.log(res.data);
            getBlocked();
            Toast.show({
                type: 'success',
                text1: 'User Unblocked',
                text2: 'Has been added as a contact!',
            })
        }).catch(error => {
            console.log(error);
        })
    }

    useEffect(() => {
        const retrieveToken = async (key) => {
            const res = await AsyncStorage.getItem(key);
            console.log(res);
            setToken(res);
            getContacts(res);
        }
        const retrieveId = async (key) => {
            const res = await AsyncStorage.getItem(key);
            console.log(res);
            setUserId(res);
        }
        retrieveToken('token');
        retrieveId('id');
    }, []);

    return (
        <SafeAreaView style={styles.parent}>
            <KeyboardAvoidingView style={styles.keyboardAvoidingContainer}>
                <View style={styles.searchContainer}>
                    <TextInput 
                        style={styles.input}
                        placeholder={'Search...'}
                        placeholderTextColor={'#475549'}
                        autoCorrect={true}
                        autoCapitalize={true}
                        onChangeText={(text) => hanldeSearchChange(text)}
                        value={query}
                        onPressIn={() => setFlag(tabsFlagOptions['search'])}
                    />
                    <Pressable onPress={search} style={styles.searchButton}>
                        <AntDesign name='rightcircleo' size={32} color={'#4F46E5'} />
                    </Pressable>
                </View>
                <View style={styles.tabs}>
                    {/* Show the user's contacts */}
                    <Pressable onPress={() => getContacts(token)} style={[styles.tabButton, { borderBottomLeftRadius: 12, borderTopLeftRadius: 12, borderEndWidth: 0 }, flag === tabsFlagOptions['contacts'] ? { backgroundColor: '#4F46E5' } : null]}>
                        <Text style={[styles.tabText, flag === tabsFlagOptions['contacts'] ? { color: '#fff' } : null]}>Contacts</Text>
                    </Pressable>
                    {/* Show the user's search results */}
                    <Pressable onPress={() => setFlag(tabsFlagOptions['search'])} style={[styles.tabButton, flag === tabsFlagOptions['search'] ? { backgroundColor: '#4F46E5' } : null]}>
                        <Text style={[styles.tabText, flag === tabsFlagOptions['search'] ? { color: '#fff' } : null]}>Search</Text>
                    </Pressable>
                    {/* Show the user's blocked list */}
                    <Pressable onPress={() => getBlocked()} style={[styles.tabButton, { borderBottomRightRadius: 12, borderTopRightRadius: 12, borderStartWidth: 0 }, flag === tabsFlagOptions['blocked'] ? { backgroundColor: '#4F46E5' } : null]}>
                        <Text style={[styles.tabText, flag === tabsFlagOptions['blocked'] ? { color: '#fff' } : null]}>Blocked</Text>
                    </Pressable>
                </View>
                <SafeAreaView style={styles.contactsContainer}>
                    <FlatList
                        style={styles.flatlist}
                        data={flag === tabsFlagOptions['contacts'] ? contacts : flag === tabsFlagOptions['search'] ? searchUsers : blocked}
                        ListEmptyComponent={
                            <View style={styles.emptyList}>
                                {
                                    flag === tabsFlagOptions['contacts'] ? 
                                    <AntDesign name='contacts' size={64} color={'#fff'} />
                                    :
                                    flag === tabsFlagOptions['search'] ?
                                    <AntDesign name='search1' size={64} color={'#fff'} />
                                    :
                                    <Octicons name='blocked' size={64} color={'#fff'} />
                                }
                                <Text style={{color: '#fff'}}>
                                    {/* Add an image here */}
                                    This list is empty!
                                </Text>
                            </View>
                        }
                        renderItem={({item}) => (
                            <View>
                                {
                                    flag === tabsFlagOptions['contacts'] && (
                                        <Pressable key={item?.user_id}>
                                            <Contact first_name={item?.first_name} last_name={item?.last_name} image={null} user_id={item?.user_id} addContact={addContact} removeContact={removeContact} blockContact={blockContact} isContact={true} />
                                        </Pressable>
                                    )
                                }
                                {
                                    flag === tabsFlagOptions['search'] && (
                                        parseInt(item?.user_id) !== parseInt(userId) ? 
                                        <Pressable key={item?.user_id}>
                                            <Contact first_name={item?.given_name} last_name={item?.family_name} image={null} user_id={item?.user_id} addContact={addContact} blockContact={blockContact} isContact={false} />
                                        </Pressable>
                                        :
                                        null
                                    )
                                }
                                {
                                    flag === tabsFlagOptions['blocked'] && (
                                        <Pressable key={item?.user_id}>
                                            <Text>Blocked</Text>
                                            <Contact first_name={item?.first_name} last_name={item?.last_name} image={null} user_id={item?.user_id} addContact={addContact} isContact={false} unblockContact={unblockContact} isBlocked={true} />
                                        </Pressable>
                                    )
                                }
                            </View>
                        )}
                        keyExtractor={item => item?.user_id}
                    />
                </SafeAreaView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    parent: {
        flex: 1,
    },
    keyboardAvoidingContainer: {
        flex: 1
    },
    searchContainer: {
        backgroundColor: '#000',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    contactsContainer: {
        flex: 20,
    },
    flatlist: {
        backgroundColor: '#000',
    },
    emptyList: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center'
    },
    input: {
        height: 40,
        margin: 6,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderWidth: 2,
        padding: 10,
        paddingHorizontal: 20,
        borderColor: '#4F46E5',
        borderRadius: 12,
        width: '75%',
        color: '#ffffff',
    },
    searchButton: {
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabs: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#000',
        paddingTop: 8,
        paddingHorizontal: 28
    },
    tabButton: {
        borderWidth: 2,
        borderColor: '#4F46E5',
        width: '33.3%',
    },
    tabText: {
        color: '#4F46E5',
        textAlign: 'center',
    }
})