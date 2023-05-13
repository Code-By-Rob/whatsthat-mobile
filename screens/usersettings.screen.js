import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import CustomTextInput from '../components/text-input.component';

// NETWORK
import { serverURL } from "../utils/enums.util";
const logoutUrl = serverURL + '/logout'; // var serverURL => './utils/enums.util.js'
const userDataUrl = serverURL + '/user'; // var serverURL => './utils/enums.util.js'

export default function UserSettingScreen ({}) {

    const isFocused = useIsFocused();
    const [isEdit, setIsEdit] = useState(false);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    const getData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                // value previously stored
                return value;
            }
        } catch (err) {
            // error reading value
        }
    }

    useEffect(() => {
        const retrieveToken = async (key) => {
            const res = await AsyncStorage.getItem(key);
            console.log(res);
            setToken(res);
        }
        const retrieveId = async (key) => {
            const res = await AsyncStorage.getItem(key);
            console.log(res);
            setUserId(res);
        }
        retrieveToken('token');
        retrieveId('id');
        console.log('logging user id',userId);
        console.log('logging token in user settings',token);
        if (userId && token) {
            console.log('Got here!');
            axios.get(userDataUrl + `/${userId}`, {
                'X-Authorisation': token,
            }).then(response => console.log(response)).catch(err => console.log(err));
        }
    }, [isFocused]);

    const logout = () => {
        /**
         * Logout the user
         */
        axios.post(logoutUrl)
        .then(res => {
            if (res.status === 200) {
                navigation.navigate('Login', {});
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <View style={styles.container}>
            {/* Pressable User Image */}
            <Pressable onPress={() => console.log('Upload an image!')}>
                <Image 
                    style={styles.userImage}
                    source={require('../assets/avataaars.png')}
                />
            </Pressable>
            <View>
                {
                    isEdit ?
                    <View>
                        <CustomTextInput 
                            label={'First name'}
                        />
                        <CustomTextInput 
                            label={'Last name'}
                        />
                        <CustomTextInput 
                            label={'Email'}
                        />
                        <CustomTextInput 
                            label={'Password'}
                        />
                    </View>
                    :
                    <View>
                        {/* {
                            user.length > 0 ?
                            <View>
                                <UserDetails 
                                    label={'First name'}
                                    detail={user[0]}
                                />
                                <UserDetails 
                                    label={'Last name'}
                                    detail={user[1]}
                                />
                                <UserDetails 
                                    label={'Email'}
                                    detail={user[3]}
                                />
                                <UserDetails 
                                    label={'Password'}
                                />
                            </View>
                            :
                            null
                        } */}
                    </View>
                }
            </View>
            <Pressable style={styles['logout-button']} onPress={logout}>
                <Text style={styles['logout-text']}>Logout</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        height: '100%',
        flex: 12
    },
    userImage: {
        width: 150,
        height: 150,
    },
    'logout-button': {
        backgroundColor: '#FCA5A5',
        width: 128,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    'logout-text': {
        color: '#7F1D1D',
        fontSize: 18,
        textAlign: 'center'
    }
});