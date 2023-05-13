// DEPENDENCIES
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Dimensions, Keyboard, StyleSheet, View } from "react-native";

// COMPONENTS
import CustomButton from "../components/custom-button.component";
import FlashError from "../components/flash-error.component";
import CustomTextInput from "../components/text-input.component";

// VALIDATION
import { emailValidate, passwordValidate } from "../utils/validation.util";

// NETWORK
import { serverURL } from "../utils/enums.util";
const url = serverURL + '/login'; // var serverURL => './utils/enums.util.js'



export default function Login({ navigation }) {

    /**
     * Handle the keyboard offset to appropriately display text inputs
     */
    const [keyboardOffset, setKeyboardOffset] = useState(0);
    /**
     * Handle errors from server:
     * - 400 { errorMessage: `Invalid email/password supplied` }
     * - 500 { errorMessage: `Server Error` }
     */
    const [errorMessage, setErrorMessage] = useState([]);
    const [resolutionMessage, setResolutionMessage] = useState([]);
    /**
     * Handle client server fetch time:
     * loading + spinner
     */
    const [isLoading, setIsLoading] = useState(false);
    /**
     * Handle email input:
     */
    const [email, setEmail] = useState(null);
    /**
     * Handle password input:
     */
    const [password, setPassword] = useState(null);

    /**
     * Handle Keyboard open & close event
     */
    useEffect(() => {
        const windowWidth = Dimensions.get('window').width;
        const showSubscription = Keyboard.addListener('keyboardDidShow', (event) => {
        setKeyboardOffset(windowWidth - event.endCoordinates.height);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardOffset(0);
        });

        return () => {
        showSubscription.remove();
        hideSubscription.remove();
        };
    }, []);

    /**
     * 
     * @param {String} key 
     * @param {String} value 
     */
    const storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (e) {
            // saving error
        }
    }

    const loginUser = async () => {
        /**
         * set isLoading to true
         * reset errorMessage & resolutionMessage
         * validate email
         * validate password
         * Axios || fetch to http://localhost:3333/api/1.0.0/login
         * send the following values:
         * - email
         * - password
         * expected responses:
         * - 200 { "user_id": 14, "session_token": "b5d9e7be6c97aa855f721b6e742120f2" }
         * - 400 { errorMessage: `Invalid email/password supplied` }
         * - 500 { errorMessage: `Server Error` }
         * set isLoading to false & handle screen transfer
         */
        console.log(email);
        console.log(password);
        console.log('Setting Error Message to empty array');
        setErrorMessage([]);
        setResolutionMessage([]);
        if (emailValidate(email) && passwordValidate(password)) {
            console.log('Email & Password are valid!');
            setIsLoading(true);
            const dataToSend = {
                email: email,
                password: password,
            }
            console.log(dataToSend);
            console.log(url);
            await axios.post(url, dataToSend)
                .then(response => {
                    console.log('inside axios promise!');
                    /**
                     * set isLoading to false
                     * store with AsyncStorage e.g., data : { "user_id": 14, "session_token": "b5d9e7be6c97aa855f721b6e742120f2" }
                     * session_token is our auth token
                     * if status === 200
                     * - Store data with AsyncStorage
                     * - Login and change screen
                     * if status >= 400 => badRequest
                     * if status >= 500 => server error
                     */
                    setIsLoading(false);
                    if (response.status >= 200 && response.status < 300) {
                        console.log(response.data);
                        console.log('logging id', JSON.stringify(response.data.id));
                        console.log('token', JSON.stringify(response.data.token));
                        storeData('id', JSON.stringify(response.data.id));
                        storeData('token', response.data.token);
                        /**
                         * Change the screen to => contacts.screen.js
                         */
                        navigation.navigate('Main', {});
                    }
                })
                .catch(err => {
                    console.log(err);
                    if (err.response) {
                        const { status, data } = err.response;
                        if (status >= 400 && status < 500) {
                            /**
                             * Do something with a bad request
                             * - 400 { errorMessage: `Invalid email/password supplied` }
                             * Show the error flash with the response.data.errorMessage
                             */
                            setErrorMessage([data]);
                            setResolutionMessage(['You have an active account', 'Your email is spelt correctly', 'your password is spelt correctly']);
                        } else if (status >= 500) {
                            /**
                             * Do something with a server error
                             * - 500 { errorMessage: `Server Error` }
                             * Show the error flash with the response.data.errorMessage
                             */
                            setErrorMessage([data]);
                            setResolutionMessage(['Wait 2 minutes and try again', 'Or contact a member of staff']);
                        }
                    } else if (err.request) {
                        console.log(err.request);
                        setErrorMessage(['Network Error']);
                        setResolutionMessage(['Check your wifi connection is on', 'Check that your data is turned on', 'Try again in a couple of minutes']);
                    } else {
                        console.log('Error', err.message);
                        setErrorMessage([err.message]);
                    }
                })
        } else {
            /**
             * Check what failed & highlight the failure (ErrorFlash) + why
             * Tell the user what went wrong e.g.,
             * - Email is empty
             * - Email invalid? (not matching requirements)
             * - Password is too short
             * - Password requires special char
             */
            if (email === null) {
                /**
                 * if email is null
                 * - set error message === 'Email input is empty'
                 * - set resolution message === 'Please enter an email'
                 * - error flash => email is empty
                 */
                setErrorMessage(prevValues => [...prevValues, 'Email input is empty']);
                setResolutionMessage(prevValues => [...prevValues, 'Please enter an email']);
            } else
            if (!emailValidate(email)) {
                console.log(emailValidate(email));
                console.log('Email entered is invalid')
                /**
                 * if email is invalid
                 * - set error message === 'Email entered is invalid'
                 * - set resolution message === 'Please enter a valid email'
                 * - error flash => email is invalid
                 */
                setErrorMessage(prevValues => [...prevValues, 'Email entered is invalid']);
                setResolutionMessage(prevValues => [...prevValues, 'Please enter a valid email', 'e.g., johndoe@company.com']);
                console.log('Email Val logging errormessage: ',errorMessage);
            }
            if (password === null) {
                console.log('Password input is empty')
                /**
                 * if password is null
                 * - set error message === 'Password input is empty'
                 * - set resolution message === 'Please enter an password'
                 * - error flash => email is empty
                 */
                setErrorMessage(prevValues => [...prevValues, 'Password input is empty']);
                setResolutionMessage(prevValues => [...prevValues, 'Please enter an password', 'Contains special character', 'Contains number', 'Longer than 8 characters']);
                console.log('Password null logging errormessage: ',errorMessage);
            } else
            if (!passwordValidate(password)) {
                console.log('Password entered is invalid');
                /**
                 * if password is invalid
                 * - set error message === 'Password entered is invalid'
                 * - set resolution message === 'Please enter a valid password'
                 * - error flash => password invalid & flash password info
                 */
                setErrorMessage(prevValues => [...prevValues, 'Password entered is invalid']);
                setResolutionMessage(prevValues => [...prevValues, 'Please enter a valid password', 'Contains special character', 'Contains number', 'Longer than 8 characters']);
                console.log('Password Val logging errormessage: ',errorMessage);
            }
        }
    }

    // --------------------------------------------------------------------------------------------

    return (
        <View style={styles.container}>
            <View style={[styles.userDetails, { bottom: keyboardOffset }]}>

                {/* FLASH ERROR */}
                {
                    errorMessage.length > 0 ?
                    <FlashError errorMessage={errorMessage} resolutionMessage={resolutionMessage} />
                    :
                    null
                }
                {/* EMAIL INPUT */}
                <CustomTextInput 
                    handleChange={newEmail => setEmail(newEmail)} 
                    label={'Email'} 
                    placeholder={'example@email.com...'} 
                    autoFocus={true} 
                    autoComplete={'email'}
                    keyboardType={'email-address'}
                    inputMode={'email'}
                    textContentType={'emailAddress'} 
                />

                {/* PASSWORD INPUT */}
                <CustomTextInput 
                    handleChange={newPassword => setPassword(newPassword)} 
                    label={'Password'} 
                    placeholder={'password...'} 
                    autoFocus={false}
                    autoComplete={'current-password'}
                    secureTextEntry={true}
                    textContentType={'password'} 
                />

                {/* SUBMIT BUTTON */}
                <CustomButton text={'Login'} onPressFunction={loginUser} />

                {/* NAVIGATION BUTTON */}
                <Button
                    title="New? Create and Account!"
                    onPress={() =>
                        navigation.navigate('CreateUser')
                    }
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        backgroundColor: '#000000'
    },
    userDetails: {
        width: '100%',
    }
});