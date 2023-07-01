import { Dimensions, StyleSheet, View, useColorScheme } from 'react-native';

export default function UserSettingsHeader() {

    const theme = useColorScheme();
    const isDarkMode = theme === 'dark';

    return (
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#00000060' : '#fff' }]}>
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
        alignItems: 'center',
        paddingHorizontal: 24
    },
    button: {
        width: 32,
        height: 32,
    }
})