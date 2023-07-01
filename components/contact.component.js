import {
    Entypo,
    Ionicons
} from '@expo/vector-icons';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
    useColorScheme
} from "react-native";

export default function Contact({ first_name, last_name, image, user_id, addContact, removeContact, blockContact, unblockContact, isContact, isBlocked }) {

    const theme = useColorScheme();
    const isDarkMode = theme === 'dark';

    return (
        <View style={styles.contactContainer}>
            {/* User's Image */}
            <Image style={styles.userImage} source={image ? { uri: image } : require('../assets/avataaars.png')} />
            {/* User's name */}
            <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>{ first_name + ' ' + last_name }</Text>
            {
                isBlocked || isContact ? 
                null
                :
                <Pressable
                    onPress={() => addContact(user_id)}
                    style={styles.greenButton}
                    accessible={true}
                    accessibilityLabel='Add Contact'
                    accessibilityHint='Adds this contact to your contact list'
                    accessibilityRole='button'
                >
                    <Ionicons name='person-add-outline' style={{color: '#fff'}} size={18} />
                </Pressable>
            }
            {
                isContact ? 
                <Pressable
                    onPress={() => removeContact(user_id)}
                    style={styles.redButton}
                    accessible={true}
                    accessibilityLabel='Remove contact'
                    accessibilityHint='Removes this contact from your contact list'
                    accessibilityRole='button'
                >
                    <Ionicons name='person-remove-outline' style={{color: '#fff'}} size={18} />
                </Pressable>
                :
                null
            }
            {
                isBlocked ? 
                <Pressable
                    onPress={() => unblockContact(user_id)}
                    style={{paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#f00', borderRadius: 5,}}
                    accessible={true}
                    accessibilityLabel='Unblock contact'
                    accessibilityHint='Unblocks the contact from your blocked contacts list'
                    accessibilityRole='button'
                >
                    <Text style={{color: '#fff'}}>Unblock</Text>
                </Pressable>
                :
                <Pressable
                    onPress={() => blockContact(user_id)}
                    style={styles.redButton}
                    accessible={true}
                    accessibilityLabel='Block contact'
                    accessibilityHint='Blocks the contact adding them to your blocked list'
                    accessibilityRole='button'
                >
                    <Entypo name='block' style={{color: '#fff'}} size={18} />
                </Pressable>
            }
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
    userImage: {
        width: 48,
        height: 48,
        borderRadius: 80,
    }
})