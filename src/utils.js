import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import imageMapper from './images/imageMapper';
import {Dimensions} from 'react-native';

export function sharePDFWithAndroid(fileUrl, type) {
	let filePath = null;
	let file_url_length = fileUrl.length;
	const configOptions = {fileCache: true};
	return RNFetchBlob.config(configOptions)
		.fetch('GET', fileUrl)
		.then((resp) => {
			filePath = resp.path();
			return resp.readFile('base64');
		})
		.then(async (base64Data) => {
			base64Data = `data:${type};base64,` + base64Data;
			// await Share.open({ url: base64Data });
			await RNFS.unlink(filePath);
			return base64Data;
			// remove the image or pdf from device's storage
		});
}

export const getUri = (item, i) => {
	return item.ThumbnailPath
		? {uri: `https://spacem.azurewebsites.net/${item.ThumbnailPath}`}
		: imageMapper.landscapeMovie.source;
};

export function getInitial(txt = '') {
	if(!txt) {
		txt = 's';
	}
	return txt.substring(0, 1).toUpperCase();
}

export const isLandscape = () => {
	const dim = Dimensions.get('screen');
	if (dim.width >= dim.height) {
		return true;
	}
	return false;
};
