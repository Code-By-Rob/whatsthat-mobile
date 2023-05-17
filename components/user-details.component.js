import { StyleSheet, Text, View } from "react-native"

export default function UserDetails({ label, detail }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.detail}>{detail}</Text>
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
        color: '#cbd5e1'
    },
    detail: {
        height: 40,
        margin: 6,
        borderWidth: 2,
        padding: 10,
        paddingHorizontal: 20,
        borderColor: '#4F46E5',
        borderRadius: 12,
        color: '#ffffff',
        width: '75%',
        marginLeft: 'auto',
        marginRight: 'auto',
    }
})