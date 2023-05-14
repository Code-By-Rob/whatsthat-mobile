import { Dimensions, StyleSheet, View } from 'react-native';

export default function UserSettingsHeader() {
    return (
        <View style={styles.header}>
            {/* <Text>User Settings</Text> */}
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