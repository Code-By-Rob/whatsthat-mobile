import {
    AntDesign
} from '@expo/vector-icons'
import {
    Pressable,
    StyleSheet,
    TextInput,
    View
} from 'react-native'

export default function SearchInput({ handleChangeText, search, query }) {
    return (
        <View style={styles.searchContainer}>
            <TextInput 
                style={styles.input}
                placeholder={'Search...'}
                placeholderTextColor={'#475549'}
                autoCorrect={true}
                autoCapitalize={'words'}
                onChangeText={handleChangeText}
                value={query}
                // onPressIn={() => setFlag(tabsFlagOptions['search'])}
            />
            <Pressable onPress={search} style={styles.searchButton}>
                <AntDesign name='rightcircleo' size={32} color={'#4F46E5'} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    searchContainer: {
        backgroundColor: '#000',
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
        color: '#ffffff',
    },
    searchButton: {
        width: '20%',
        marginRight: 'auto',
        justifyContent: 'center',
        alignItems: 'center'
    },
})