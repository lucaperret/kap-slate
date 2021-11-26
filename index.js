const fs = require('fs');
const FormData = require('form-data');

const action = async context => {
	const endpoint = 'https://uploads.slate.host/api/public';
	const filePath = await context.filePath();

	context.setProgress('Uploading…');

	const form = new FormData();
	form.append('data', fs.createReadStream(filePath));

	const response = await context.request(endpoint, {
		method: 'post',
		headers: {
			Authorization: context.config.get('apiKey')
		},
		body: form
	});
	const data = JSON.parse(response.body).data;
	context.copyToClipboard(`https://slate.textile.io/ipfs/${data.cid}`);
	context.notify(
		`URL to the ${context.prettyFormat} has been copied to the clipboard`
	);
};

const config = {
	apiKey: {
		title: 'API key',
		type: 'string',
		minLength: 41,
		default: '',
		required: true
	}
};

const slate = {
	title: 'Share on Slate',
	configDescription: 'Create your API key here: https://slate.host/_/api',
	formats: ['gif', 'mp4', 'webm', 'apng'],
	action,
	config
};

exports.shareServices = [slate];
