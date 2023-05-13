import { View, Text, StyleSheet } from 'react-native';

export default function FlashError({ errorMessage, resolutionMessage }) {
    /**
     * resolutionMessage should be an array that 
     * contains information that allows the user
     * to understand what they can do to resolve
     * the problem.
     * So, the resolutionMessage should be an array of String.
     */

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Something went wrong!</Text>
            {
                errorMessage.map((err, index) => (
                    <Text key={index} style={styles.problem}>{`\u2022 ${err}`}</Text>
                ))
            }
            {
                !resolutionMessage.length > 0 ?
                null
                :
                <View>
                    <Text style={styles.title}>Please ensure the following:</Text>
                    {
                        /**
                         * https://stackoverflow.com/questions/39110460/react-native-unordered-style-list
                         * The above resource explains how to create an <ul> style component.
                         */
                        resolutionMessage.map((msg, index) => {
                            return (
                                /**
                                 * NOTE: The below should be a bullet point list.
                                 * See if there are native components which can do 
                                 * this for me.                        
                                 */
                                <Text style={styles.solution} key={index}>{`\u2022 ${msg}`}</Text>
                            )
                        })
                    }
                </View>
            }
        </View>
    )
}
/**
 * Container should have the following properties:
 * - background colour opaque pastel red
 * - rounded corners
 * - left-aligned text
 * - padding
 * - centre aligned in parent container
 */
const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderColor: '#F87171',
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 24,
        paddingVertical: 16,
        marginVertical: 12,
    },
    title: {
        fontSize: 18,
        color: '#B91C1C',
        marginVertical: 6,
    },
    problem: {
        color: '#DC2626',
        paddingHorizontal: 16,
    },
    solution: {
        color: '#DC2626',
        paddingHorizontal: 16,
    }
})