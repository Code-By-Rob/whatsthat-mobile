import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';

export default function ChatHeader({}) {
    return (
        <View style={styles.header}>
            <Pressable onPress={() => console.log('Create chat!')}>
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
        backgroundColor: '#00000060',
        alignItems: 'center',
        paddingHorizontal: 24
    },
    button: {
        width: 32,
        height: 32,
    }
})