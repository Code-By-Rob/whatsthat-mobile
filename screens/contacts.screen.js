import {
    AntDesign
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import Contact from '../components/contact.component';
import { serverURL } from '../utils/enums.util';
const contactsUrl = serverURL + '/contacts';
const searchUrl = serverURL + '/search'
const userUrl = serverURL + '/user/'

export default function ContactsScreen ({}) {

    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [searchUsers, setSearchUsers] = useState([]);
    const [query, setQuery] = useState('');
    const [searchFlag, setSearchFlag] = useState(true);
    const getContacts = (token) => {
        axios.get(contactsUrl, {
            headers: {
                'X-Authorization' : token,
            }
        }).then(res => {
            setContacts(res.data);
        }).catch(error => {
            console.log(error);
        })
    }

    const hanldeSearchChange = (text) => {
        console.log(text);
        console.log('got here!');
        text.length > 0 ? setSearchFlag(false) : setSearchFlag(true);
        console.log(searchFlag);
        setQuery(text);
    }

    const search = () => {
        console.log(searchFlag);
        axios.get(searchUrl + `?q=${query}&search_in=${searchFlag ? 'contacts' : 'all'}&limit=${10}`, {
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
            console.log(res);
            getContacts(token);
        }).catch(error => {
            console.log(error);
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
            getContacts();
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
            <View style={styles.container}>
                <TextInput 
                    style={styles.input}
                    placeholder={'Search...'}
                    placeholderTextColor={'#475549'}
                    autoCorrect={true}
                    autoCapitalize={true}
                    onChangeText={(text) => hanldeSearchChange(text)}
                    value={query}
                />
                <Pressable onPress={search} style={styles.searchButton}>
                    <AntDesign name='rightcircleo' size={32} color={'#4F46E5'} />
                </Pressable>
            </View>
            <View>
                <Text>Contacts</Text>
                <Text>Search</Text>
                <Text>Blocked</Text>
            </View>
            <SafeAreaView>
                <FlatList
                    style={styles.flatlist}
                    data={searchFlag ? contacts : searchUsers}
                    renderItem={({item}) => (
                        searchFlag ? 
                        <Pressable onPress={() => navigation.navigate('Channel', { chat_id: item.chat_id })}>
                            <Contact first_name={item?.first_name} last_name={item?.last_name} image={null} user_id={item?.user_id} addContact={addContact} removeContact={removeContact} blockContact={blockContact} isContact={true} />
                        </Pressable>
                        :
                        parseInt(item?.user_id) !== parseInt(userId) ? 
                        <Pressable onPress={() => navigation.navigate('Channel', { chat_id: item.chat_id })}>
                            <Contact first_name={item?.given_name} last_name={item?.family_name} image={null} user_id={item?.user_id} addContact={addContact} isContact={false} />
                        </Pressable>
                        :
                        null
                    )}
                    keyExtractor={item => item.chat_id}
                />
            </SafeAreaView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    parent: {
        flex: 1,
    },
    container: {
        backgroundColor: '#000',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    flatlist: {
        backgroundColor: '#000',
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
    }
})