import { StyleSheet, Text, View, useColorScheme } from "react-native";

export default function UserDetails({ label, detail }) {

    const theme = useColorScheme();
    const isDarkMode = theme === 'dark';

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: '#cbd5e1' }]}>{label}</Text>
            <Text style={[styles.detail, { color: isDarkMode ? '#fff' : '#000' }]}>{detail}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        
    },
    label: {
        width: '65%',
        marginTop: 6,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    detail: {
        height: 40,
        margin: 6,
        borderWidth: 2,
        padding: 10,
        paddingHorizontal: 20,
        borderColor: '#4F46E5',
        borderRadius: 12,
        width: '75%',
        marginLeft: 'auto',
        marginRight: 'auto',
    }
})