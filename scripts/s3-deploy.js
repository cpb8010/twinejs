#!/bin/node
const fs = require('fs');
const path = require('path');

const S3 = require('aws-sdk/clients/s3');
const walkSync = require('walk-sync');

const deploy_bucket = process.env.DEPLOY_BUCKET || process.argv[2];

const key_prefix = process.env.BUCKET_PATH || process.argv[3];

const s3 = new S3({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY});
const build_folder = process.env.BUILD_FOLDER || "./dist/web-cdn";
const files = walkSync(build_folder, { directories: false });

files.forEach(function (fileName) {
	const body = fs.createReadStream(path.join(build_folder, fileName));
	const params = {Bucket: deploy_bucket, Key: (key_prefix || "") + fileName, Body: body, ACL: "public-read"};

	s3.upload(params, function(err, data) {
		console.error(err, data);
	});
});
