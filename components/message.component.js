import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const avatarImageSize = 36;
const verticalMessageMargin = 4;

export default function Message({ message, message_id, isUser, timestamp, handleModal }) {

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        return hours + ':' + minutes + ':' + seconds;
    }

    return (
        <View style={ isUser ? styles.isUserContainer : styles.notUserContainer}>
            <Image style={styles.messageImage} source={require('../assets/avataaars.png')} />
            <Pressable onPress={() => handleModal(message, message_id)}>
                <View style={isUser ? styles.isUserMessage : styles.notUserMessage}>
                    <Text style={styles.message}>{message}</Text>
                    <Text style={ isUser ? styles.userMessageTimestamp : styles.messageTimestamp}>{formatTimestamp(timestamp)}</Text>
                </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    notUserContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    isUserContainer: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center'
    },
    notUserMessage: {
        backgroundColor: '#4F46E5',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
        flexDirection: 'column',
        marginVertical: verticalMessageMargin,
    },
    isUserMessage: {
        backgroundColor: '#1F2937',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,
        alignSelf: 'flex-end',
        flexDirection: 'column',
        marginVertical: verticalMessageMargin,
    },
    message: {
        color: '#fff'
    },
    messageTimestamp: {
        color: '#fff',
        fontSize: 8,
        fontWeight: '300',
    },
    userMessageTimestamp: {
        color: '#fff',
        fontSize: 8,
        fontWeight: '300',
        alignSelf: 'flex-end'
    },
    messageImage: {
        width: avatarImageSize,
        height: avatarImageSize,
        marginHorizontal: 8
    }
})