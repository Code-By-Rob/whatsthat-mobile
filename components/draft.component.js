import {
    AntDesign,
    MaterialIcons
} from '@expo/vector-icons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function Draft({ message, draftIndex, handleSetDraftAsMessage, handleDeleteDraft, handleScheduleDraftMessage }) {

    const [flip, setFlip] = useState(false);
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);

    const setupScheduleMessage = () => {
        const differenceInMS = time - Date.now();
        console.log(Date.now());
        console.log(new Date(time));
        console.log('logging time: ', time);
        console.log('logging time: ', differenceInMS);
        console.log('logging time: ', differenceInMS*60);
        setTime(null);
        handleScheduleDraftMessage(draftIndex, differenceInMS);
    }

    return (
        <View style={styles.container}>
            {
                !flip && (
                    <Text style={{ color: '#fff' }}>{message}</Text>
                )
            }
            <View style={{ flexDirection: 'row', gap: 12, marginHorizontal: 32 }}>
                {
                    flip ? 
                    <View style={{flexDirection: 'row', gap: 12}}>
                        <RNDateTimePicker
                            themeVariant='dark'
                            value={date ? new Date(date) : new Date()}
                            mode='date'
                            minimumDate={new Date()}
                            onChange={(obj) => setDate(obj.nativeEvent.timestamp)}
                            positiveButton={{label: 'OK', textColor: 'green'}}
                        />
                        <RNDateTimePicker
                            themeVariant='dark'
                            value={time ? new Date(time) : new Date()}
                            mode='time'
                            minimumDate={new Date()}
                            onChange={(obj) => setTime(obj.nativeEvent.timestamp)}
                            positiveButton={{label: 'OK', textColor: 'green'}}
                        />
                        <Pressable
                            onPress={setupScheduleMessage}
                        >
                            <MaterialIcons name='send' size={32} color={'#fff'} />
                        </Pressable>
                    </View>
                    :
                    <View style={{flexDirection: 'row', gap: 12}}>
                        <Pressable
                            onPress={() => setFlip(prev => !prev)}
                        >
                            <AntDesign name='calendar' size={32} color={'#fff'} />
                        </Pressable>
                        <Pressable
                            onPress={handleDeleteDraft}
                        >
                            <MaterialIcons name='delete' size={32} color={'#fff'} />
                        </Pressable>
                        <Pressable
                            onPress={handleSetDraftAsMessage}
                        >
                            <MaterialIcons name='edit' size={32} color={'#fff'} />
                        </Pressable>
                    </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1F2937',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 6,
        marginHorizontal: 12,
        borderRadius: 4,
        maxWidth: '60%'
    }
})