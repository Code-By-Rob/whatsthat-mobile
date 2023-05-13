import { View, Text, StyleSheet } from "react-native"

export default function UserDetails({ label, detail }) {
    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <Text>{detail}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: '12',
        color: '#e4e4e4',
    },
    detail: {
        backgroundColor: '#4F46E5',
        fontSize: '20',
        color: '#ffffff'
    }
})