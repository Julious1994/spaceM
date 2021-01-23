import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Typography from "../../components/Typography";
import Icon from "react-native-vector-icons/MaterialIcons";
import Modal from 'react-native-modal';


function VideoModal(props) {
    const { isLandscape, list, selectedQuality } = props;
    return (
        props.open ? <Modal
            style={{ width: '100%', height: '100%', flex: 1, margin: 0}}
            isVisible={props.open}
            backdropColor="#000"
            onBackButtonPress={props.onClose}
            supportedOrientations={['portrait', 'landscape']}
            onBackdropPress={props.onClose}
        >
            <View style={styles.container}>
                <Typography variant="title3" style={styles.title}>Choose Quality</Typography>
                {list.length === 0 && <TouchableOpacity style={styles.row}>
                    <Typography variant="title2">Auto</Typography>
                    <Icon name="check" color="#fff" size={32} />
                </TouchableOpacity>}
                {
                    list.map((item, i) => (
                        <TouchableOpacity key={i} style={[styles.row, i === list.length - 1 && styles.noBorder]} onPress={() => {
                            console.log('reeee')
                            props.onQualityChange(item)}}>
                            <Typography variant="title3">{item.Quality} p</Typography>
                            {selectedQuality.Quality === item.Quality && <Icon name="check" color="#fff" size={32} />}
                        </TouchableOpacity>
                    ))
                }
            </View>
        </Modal> : null
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        // minHeight: '50%',
        height: '50%',
        padding: 10,
        // marginTop: 'auto',
        width: '100%',
        backgroundColor: '#000F24',
        zIndex: 10001,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        // backgroundColor: 'red',
        borderBottomColor: 'rgba(102, 111, 123, 0.5)',
		borderBottomWidth: 1,
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    title: {

    },
});

export default VideoModal;
