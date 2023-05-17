import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import CustomTextInput from '../components/text-input.component';
import UserDetails from '../components/user-details.component';
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
    const [imageUri, setImageUri] = useState(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })

        console.log(result);
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setImage(result.assets[0]);
            try {
                axios.post(userDataUrl + `/${userId}` + '/photo', image, {
                    headers: {
                        'Content-Type': 'image/jpeg',
                        'X-Authorization': token
                    }
                }).then(res => {
                    console.log('Logging response: ',res.data);
                }).catch(error => {
                    console.log(error);
                })
            } catch(error) {

            }
        } else {
            alert('You did not select any image');
        }
    }

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
            getImage(user_id, token);
        }).catch(err => {
            console.log(err);
            console.log(err.response);
            console.log(err.request);
        });
    }

    const getImage = (user_id, token) => {
        axios.get(userDataUrl + `/${user_id}` + '/photo', {
            headers: {
                'X-Authorization': token,
            }
        }).then(res => {
            console.log(res.data);
            setImageUri(res.data.uri);
        }).catch(error => {
            console.log(error);
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
        <SafeAreaView style={styles.parent}>
            <View style={styles.container}>
                <UserSettingsHeader />
                <View>
                    {/* Pressable User Image */}
                    <Pressable onPress={pickImage}>
                        <Image 
                            style={styles.userImage}
                            source={imageUri ? { uri: imageUri } : require('../assets/avataaars.png')}
                        />
                    </Pressable>
                    <Pressable onPress={handleSave} style={styles.button}>
                        <Text style={styles.text}>{ isEdit ? 'Save' : 'Edit' }</Text>
                    </Pressable>
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
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    parent: {
        height: '100%',
        flex: 12
    },
    container: {
        backgroundColor: '#000',
        flex: 1,
    },
    userImage: {
        width: 150,
        height: 150,
        borderRadius: 80,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    text: {
        color: '#fff',
        textAlign: 'center'
    },
    button: {
        backgroundColor: '#4F46E5',
        borderRadius: 5,
        paddingHorizontal: 16,
        paddingVertical: 8,
        width: 64,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 24
    },
    'logout-button': {
        // backgroundColor: '#FCA5A5',
        width: 128,
        paddingHorizontal: 12,
        paddingVertical: 6,
        width: '75%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 24,
        borderRadius: 12,
        borderColor: '#DC2626',
        borderWidth: 2,
    },
    'logout-text': {
        color: '#DC2626',
        fontSize: 18,
        textAlign: 'center',
    }
});