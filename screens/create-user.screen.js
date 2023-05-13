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
const url = serverURL + '/user'; // var serverURL => './utils/enums.util.js'



export default function CreateUser({ navigation }) {

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
     * Handle first_name input
     */
    const [firstname, setFirstname] = useState(null);
    /**
     * Handle last_name input
     */
    const [lastname, setLastname] = useState(null);
    /**
     * Handle email input:
     */
    const [email, setEmail] = useState(null);
    /**
     * Handle password input:
     */
    const [password, setPassword] = useState(null);

    useEffect(() => {
        const windowWidth = Dimensions.get('window').width;
        const showSubscription = Keyboard.addListener('keyboardDidShow', (event) => {
            setKeyboardOffset((windowWidth - event.endCoordinates.height) + 30);
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

    const createUser = async () => {
        setErrorMessage([]);
        setResolutionMessage([]);
        /**
         * store data from inputs
         * - first_name
         * - last_name
         * - email
         */
        storeData('first_name', firstname);
        storeData('last_name', lastname);
        storeData('email', email);
        // set isLoading to true for spinner activation
        setIsLoading(true);
        /**
         * validate email
         * validate password
         */
        console.log('createUser function called!');
        if (emailValidate(email) 
            && passwordValidate(password) 
            && firstname !== null || firstname !== '' 
            && lastname !== null || lastname !== '') {
            
            console.log('firstname, lastname, email & password is valid');
            /**
             * email & password are valid
             * So, clientside validation is complete.
             * Send post request to the server.
             * Handle the response.
             */
            // const res = await axios.post(url, data, config);
            // const data = res.json();
            /**
             * Axios || fetch to http://localhost:3333/api/1.0.0/user
             * send the following values:
             * - first_name
             * - last_name
             * - email
             * - password
             */
            const dataToSend = {
                first_name: firstname,
                last_name: lastname,
                email: email,
                password: password,
            }
            console.log(dataToSend);
            await axios.post(url, dataToSend)
                .then(response => {
                    console.log(response);
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
                    console.log('Got here!');
                    setIsLoading(false);
                    if (response.status >= 200 && response.status < 300) {
                        storeData("id", JSON.stringify(response.data.id));
                        /**
                         * Change the screen to => contacts.screen.js
                         */
                        navigation.navigate('Login');
                    }
                })
                .catch(err => {
                    if (err.response) {
                        const { status, data } = err.response;
                        if (status >= 400 && status < 500) {
                            /**
                             * Do something with a bad request
                             * - 400 { errorMessage: `Invalid email/password supplied` }
                             * Show the error flash with the response.data.errorMessage
                             */
                            setErrorMessage([data]);
                        } else if (status >= 500) {
                            /**
                             * Do something with a server error
                             * - 500 { errorMessage: `Server Error` }
                             * Show the error flash with the response.data.errorMessage
                             */
                            setErrorMessage([data]);
                        }
                    } else if (err.request) {
                        setErrorMessage(['Network Error']);
                        setResolutionMessage(['Check your wifi connection is on', 'Check that your data is turned on', 'Try again in a couple of minutes']);
                    } else {
                        console.log('Error', err.message);
                        setErrorMessage([err.message]);
                    }
                })
        } else {
            /**
             * Tell the user what went wrong e.g.,
             * - firstname empty?
             * - lastname empty?
             * - Email empty?
             * - Email invalid? (not matching requirements)
             * - Password is too short
             * - Password requires special char
             */
            if (firstname === null || firstname === '') {
                /**
                 * if firstname is null
                 * - set error message === 'Firstname input is empty'
                 * - set resolution message === 'Please enter your firstname'
                 * - error flash => firstname is empty
                 */
                console.log('Firstname input is empty')
                setErrorMessage(prevValues => [...prevValues, 'Firstname input is empty']);
                setResolutionMessage(prevValues => [...prevValues, 'Please enter your firstname']);
            }
            if (lastname === null || lastname === '') {
                /**
                 * if lastname is null
                 * - set error message === 'Lastname input is empty'
                 * - set resolution message === 'Please enter your lastname'
                 * - error flash => lastname is empty
                 */
                console.log('Lastname input is empty')
                setErrorMessage(prevValues => [...prevValues, 'Lastname input is empty']);
                setResolutionMessage(prevValues => [...prevValues, 'Please enter your lastname']);
            }
            if (email === null) {
                /**
                 * if email is null
                 * - set error message === 'Email input is empty'
                 * - set resolution message === 'Please enter an email'
                 * - error flash => email is empty
                 */
                setErrorMessage(prevValues => [...prevValues, 'Email input is empty']);
                setResolutionMessage(prevValues => [...prevValues, 'Please enter an email']);
            } else if (!emailValidate(email)) {
                /**
                 * if email is invalid
                 * - set error message === 'Email entered is invalid'
                 * - set resolution message === 'Please enter a valid email'
                 * - error flash => email is invalid
                 */
                setErrorMessage(prevValues => [...prevValues, 'Email entered is invalid']);
                setResolutionMessage(prevValues => [...prevValues, 'Please enter a valid email', 'e.g., johndoe@company.com']);
            }
            if (password === null) {
                /**
                 * if password is null
                 * - set error message === 'Password input is empty'
                 * - set resolution message === 'Please enter an password'
                 * - error flash => email is empty
                 */
                setErrorMessage(prevValues => [...prevValues, 'Password input is empty']);
                setResolutionMessage(prevValues => [...prevValues, 'Please enter an password']);
            } else if (!passwordValidate(password)) {
                /**
                 * if password is invalid
                 * - set error message === 'Password entered is invalid'
                 * - set resolution message === 'Please enter a valid password'
                 * - error flash => password invalid & flash password info
                 */
                setErrorMessage(prevValues => [...prevValues, 'Password entered is invalid']);
                setResolutionMessage(prevValues => [...prevValues, 'Please enter a valid password', 'Contains special character', 'Contains number', 'Longer than 8 characters']);
            }
        }
        /**
         * Set is loading to false
         * Letting the user know that they can type
         */
        setIsLoading(false);
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

                {/* FIRST NAME INPUT */}
                <CustomTextInput 
                    handleChange={newText => setFirstname(newText)} 
                    label={'First Name'} 
                    placeholder={'first name...'} 
                    autoFocus={true} 
                    autoComplete={'given-name'}
                    autoCapitalize={'words'}
                    textContentType={'givenName'} 
                />

                {/* LAST NAME INPUT */}
                <CustomTextInput 
                    handleChange={newText => setLastname(newText)} 
                    label={'Last Name'} 
                    placeholder={'last name...'} 
                    autoFocus={false}
                    autoComplete={'family-name'}
                    autoCapitalize={'words'}
                    textContentType={'familyName'} 
                />

                {/* EMAIL INPUT */}
                <CustomTextInput 
                    handleChange={newText => setEmail(newText)} 
                    label={'Email'} 
                    placeholder={'example@email.com...'} 
                    autoFocus={false} 
                    autoComplete={'email'}
                    inputMode={'email'}
                    textContentType={'emailAddress'} 
                />

                {/* PASSWORD INPUT */}
                <CustomTextInput 
                    handleChange={newText => setPassword(newText)} 
                    label={'Password'} 
                    placeholder={'password...'} 
                    autoFocus={false} 
                    autoComplete={'new-password'}
                    secureTextEntry={true}
                    textContentType={'password'} 
                />
                {/* SUBMIT BUTTON */}
                <CustomButton text={'Create Account'} onPressFunction={createUser} />

                {/* NAVIGATION BUTTON */}
                <Button
                    title="Already have an account?"
                    onPress={() =>
                        navigation.navigate('Login')
                    }
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: '#000000'
    },
    userDetails: {
        width: '100%',
    }
});