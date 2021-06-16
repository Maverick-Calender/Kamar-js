# Kamar JS
![NPM](https://img.shields.io/npm/l/kamar-js) ![npm](https://img.shields.io/npm/v/kamar-js?label=Version) ![GitHub repo size](https://img.shields.io/github/repo-size/Maverick-Calender/Kamar-js) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/Maverick-Calender/Kamar-js) ![GitHub last commit](https://img.shields.io/github/last-commit/Maverick-Calender/Kamar-js)

Kamar JS is a flexible promise based api wrapper for the popular school management suite KAMAR

This is a passion project of a High School Student, so updates and bug fixes may not be the fastest however I will try my hardest to provide a powerful library for working with KAMAR

## Installation
You can start using Kamar JS by installing it from npm using
``` 
npm i kamar-js 
```

## Getting Started
You can create a new Kamar object by using 
```javascript
const Kamar = require('kamar-js'),
      kamar = new Kamar({ portal: 'demo.school.kiwi' });
```
This object has many options, here is a list of what it will accept

Parameter | Description | Default | Required
--------- | ----------- | -------- | -------
Portal | The url of your school's kamar website this is often something like `kamar.schoolname.nz` or `portal.schoolname.nz/kamar` There's no need to include `https://` and `/api/api.php` as these are added automatically when Kamar is defined | | Yes
Year | The year to use when returning time based Objects like the student's calender | Date().getFullYear() | No. Will use current year if not provided
User Agent | The user agent sent with the request headers | 'Kamar-JS v????' | No. Although it is recommended to have your application's name on this
Timezone | The timezone to use when converting timetable times between locations | Pacific/Auckland | No. Helpful for dealing with schools based in Fiji, The Cook Islands, etc
Calender | This is only to be used if you don't want to use `kamar.getCalender()` or already have one ready. Use at your own risk as your file must be formatted correctly | | No. In most cases `kamar.getCalender()` works
Timeout | The timeout for HTTPS requests in ms. before they are abandoned | 10000 | No

## Examples
Here are some example and breakdowns explaining how to use kamar js

### Getting a Students Timetable

#### Example
```javascript
const Kamar = require('kamar-js'),
      kamar = new Kamar({ portal: 'demo.school.kiwi' });

// Authenticates the student using the portal set above
kamar.logon("web.student", "student").then(credentials => {
    kamar.getCalendar(credentials)
        .then(calender => kamar.getTimetable(credentials, calender))
        .then(timetable => {
            console.log(timetable)
            // Anything you want to do with the timetable. 
        })
})
```

#### Breakdown of the Code

###### Creating a Kamar object
```javascript
const Kamar = require('kamar-js'),
      kamar = new Kamar({ portal: 'demo.school.kiwi' });
```


This is where we construct the new Kamar object, the only required parameter is `portal`

###### Logging in
```javascript
kamar.logon("web.student", "student").then(credentials => { 
```

###### A example of the credentials object
```
{
  username: 'web.student',
  studentID: 17046,
  key: 'bocpq9iXOjr9DDOOBOto9DVcppOtY9B6',
  accessLevel: 0
}
```


From that Kamar object we start to authenticate a Student using their portal username and password. This will return a credentials object which looks like this 

###### Getting the calender
```javascript
kamar.getCalendar(credentials)
```

###### A example of the calender day object
```
{
  Date: '2021-06-14',
  Status: '',
  DayTT: 1,
  Term: 2,
  TermA: 2,
  Week: 7,
  WeekA: 7,
  WeekYear: 18,
  TermYear: 7
}
```


After the authentication is ready we call `kamar.getCalender()`, this is the first and only time that we will need to call this as when it is called it is assigned globally to the Kamar object. But for simplicity only `DayTT`, `Date` and `Week` are passed to the Timetable

###### Getting the Student's Timetable for this week
```javascript
.then(calender => kamar.getTimetable(credentials, calender))
.then(timetable => {
    console.log(timetable)
    // Anything you want to do with the timetable. 
})
```

###### A example of the Timetable object
```
[
  { Class: 'L2DIT', Room: 'B13', Teacher: 'SCH', Time: '08:45' },
  { Class: 'L2BUS', Room: 'R1', Teacher: 'MOC', Time: '09:50' },
  {
    Class: undefined,
    Room: undefined,
    Teacher: undefined,
    Time: '10:50'
  },
  { Class: 'L2DVC', Room: 'T2', Teacher: 'STE', Time: '11:15' },
  { Class: 'L2MA1', Room: 'B1', Teacher: 'NEV', Time: '12:15' },
  {
    Class: undefined,
    Room: undefined,
    Teacher: undefined,
    Time: '13:15'
  },
  { Class: 'Whanau', Room: 'B8', Teacher: 'SEA/JEN', Time: '14:00' },
  { Class: 'L2EN1', Room: 'E5', Teacher: 'CHI', Time: '14:20' }
]
```


Finally we call `kamar.GetTimetable()` This takes the calender and credentials objects from before and turns them into a array of Periods with `Class`, `Room`, `Teacher` and `Time`. If undefined this is because of unmarked events, assemblies or lunch breaks.
