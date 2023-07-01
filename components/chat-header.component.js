import { Dimensions, Image, Pressable, StyleSheet, View, useColorScheme } from 'react-native';

export default function ChatHeader({ showModal = () => console.log('Create chat!') }) {

    const theme = useColorScheme();
    const isDarkMode = theme === 'dark';

    return (
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
            <Pressable
                onPress={showModal}
                accessible={true}
                accessibilityLabel='Channel Creation'
                accessibilityHint='Opens a modal that allows you to create a channel'
                accessibilityRole='button'
            >
                <Image 
                    style={styles.button}
                    source={require('../assets/write.png')}
                />
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 24,
        shadowColor: '#fff',
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 20
        },
        shadowRadius: 40
    },
    button: {
        width: 32,
        height: 32,
    }
})