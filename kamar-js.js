const {
    version
} = require('./package'),
    axios = require('axios'),
    qs = require('qs'),
    parser = require('fast-xml-parser'),
    moment = require('moment-timezone');

class Kamar {
    constructor({
        portal,
        year = new Date().getFullYear(),
        TT,
        UserAgent = `Kamar-JS v${version}`,
        timezone = 'Pacific/Auckland',
        calender = undefined,
        timeout = 10000
    }) {
        if (!portal)
            throw new Error('portal URL must be provided. e.g. `demo.school.kiwi` ');
        this.year = year;
        this.TT = TT || (this.year + 'TT');
        this.portal = portal;
        this.UserAgent = UserAgent;
        this.calender = calender;
        this.timezone = timezone;
        this.timeout = timeout;
        // ^ We need to be flexible for Chatham Is., Cook Is., Tokelau, & Niue, which
        //   are all part of NZ but in a different timezone, which can cause issues.

        moment.tz.setDefault(this.timezone);
        moment.locale('en-nz');
    }

    /**
     * Logins into the Kamar API and returns a credentials object
     * @param  {String} username The student's Kamar login username
     * @param  {String} password The student's Kamar login password
     * @return {credentials} Returns a new credentials object from the logon result
     */
    logon(username, password) {
        return this.sendCommand({
            Command: 'Logon',
            Key: 'vtku',
            Username: username,
            Password: password
        }).then(credentials => {
            if (credentials.LogonResults.Success && credentials.LogonResults.Success == 'YES')
                return {
                    username,
                    'studentID': credentials.LogonResults.CurrentStudent,
                    'key': credentials.LogonResults.Key,
                    'accessLevel': credentials.LogonResults.AccessLevel
                };
            throw credentials.LogonResults.Error;
        });
    }

    /**
     * Gets the student's school calender information
     * @param  {Object} credentials The student's Kamar login username
     * @return {Calender} Returns a new Calender Week object
     */
    getCalendar(credentials) {
        return this.sendCommand({
            Command: 'GetCalendar',
            Key: credentials.key,
            Year: this.year
        }).then(calender => {
            this.calender = calender.CalendarResults.Days;

            return calender.CalendarResults.Days.Day.find(Days => Days.Date === this.getDateFormat())
            throw calender.CalendarResults.Error;
        });
    }

     /**
     * Gets the student's timetable of the current day
     * @param  {Object} credentials The student's Kamar login object, can be obtained using kamar.logon()
     * @param  {Object} calender The student's calender object
     * @return {Timetable} Returns an array of the periods for the current day
     */
    getTimetable(credentials, calender) {
        return this
            .sendCommand({
                Command: 'GetStudentTimetable',
                Key: credentials.key,
                studentID: credentials.studentID,
                Grid: this.TT
            })
            .then((timetable) => {
                return this.sendCommand({
                    Command: 'GetGlobals',
                    Key: credentials.key
                }).then((response) => {
                    let weekDay = (calender.DayTT > 5) ? calender.DayTT - 5 : calender.DayTT
                    let x = timetable.StudentTimetableResults.Students.Student.TimetableData[`W${calender.Week}`][`D${weekDay}`]
                    let count = 0;

                    const day = [];
                    
                    x.split('|').slice(2, -2).forEach((z) => {
                        var period = z.split('-');
                        count++;

                        day.push({
                            Class: period[2],
                            Room: period[4],
                            Teacher: period[3],
                            Time: response.GlobalsResults.StartTimes.Day[1].PeriodTime[count]
                        });
                    })

                    return day
                })
            })
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

    getDateFormat() {
        return new Date().toISOString().slice(0, 10)
    }
}

// expose the class
module.exports = Kamar;