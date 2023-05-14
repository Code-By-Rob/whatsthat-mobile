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
                placeholderTextColor={'#ffffff60'}
            />
            <Pressable style={styles.sendButton} onPress={sendMessage}>
                <AntDesign name='rightcircleo' size={24} color={'#fff'} />
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
        backgroundColor: '#1F2937',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        borderRadius: 8,
        width: '80%',
        height: 36,
        borderWidth: 1,
        padding: 10,
        color: '#fff'
    },
    sendButton: {
        marginHorizontal: 14,
    }
})