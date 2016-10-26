import _ from 'lodash';
import fs from 'fs';
import request from 'request';

function forward(url, options) {
    this.assert('string' === typeof url, 500, 'first parameter must be a url string');
    options = options || {};

    options.method = options.method || this.method;
    options.headers = _.merge({
        'token': '1111'
    }, _.pick(this.header, ['accept', 'accept-language', 'accept-encoding', 'content-type', 'cookie']));
    options.qs = options.qs || this.query;

    switch (this.is('json', 'multipart/form-data', 'urlencoded')) {
        case 'json':
            options.body = options.body || this.request.body;
            options.body = options.body.fields;
            options.json = true;
            break;
        case 'multipart/form-data':
            var body = this.request.body;
            var files = body.files || {};
            var fields = body.fields || {};
            if (!options.formData) {
                options.formData = {};

                Object.keys(files).forEach(function(filename) {
                    options.formData[filename] = {
                        value: fs.createReadStream(files[filename].path),
                        options: {
                            filename: files[filename].name,
                            contentType: files[filename].type
                        }
                    };
                });
                Object.keys(fields).forEach(function(item) {
                    options.formData[item] = fields[item];
                });
            }
            break;
        case 'urlencoded':
            options.form = options.form || this.request.body.fields;
            break;
        default:
            if (!~['HEAD', 'GET', 'DELETE'].indexOf(options.method)) {
                options.body = options.body || this.request.body.fields;
            }
    }

    this.respond = false;

    const self = this;
    // TODO: 这里的出错应该处理成502
    request(url, options).on('error', function(err) {
        self.app.emit('error', err, self);
        err.status = 502;
        // self.throw(err);
        self.res.statusCode = err.status;
        self.res.end(JSON.stringify({
            message: err.status,
            code: err.status
        }));
    }).pipe(this.res);
}

export default function(app, config) {
    console.log('---------- Extensions: backend ----------');

    app.context.forward = forward;

    const backendPattern = /^(\/backend)\/(\w*)(\/(.*)?)?/i;

    return function*(next) {
        const matched = backendPattern.exec(this.url);
        if (matched) {
            const backendService = matched[2].toLowerCase();
            const backednAPIUrl = matched[4];
            this.forward('http://m.maoyan.com/cinemas.json');  // 这里需要处理转发逻辑
        } else {
            yield next;
        }
    }
}
