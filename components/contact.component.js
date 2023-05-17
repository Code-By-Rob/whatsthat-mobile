import {
    Entypo,
    Ionicons
} from '@expo/vector-icons';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import { serverURL } from '../utils/enums.util';
const updateChannelUrl = serverURL + '/chat/'
const userDataUrl = serverURL + '/user/';

export default function Contact({ first_name, last_name, image, user_id, addContact, removeContact, blockContact, isContact }) {
    return (
        <View style={styles.contactContainer}>
            {/* User's Image */}
            <Image style={styles.userImage} source={image ? { uri: image } : require('../assets/avataaars.png')} />
            {/* User's name */}
            <Text style={styles.text}>{ first_name + ' ' + last_name }</Text>
            <Pressable onPress={() => addContact(user_id)} style={styles.greenButton}>
                <Ionicons name='person-add-outline' style={{color: '#fff'}} size={18} />
            </Pressable>
            {
                isContact ? 
                <Pressable onPress={() => removeContact(user_id)} style={styles.redButton}>
                    <Ionicons name='person-remove-outline' style={{color: '#fff'}} size={18} />
                </Pressable>
                :
                null
            }
            <Pressable onPress={() => blockContact(user_id)} style={styles.redButton}>
                <Entypo name='block' style={{color: '#fff'}} size={18} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    contactContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 8
    },
    greenButton: {
        backgroundColor: '#22c55e',
        borderRadius: 5,
        padding: 8,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center'
    },
    redButton: {
        backgroundColor: '#f00',
        borderRadius: 5,
        padding: 8,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#fff'
    },
    userImage: {
        width: 48,
        height: 48,
        borderRadius: 80,
    }
})