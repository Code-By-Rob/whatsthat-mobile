import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import ChannelHeader from "../components/channel-header.component";

export default function ChannelSettings({ navigation }) {
    return (
        <View style={styles.container}>
            <ChannelHeader navigation={navigation} />
            <Text>Channel Settings</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 60,
    }
})