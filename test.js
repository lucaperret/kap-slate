const test = require('ava');
const kapPluginTest = require('kap-plugin-test');

test('request and copy to clipboard', async t => {
	const config = {
		apiKey: 'SLA45f93e6b-8453-41df-918d-f8da9d448a9bTE'
	};

	const plugin = kapPluginTest('unicorn.gif', {config});
	plugin.context.request.resolves({
		body: '{"data": {"cid":"ipfsCID"}}'
	});
	await plugin.run();

	t.is(
		plugin.context.request.lastCall.args[0],
		'https://uploads.slate.host/api/public'
	);
	const request = plugin.context.request.lastCall.args[1];
	delete request.body;
	t.deepEqual(request, {
		method: 'post',
		headers: {
			Authorization: config.apiKey
		}
	});
	t.true(
		plugin.context.copyToClipboard.calledWith(
			'https://slate.textile.io/ipfs/ipfsCID'
		)
	);
});
