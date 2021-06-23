const {version} = require('./package');
const axios = require('axios');
const qs = require('qs');
const parser = require('fast-xml-parser');
const moment = require('moment-timezone');

class Kamar {
  constructor({
    portal,
    year = new Date().getFullYear(),
    TT,
    UserAgent = `Kamar-JS v${version}`,
    timezone = 'Pacific/Auckland',
    calender = undefined,
    globals = undefined,
    timeout = 10000,
  }) {
    if (!portal) {
      throw new Error('portal URL must be provided. e.g. `demo.school.kiwi` ');
    }
    this.year = year;
    this.TT = TT || this.year + 'TT';
    this.portal = portal;
    this.UserAgent = UserAgent;
    this.calender = calender;
    this.globals = globals;
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
    return new Promise((resolve, reject) => {
      this.sendCommand({
        Command: 'Logon',
        Key: 'vtku',
        Username: username,
        Password: password,
      }).then(credentials => {
        try {
          if (this.checkCommonErrors(credentials.LogonResults) != false)
            throw this.checkCommonErrors(credentials.LogonResults);

          if (credentials.LogonResults.Success === 'YES') {
            resolve({
              username,
              studentID: credentials.LogonResults.CurrentStudent,
              key: credentials.LogonResults.Key,
              accessLevel: credentials.LogonResults.AccessLevel,
            });
          }

          reject(new Error(credentials.LogonResults.Error));
        } catch (error) {
          reject(new Error(error));
        }
      });
    });
  }

  /**
   * Gets the student's school calender information
   * @param  {Object} credentials The student's Kamar login username
   * @return {Calender} Returns a new Calender Week object
   */
  getCalendar(credentials) {
    return new Promise((resolve, reject) => {
      this.sendCommand({
        Command: 'GetCalendar',
        Key: credentials.key,
        Year: this.year,
      }).then(calender => {
        try {
          if (this.checkCommonErrors(calender.CalendarResults) != false)
            throw this.checkCommonErrors(calender.CalendarResults);

          resolve(
            calender.CalendarResults.Days.Day.find(
              Days => Days.Date === moment().format('YYYY-MM-D')
            )
          );
        } catch (error) {
          reject(new Error(error));
        }
      });
    });
  }

  /**
   * Gets the student's timetable of the current week
   * @param  {Object} credentials The student's Kamar login object, can be obtained using kamar.logon()
   * @param  {Object} calender The student's calender object
   * @return {Timetable} Returns an array of the periods for the current week
   */
  getTimetable(credentials, calender) {
    return new Promise((resolve, reject) => {
      this.sendCommand({
        Command: 'GetStudentTimetable',
        Key: credentials.key,
        studentID: credentials.studentID,
        Grid: this.TT,
      }).then(timetable => {
        this.sendCommand({
          Command: 'GetGlobals',
          Key: credentials.key,
        }).then(globals => {
          try {
            if (
              this.checkCommonErrors(timetable.StudentTimetableResults) != false
            )
              throw this.checkCommonErrors(timetable.StudentTimetableResults);
            if (this.checkCommonErrors(globals.GlobalsResults) != false)
              throw this.checkCommonErrors(globals.GlobalsResults);

            const periodWeek =
              timetable.StudentTimetableResults.Students.Student.TimetableData[
                `W${calender.Week}`
              ];

            const week = [];
            for (let weekDay = 1; weekDay <= 5; weekDay++) {
              const day = [];

              periodWeek[`D${weekDay}`]
                .split('|')
                .slice(2, -2)
                .forEach((periods, index) => {
                  const period = periods.split('-');

                  day.push({
                    Class: period[2],
                    Room: period[4],
                    Teacher: period[3],
                    Time: globals.GlobalsResults.StartTimes.Day[1].PeriodTime[
                      index
                    ],
                  });
                });

              week.push(day);
            }
            resolve(week);
          } catch (error) {
            reject(new Error(error));
          }
        });
      });
    });
  }

  getNotices(credentials) {
    return new Promise((resolve, reject) => {
      this.sendCommand({
        Command: 'GetNotices',
        Key: credentials.key,
        Date: moment().format('L'),
        ShowAll: 'YES',
      }).then(notices => {
        try {
          if (this.checkCommonErrors(notices.NoticesResults) != false)
            throw this.checkCommonErrors(notices.NoticesResults);

          resolve({
            meeting: notices.NoticesResults.MeetingNotices.Meeting,
            general: notices.NoticesResults.GeneralNotices.General,
          });
        } catch (error) {
          resolve(new Error(error));
        }
      });
    });
  }

  // This is the main request handler for the Kamar API, functions pass a command, key and
  // any extra arguments
  sendCommand(form) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: `https://${this.portal}/api/api.php`,
        data: qs.stringify(form),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': this.UserAgent,
          Origin: 'file://',
          'X-Requested-With': 'nz.co.KAMAR',
        },
      })
        .then(response => resolve(parser.parse(response.data)))
        .catch(error => reject(error));
    });
  }

  checkCommonErrors(response) {
    switch (response.ErrorCode) {
      case -2:
        return 'Key Missing';
      case -3:
        return 'Invalid Key';
      case -4:
        return 'Unknown Page';
      case -7:
        return 'Access Denied';
      default:
        return false;
    }
  }
}

// expose the class
module.exports = Kamar;
