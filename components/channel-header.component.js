import {
    Entypo,
    Ionicons
} from '@expo/vector-icons';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function ChannelHeader({ navigation, name, chat_id }) {
    return (
        <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()}>
                <Ionicons name='arrow-back' size={24} color="#4F46E5" />
            </Pressable>
            <Text style={styles.text}>{name}</Text>
            <Pressable onPress={() => navigation.navigate('ChannelSettings', { chat_id: chat_id })}>
                <Entypo name='dots-three-vertical' size={24} color="#4F46E5" />
            </Pressable>
        </View>
    )
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    header: {
        width: windowWidth,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#000',
        alignItems: 'center',
        paddingHorizontal: 24,
        shadowColor: '#fff',
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 40
    },
    button: {
        width: 32,
        height: 32,
    },
    text: {
        color: '#4F46E5'
    }
})