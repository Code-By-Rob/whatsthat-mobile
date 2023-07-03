import {
    AntDesign
} from '@expo/vector-icons';
import {
    Pressable,
    StyleSheet,
    TextInput,
    View,
    useColorScheme
} from 'react-native';

export default function SearchInput({ handleChangeText, search, query, accessibilityLabel, accessibilityHint }) {

    const theme = useColorScheme();
    const isDarkMode = theme === 'dark';

    return (
        <View style={[styles.searchContainer, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
            <TextInput 
                style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
                placeholder={'Search...'}
                placeholderTextColor={'#475549'}
                autoCorrect={true}
                autoCapitalize={'words'}
                onChangeText={handleChangeText}
                value={query}
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
                // onPressIn={() => setFlag(tabsFlagOptions['search'])}
            />
            <Pressable
                onPress={search}
                style={styles.searchButton}
                accessible={true}
                accessibilityLabel='Search'
                accessibilityHint='Initiates the search for the entered text'
                accessibilityRole='button'
            >
                <AntDesign name='rightcircleo' size={32} color={'#4F46E5'} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
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
        width: '70%',
    },
    searchButton: {
        width: '20%',
        marginRight: 'auto',
        justifyContent: 'center',
        alignItems: 'center'
    },
})