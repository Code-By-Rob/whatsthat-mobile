import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import CustomTextInput from '../components/text-input.component';
import UserDetails from '../components/user-details.component';

// NETWORK
import UserSettingsHeader from '../components/user-settings-header.component';
import { serverURL } from "../utils/enums.util";
const logoutUrl = serverURL + '/logout'; // var serverURL => './utils/enums.util.js'
const userDataUrl = serverURL + '/user'; // var serverURL => './utils/enums.util.js'

export default function UserSettingScreen ({ navigation }) {

    const isFocused = useIsFocused();
    const [isEdit, setIsEdit] = useState(false);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);

    const getUserDetails = (token, user_id) => {
        console.log('Logging the token before getting user details: ', token, user_id);
        axios.get(userDataUrl + `/${user_id}`, {
            headers: {
                'X-Authorization': token,
            }
        }).then(res => {
            console.log(res.data)
            const {
                first_name,
                last_name,
                email,
            } = res.data;
            setFirst_name(first_name);
            setLast_name(last_name);
            setEmail(email);
        }).catch(err => {
            console.log(err);
            console.log(err.response);
            console.log(err.request);
        });
    }

    const uploadUserPhoto = () => {
        axios.post(userDataUrl + `/${userId}` + '/photo', {

        })
    }

    const logout = () => {
        /**
         * Logout the user
         */
        if (!token) return;
        axios.post(logoutUrl, {}, {
            headers: {
                'X-Authorization': token
            }
        })
        .then(res => {
            console.log(res);
            console.log('Got here!');
            navigation.navigate('Login', {});
        })
        .catch(err => {
            console.log(err);
        })
    }

    const handleSave = () => {
        setIsEdit(prev => !prev);
        if (isEdit) {
            axios.patch(userDataUrl + `/${userId}`, {
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password,
            }, {
                headers: {
                    'X-Authorization': token
                }
            }).then(res => {
                console.log(res.data);
            }).catch(error => {
                console.log(error);
            })
        }
    }

    useEffect(() => {
        const retrieveData = async () => {
            const token = await AsyncStorage.getItem('token');
            const user_id = await AsyncStorage.getItem('id');
            setToken(token);
            setUserId(user_id);
            getUserDetails(token, user_id);
        }
        retrieveData();
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <UserSettingsHeader />
            {/* Pressable User Image */}
            <Pressable onPress={setImage}>
                <Image 
                    style={styles.userImage}
                    source={require('../assets/avataaars.png')}
                />
            </Pressable>
            <View>
                <View style={styles.buttonContainer}>
                    <Pressable onPress={handleSave} style={styles.button}>
                        <Text style={styles.text}>{ isEdit ? 'Save' : 'Edit' }</Text>
                    </Pressable>
                </View>
                {
                    isEdit ?
                    <View>
                        <CustomTextInput 
                            label={'First name'}
                            value={first_name}
                            handleChange={setFirst_name}
                        />
                        <CustomTextInput 
                            label={'Last name'}
                            value={last_name}
                            handleChange={setLast_name}
                        />
                        <CustomTextInput 
                            label={'Email'}
                            value={email}
                            handleChange={setEmail}
                        />
                        <CustomTextInput 
                            label={'Password'}
                            value={password}
                            handleChange={setPassword}
                        />
                    </View>
                    :
                    <View>
                        {
                            first_name.length > 0 && 
                            last_name.length > 0 && 
                            email.length > 0 ?
                            <View>
                                <UserDetails 
                                    label={'First name'}
                                    detail={first_name}
                                />
                                <UserDetails 
                                    label={'Last name'}
                                    detail={last_name}
                                />
                                <UserDetails 
                                    label={'Email'}
                                    detail={email}
                                />
                            </View>
                            :
                            null
                        }
                    </View>
                }
            </View>
            <Pressable style={styles['logout-button']} onPress={() => logout()}>
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
    text: {
        color: '#fff',
        textAlign: 'center'
    },
    buttonContainer: {
        justifyContent: 'flex-end'
    },
    button: {
        backgroundColor: '#4F46E5',
        borderRadius: 5,
        paddingHorizontal: 16,
        paddingVertical: 8,
        width: 64,
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