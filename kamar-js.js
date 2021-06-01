const {
    version
} = require('./package'),
    axios = require('axios'),
    qs = require('qs'),
    parser = require('fast-xml-parser'),
    chalk = require('chalk'),
    moment = require('moment-timezone');

class Kamar {
    constructor({
        portal,
        year = new Date().getFullYear(),
        TT,
        UserAgent = `Kamar-JS v${version}`,
        timezone = 'Pacific/Auckland',
        calendar = undefined,
        timeout = 10000
    }) {
        if (!portal)
            throw new Error('portal URL must be provided. e.g. `demo.school.kiwi` ');
        this.year = year;
        this.TT = TT || (this.year + 'TT');
        this.portal = portal;
        this.UserAgent = UserAgent;
        this.calendar = calendar;
        this.timezone = timezone;
        this.timeout = timeout;
        // ^ We need to be flexible for Chatham Is., Cook Is., Tokelau, & Niue, which
        //   are all part of NZ but in a different timezone, whcih can cause issues.

        moment.tz.setDefault(this.timezone);
        moment.locale('en-nz');
    }

    /**
     * Add two numbers together
     * @param  {String} username The sstudent's Kamar login username
     * @param  {String} password The student's Kamar login password
     * @return {Student} Returns a new Student object from the logon result
     */
    logon(username, password) {
        return this.sendCommand({
            Command: 'Logon',
            Key: 'vtku',
            Username: username,
            Password: password
        }).then(credentials => {
            return {
                username,
                'StudentID': credentials.LogonResults.CurrentStudent,
                'key': credentials.LogonResults.Key,
                'AccessLevel': credentials.LogonResults.AccessLevel
            };
        });
    }

    sendCommand(form) {
        return new Promise((resolve, reject) => {
            axios({
                    method: 'post',
                    url: `https://${this.portal}/api/api.php`,
                    data: qs.stringify(form),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'User-Agent': this.UserAgent,
                        'Origin': 'file://',
                        'X-Requested-With': 'nz.co.KAMAR'
                    }
                }).then((response) => resolve(parser.parse(response.data)))
                .catch((error) => reject(error))
        })
    }
}

// expose the class
module.exports = Kamar;