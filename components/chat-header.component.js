import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';

export default function ChatHeader({ showModal = () => console.log('Create chat!') }) {
    return (
        <View style={styles.header}>
            <Pressable onPress={showModal}>
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
        backgroundColor: '#000000',
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