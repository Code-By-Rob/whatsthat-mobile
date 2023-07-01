// * IMPORTS
import {
    AntDesign,
    Octicons
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    useColorScheme
} from 'react-native';
import Toast from 'react-native-toast-message';
import Contact from '../components/contact.component';
import SearchInput from '../components/search-input.component';
import { serverURL } from '../utils/enums.util';
// * API
const contactsUrl = serverURL + '/contacts';
const searchUrl = serverURL + '/search'
const userUrl = serverURL + '/user/'
const blockedUrl = serverURL + '/blocked'

export default function ContactsScreen ({}) {

    // * STATES
    const theme = useColorScheme();
    const isDarkMode = theme === 'dark';
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

    /**
     * Retrieves an array of objects from the server 
     * containing data regarding the contact list of a user.
     * @param {String} token session token used in auth
     */
    const getContacts = (token) => {
        setFlag(tabsFlagOptions['contacts']);
        axios.get(contactsUrl, {
            headers: {
                'X-Authorization' : token,
            }
        }).then(res => {
            setContacts(res.data);
        }).catch(error => {
            const {
                status
            } = error.response;
            httpErrors(status);
        })
    }

    /**
     * Retrieves an array of objects from the server identifying blocked users 
     * for the individual.
     */
    const getBlocked = () => {
        setFlag(tabsFlagOptions['blocked']);
        axios.get(blockedUrl, {
            headers: {
                'X-Authorization': token,
            }
        }).then(res => {
            setBlocked(res.data);
        }).catch(error => {
            const {
                status
            } = error.response;
            httpErrors(status);
        })
    }

    /**
     * Handles changing to the search scene and setting the 
     * search query state.
     * @param {String} text 
     */
    const handleSearchChange = (text) => {
        // text.length > 0 ? setFlag(tabsFlagOptions['search']) : setFlag(tabsFlagOptions['contacts']);
        if (text.length === 0) {
            // retrieve all the contacts
            getContacts(token);
            setSearchUsers([]);
        }
        setQuery(text);
    }

    /**
     * Handles posting a search request to the server and 
     * retrieving the data and setting state.
     */
    const search = () => {
        if (query.length > 0) {
            axios.get(searchUrl + `?q=${query}&search_in=${
                flag === tabsFlagOptions['search'] ? 'all' : 'contacts'
            }&limit=${10}`, {
                headers: {
                    'X-Authorization': token
                }
            })
            .then(res => {
                // Set the correct state depending on the search_in query.
                flag === tabsFlagOptions['search'] ? setSearchUsers(res.data) : setContacts(res.data);
                if (res.data.length === 0) {
                    // let the user know that there is no one of the name they searched
                    Toast.show({
                        type: 'error',
                        text1: 'No Users',
                        text2: 'There are no users found from that query',
                    })
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

    /**
     * Handles posting a user identification marker to the server 
     * and updating the contacts state.
     * @param {Number} user_id 
     */
    const addContact = (user_id) => {
        axios.post(userUrl + user_id + '/contact', {}, {
            headers: {
                'X-Authorization': token,
            }
        }).then(res => {
            getContacts(token);
            Toast.show({
                type: 'success',
                text1: 'Added Contact',
                text2: 'Has been added as a contact!',
            })
        }).catch(error => {
            const {
                status
            } = error.response;
            httpErrors(status);
        })
    }

    /**
     * Handles posting a user identification marker to the server 
     * and updating the contacts state.
     * @param {Number} user_id 
     */
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
                text2: 'Successfully removed the contact!',
            })
        }).catch(error => {
            const {
                status
            } = error.response;
            httpErrors(status);
        })
    }

    /**
     * Handles posting a user identification marker to the server 
     * and updating the contacts state.
     * @param {Number} user_id 
     */
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
                text2: 'You have successfully blocked the contact!',
            })
        }).catch(error => {
            const {
                status
            } = error.response;
            httpErrors(status);
        })
    }

    /**
     * Handles deletion of a blocked user using a user identification marker 
     * and updating the blocked contacts state.
     * @param {Number} user_id 
     */
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
                text2: 'The user has been unblocked and added to your contacts again!',
            })
        }).catch(error => {
            const {
                status
            } = error.response;
            httpErrors(status);
        })
    }

    /**
     * Handles retrieval of data on first render and setting states for 
     * future calls to the server.
     */
    useEffect(() => {
        const retrieveToken = async (key) => {
            const res = await AsyncStorage.getItem(key);
            setToken(res);
            getContacts(res);
        }
        const retrieveId = async (key) => {
            const res = await AsyncStorage.getItem(key);
            setUserId(res);
        }
        retrieveToken('token');
        retrieveId('id');
    }, []);

    return (
        <SafeAreaView style={styles.parent}>
            <KeyboardAvoidingView style={styles.keyboardAvoidingContainer}>
                <SearchInput 
                    handleChangeText={(text) => handleSearchChange(text)}
                    search={search}
                    query={query}
                    accessibilityLabel={'Search'}
                    accessibilityHint={'Search contacts and other users'}
                />
                <View style={[styles.tabs, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
                    {/* Show the user's contacts */}
                    <Pressable
                        onPress={() => getContacts(token)}
                        style={[styles.tabButton, { borderBottomLeftRadius: 12, borderTopLeftRadius: 12, borderEndWidth: 0 }, flag === tabsFlagOptions['contacts'] ? { backgroundColor: '#4F46E5' } : null]}
                        accessible={true}
                        accessibilityLabel='Show contacts'
                        accessibilityHint='Show a list of your contacts'
                        accessibilityRole='button'
                    >
                        <Text style={[styles.tabText, flag === tabsFlagOptions['contacts'] ? { color: '#fff' } : null]}>Contacts</Text>
                    </Pressable>
                    {/* Show the user's search results */}
                    <Pressable
                        onPress={() => setFlag(tabsFlagOptions['search'])}
                        style={[styles.tabButton, flag === tabsFlagOptions['search'] ? { backgroundColor: '#4F46E5' } : null]}
                        accessible={true}
                        accessibilityLabel='Show search'
                        accessibilityHint='Shows a list of your search results'
                        accessibilityRole='button'
                    >
                        <Text style={[styles.tabText, flag === tabsFlagOptions['search'] ? { color: '#fff' } : null]}>Search</Text>
                    </Pressable>
                    {/* Show the user's blocked list */}
                    <Pressable
                        onPress={() => getBlocked()}
                        style={[styles.tabButton, { borderBottomRightRadius: 12, borderTopRightRadius: 12, borderStartWidth: 0 }, flag === tabsFlagOptions['blocked'] ? { backgroundColor: '#4F46E5' } : null]}
                        accessible={true}
                        accessibilityLabel='Show blocked'
                        accessibilityHint='Shows a list of your blocked users'
                        accessibilityRole='button'
                    >
                        <Text style={[styles.tabText, flag === tabsFlagOptions['blocked'] ? { color: '#fff' } : null]}>Blocked</Text>
                    </Pressable>
                </View>
                <SafeAreaView style={styles.contactsContainer}>
                    <FlatList
                        style={{ backgroundColor: isDarkMode ? '#000' : '#fff' }}
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
                                <Text style={{color: '#fff', marginTop: 16}}>
                                    {/* Add an image here */}
                                    This list is empty!
                                </Text>
                            </View>
                        }
                        renderItem={({item}) => (
                            parseInt(item?.user_id) === parseInt(userId) ?
                            null
                            :
                            (
                                <View>
                                {
                                    flag === tabsFlagOptions['contacts'] && (
                                        <Pressable key={item?.user_id}>
                                            <Contact first_name={item?.first_name || item?.given_name} last_name={item?.last_name || item?.family_name} image={null} user_id={item?.user_id} addContact={addContact} removeContact={removeContact} blockContact={blockContact} isContact={true} />
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
                            )
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
    contactsContainer: {
        flex: 20,
    },
    emptyList: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 32
    },
    tabs: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
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