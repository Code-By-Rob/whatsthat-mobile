import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    useColorScheme
} from 'react-native';
import Toast from 'react-native-toast-message';
import CustomButton from '../components/custom-button.component';
import CustomTextInput from '../components/text-input.component';
import UserDetails from '../components/user-details.component';
import UserSettingsHeader from '../components/user-settings-header.component';
import { serverURL } from "../utils/enums.util";
import httpErrors from '../utils/httpErrors.util';
const logoutUrl = serverURL + '/logout'; // var serverURL => './utils/enums.util.js'
const userDataUrl = serverURL + '/user'; // var serverURL => './utils/enums.util.js'

export default function UserSettingScreen ({ navigation }) {

    const theme = useColorScheme();
    const isDarkMode = theme === 'dark';
    const isFocused = useIsFocused();
    const [isEdit, setIsEdit] = useState(false);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState({});
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
                    Toast.show({
                        type: 'success',
                        text1: 'Profile Photo Updated!',
                        text2: 'You have successfully updated your profile photo!'
                    })
                }).catch(error => {
                    console.log(error);
                    if (error.response) {
                        const {
                            status
                        } = error.response;
                        httpErrors(status);
                    }
                })
            } catch(error) {
                const {
                    status
                } = error.response;
                httpErrors(status);
            }
        } else {
            alert('You did not select any image');
        }
    }

    const getUserDetails = (token, user_id) => {
        axios.get(userDataUrl + `/${user_id}`, {
            headers: {
                'X-Authorization': token,
            }
        }).then(res => {
            console.log(res.data)
            console.log('Got here!');
            const {
                first_name,
                last_name,
                email,
            } = res.data;
            setFirst_name(first_name);
            setLast_name(last_name);
            setEmail(email);
            setUser({})
            getImage(user_id, token);
        }).catch(error => {
            console.log(error);
            if (error.response) {
                const {
                    status
                } = error.response;
                httpErrors(status);
            }
        });
    }

    const getImage = (user_id, token) => {
        axios.get(userDataUrl + `/${user_id}` + '/photo', {
            headers: {
                'X-Authorization': token,
            }
        }).then(res => {
            console.log(typeof res.data);
            setImageUri(res.data.uri);
        }).catch(error => {
            if (error.response) {
                const {
                    status
                } = error.response;
                httpErrors(status);
            }
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
        .then(() => {
            navigation.navigate('Login', {});
        })
        .catch(error => {
            if (error.response) {
                const {
                    status
                } = error.response;
                httpErrors(status);
            }
        })
    }

    const handleSave = () => {
        if (isEdit) {
            if (Object.keys(user).length > 0) {
                console.log('Logging the user object: ',user);
                axios.patch(userDataUrl + `/${userId}`, user, {
                    headers: {
                        'X-Authorization': token
                    }
                }).then(res => {
                    console.log(res.data);
                    Toast.show({
                        type: 'success',
                        text1: 'Profile Updated!',
                        text2: 'You have successfully updated your profile!'
                    })
                    getUserDetails(token, userId);
                    setIsEdit(prev => !prev);
                }).catch(error => {
                    if (error.response) {
                        const {
                            status
                        } = error.response;
                        httpErrors(status);
                    }
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'No Changes',
                    text2: 'No changes have been made to your account'
                });
                setIsEdit(prev => !prev);
            }
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
            <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
                <UserSettingsHeader />
                <View>
                    {/* Pressable User Image */}
                    <Pressable
                        onPress={pickImage}
                        accessible={true}
                        accessibilityLabel='Image picker'
                        accessibilityHint='Allows you to pick and image from your gallery'
                        accessibilityRole='button'
                    >
                        <Image 
                            style={styles.userImage}
                            source={imageUri ? { uri: imageUri } : require('../assets/avataaars.png')}
                        />
                    </Pressable>
                    <View style={{marginVertical: 12}}>
                        <CustomButton
                            onPressFunction={() => isEdit ? handleSave() : setIsEdit(prev => !prev)}
                            text={isEdit ? 'Save' : 'Edit'}
                            accessibilityLabel={`${isEdit ? 'Save Changes' : 'Edit Profile'}`}
                            accessibilityHint={`${isEdit ? 'Save the changes you made to your account' : 'Make an edit to your account'}`}
                        />
                    </View>
                    {
                        isEdit ?
                        <View>
                            <CustomTextInput 
                                label={'First name'}
                                value={user?.first_name}
                                handleChange={(text) => setUser(prev => ({...prev, first_name: text}))}
                                placeholder={first_name}
                                accessibilityLabel='First name'
                                accessibilityHint='This input allows you to change your first name'
                            />
                            <CustomTextInput 
                                label={'Last name'}
                                value={user?.last_name}
                                handleChange={(text) => setUser(prev => ({...prev, last_name: text}))}
                                placeholder={last_name}
                                accessibilityLabel='Last name'
                                accessibilityHint='This input allows you to change your last name'
                            />
                            <CustomTextInput 
                                label={'Email'}
                                value={user?.email}
                                handleChange={(text) => setUser(prev => ({...prev, email: text}))}
                                placeholder={email}
                                accessibilityLabel='Email'
                                accessibilityHint='This input allows you to change your email'
                            />
                            <CustomTextInput 
                                label={'Password'}
                                value={user?.password}
                                handleChange={(text) => setUser(prev => ({...prev, password: text}))}
                                accessibilityLabel='Password'
                                accessibilityHint='This input allows you to change your password'
                            />
                        </View>
                        :
                        <View>
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
                        </View>
                    }
                </View>
                <Pressable
                    style={styles['logout-button']}
                    onPress={() => logout()}
                    accessible={true}
                    accessibilityLabel='Logout'
                    accessibilityHint='Logs you out and navigates to the login screen'
                    accessibilityRole='button'
                >
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