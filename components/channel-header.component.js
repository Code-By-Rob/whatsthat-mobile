import {
    Entypo,
    Ionicons
} from '@expo/vector-icons';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View,
    useColorScheme
} from 'react-native';

export default function ChannelHeader({ navigation, name, chat_id }) {

    const theme = useColorScheme();
    const isDarkMode = theme === 'dark';

    return (
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
            <Pressable 
                onPress={() => navigation.goBack()}
                accessible={true}
                accessibilityLabel='Go back'
                accessibilityHint='Navigates to the previous screen'
                accessibilityRole='button'
            >
                <Ionicons name='arrow-back' size={24} color="#4F46E5" />
            </Pressable>
            <Text style={styles.text}>{name}</Text>
            <Pressable 
                onPress={() => navigation.navigate('ChannelSettings', { chat_id: chat_id })}
                accessible={true}
                accessibilityLabel='Go to channel settings'
                accessibilityHint='Navigates to the channel settings screen'
                accessibilityRole='button'
            >
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