import {
    AntDesign
} from '@expo/vector-icons';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    TextInput,
    View,
    useColorScheme
} from 'react-native';

export default function ChatInput({ message, setMessage, sendMessage }) {

    const theme = useColorScheme();
    const isDarkMode = theme === 'dark';

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
            <TextInput
                style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
                onChangeText={setMessage}
                value={message}
                placeholder='message...'
                placeholderTextColor={'#4F46E5'}
                accessibilityLabel='message input'
                accessibilityHint='Enter your message to be sent to the group chat'
            />
            <Pressable 
                style={styles.sendButton}
                accessible={true}
                accessibilityLabel='Send your message'
                accessibilityHint='Sends your current message to the group chat'
                accessibilityRole='button'
                onPress={sendMessage}
                >
                <AntDesign name='rightcircleo' size={32} color={'#4F46E5'} />
            </Pressable>
        </View>
    )
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        height: 48,
        width: windowWidth,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#fff',
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 20
        },
        shadowRadius: 40
    },
    input: {
        borderRadius: 8,
        width: '80%',
        height: 36,
        borderWidth: 1,
        padding: 10,
        borderWidth: 2,
        borderColor: '#4F46E5'
    },
    sendButton: {
        marginHorizontal: 14,
    }
})