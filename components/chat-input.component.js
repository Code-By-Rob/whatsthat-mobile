import {
    AntDesign
} from '@expo/vector-icons';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    TextInput,
    View
} from 'react-native';

export default function ChatInput({ message, setMessage, sendMessage }) {

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setMessage}
                value={message}
                placeholder='message...'
                placeholderTextColor={'#4F46E5'}
            />
            <Pressable style={styles.sendButton} onPress={sendMessage}>
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
        backgroundColor: '#000',
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
        color: '#fff',
        borderWidth: 2,
        borderColor: '#4F46E5'
    },
    sendButton: {
        marginHorizontal: 14,
    }
})