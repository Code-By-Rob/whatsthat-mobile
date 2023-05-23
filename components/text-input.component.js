import { StyleSheet, Text, TextInput, View } from 'react-native'
/**
 * TODO: Add TextInput ToolTip prop => tooltip ? showToolTip : null
 * docs => https://reactnative.dev/docs/textinput
 * @param {*} param0 
 * @returns 
 */
export default function CustomTextInput({ 
    label, // Text input's label
    placeholder, // placeholder text :/
    autoFocus = false, // Focus the user's attention e.g., email focus!
    autoCorrect = false, // ducking auto correct
    autoCapitalize = 'none', // emails shouldn't have capital letters...
    handleChange, // onChangeText function
    keyboardType = 'default',
    inputMode = 'text', // Which keyboard to open?
    secureTextEntry = false, // Entering a password? I should be true!
    selectionColor = '#4F46E5', // Added quality
    textContentType = 'none',
    value,
}) {
    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <TextInput 
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={'#475549'}
                autoFocus={autoFocus}
                autoCorrect={autoCorrect}
                autoCapitalize={autoCapitalize}
                onChangeText={handleChange}
                keyboardType={keyboardType}
                inputMode={inputMode}
                secureTextEntry={secureTextEntry}
                selectionColor={selectionColor}
                textContentType={textContentType}
                value={value}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 6,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderWidth: 2,
        padding: 10,
        paddingHorizontal: 20,
        borderColor: '#4F46E5',
        borderRadius: 12,
        width: '75%',
        color: '#ffffff',
    },
    label: {
        width: '65%',
        marginTop: 6,
        marginLeft: 'auto',
        marginRight: 'auto',
        color: '#cbd5e1'
    }
})