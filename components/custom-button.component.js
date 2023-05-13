import { View, Pressable, Text, StyleSheet } from 'react-native'

export default function CustomButton({ onPressFunction, text = 'Button' }) {
    return (
        <View>
            <Pressable style={styles.brandedStyles} onPress={onPressFunction}>
                <Text style={styles.buttonLabel}>{text}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    brandedStyles: {
        backgroundColor: '#4F46E5',
        width: '75%',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 12,
        borderRadius: 80,
        margin: 24,
    },
    buttonLabel: {
        color: '#ffffff',
        marginLeft: 'auto',
        marginRight: 'auto',
    }
})