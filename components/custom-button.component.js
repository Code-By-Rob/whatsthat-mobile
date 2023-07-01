import { Pressable, StyleSheet, Text, View } from 'react-native'

export default function CustomButton({ 
    onPressFunction, 
    text = 'Button', 
    accessible = true, 
    accessibilityLabel = 'Button',
    accessibilityHint = 'Button action',
    accessibilityRole = 'Button'
}) {
    return (
        <View>
            <Pressable
                style={styles.brandedStyles}
                onPress={onPressFunction}
                accessible={accessible}
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
                accessibilityRole={accessibilityRole}
            >
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
        margin: 12,
    },
    buttonLabel: {
        color: '#ffffff',
        marginLeft: 'auto',
        marginRight: 'auto',
    }
})