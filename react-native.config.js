module.exports = {
	dependencies: {
		'@react-native-community/picker': {
			platforms: {
				android: null, // disable Android platform, other platforms will still autolink if provided
			},
		},
		'react-native-video': {
            platforms: {
                android: {
                    sourceDir: '../node_modules/react-native-video/android-exoplayer',
                },
            },
        }
	},
};
