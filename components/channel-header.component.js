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
                <Ionicons name='arrow-back' size={24} color="black" />
            </Pressable>
            <Text>{name}</Text>
            <Pressable onPress={() => navigation.navigate('ChannelSettings', { chat_id: chat_id })}>
                <Entypo name='dots-three-vertical' size={24} color="black" />
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
        backgroundColor: '#1F2937',
        alignItems: 'center',
        paddingHorizontal: 24
    },
    button: {
        width: 32,
        height: 32,
    }
})