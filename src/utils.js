import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

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
