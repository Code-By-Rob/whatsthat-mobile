import { Image, StyleSheet, Text, View } from "react-native";
import { serverURL } from "../utils/enums.util";
const getUserImage = serverURL + '/user'; // var serverURL => './utils/enums.util.js'

/**
 * 
 * @param {String} name 
 * @param {Number} chat_id
 * @param {Object} last_message
 * @returns Chat Feed Component for Chats Screen
 */
export default function Chatfeed({
    name,
    chat_id,
    creator,
    last_message
}) {

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        return hours + ':' + minutes + ':' + seconds;
    }

    return (
        <View style={styles.container}>
            <View style={styles.image}>
                {/* Show latest chatter's image */}
                {/* <Text>Image</Text> */}
                {
                    creator?.user_id ? 
                    // <Image style={styles.channelImage} source={require(`${getUserImage}/${creator.user_id}/photo`)} />
                    <Image style={styles.channelImage} source={require('../assets/avataaars.png')} />
                    :
                    <Image style={styles.channelImage} source={require('../assets/avataaars.png')} />
                }
            </View>
            <View style={styles.channel}>
                {/* Show channel name & last_message */}
                {
                    name ?
                    <Text style={styles.channelName}>{name}</Text>
                    :
                    <Text style={styles.channelName}>Channel name</Text>
                }
                {
                    last_message?.message ?
                    <Text style={styles.lastMessage}>{last_message?.message}</Text>
                    :
                    <Text style={styles.lastMessage}>No Messages</Text>
                }
            </View>
            <View style={styles.timestamp}>
                {/* Show last_message timestamp */}
                {
                    last_message ? 
                    <Text style={styles.text}>{last_message?.timestamp ? formatTimestamp(last_message?.timestamp) : '-'}</Text>
                    :
                    <Text>Time</Text>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 8,
        maxHeight: 96,
        // backgroundColor: '#00000020'
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#00000040'
    },
    channelImage: {
        width: 64,
        height: 64,
    },
    channel: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        paddingHorizontal: 24,
        // backgroundColor: '#00000040'
    },
    channelName: {
        fontSize: 18,
        color: '#4F46E5',
        fontWeight: '600'
    },
    lastMessage: {
        fontSize: 12,
        color: '#4F46E5',
        opacity: .8,
        fontWeight: '400'
    },
    timestamp: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 12,
        // backgroundColor: '#00000020'
    },
    text: {
        fontSize: 12,
        color: '#4F46E5',
        opacity: .8,
        fontWeight: '400'
    }
})