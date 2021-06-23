# KAMAR API

Documentation for the KAMAR API. This is unofficial, raw xml and may break at any time.

**_THIS IS THE RAW XML API FOR A JS API REFER TO README.md_**

# Table of Contents

- [Generic Errors](#generic-errors)
  - [Invalid Key](#invalid-key)
  - [Key Missing](#key-missing)
  - [Missing Origin and or X-Requested-With Headers](#missing-origin-and-or-x-requested-with-headers)
  - [Unknown Page](unknown-page)

## Generic Errors

These are Errors shared by every command in the Kamar API

### Invalid Key

Will return this error if the Auth Key is incorrect or not valid

```xml
 <?xml version="1.0" encoding="UTF-8"?>
<SettingsResults apiversion="4.02.002" portalversion="4.02.019">
    <AccessLevel>-1</AccessLevel>
    <ErrorCode>-3</ErrorCode>
    <Error>invalid key</Error>
</SettingsResults>
```

### Key Missing

Will return this error if the Auth Key is not provided to the command

```xml
 <?xml version="1.0" encoding="UTF-8"?>
<SettingsResults apiversion="4.02.002" portalversion="4.02.019">
    <AccessLevel>-1</AccessLevel>
    <ErrorCode>-2</ErrorCode>
    <Error>Key Missing</Error>
</SettingsResults>
```

### Missing Origin and or X-Requested-With Headers

If the Origin and or X-Requested-With Headers are not provided or correct. It will return a blank request. This means that your request module must support custom headers or else the API will not respone.

### Unknown Page

This happens when the Command parameter is invalid, missing or you do not have permission to access a specific page.

```xml
 <?xml version="1.0" encoding="UTF-8"?>
<Results apiversion="4.02.002" portalversion="4.02.019">
    <AccessLevel>0</AccessLevel>
    <ErrorCode>-4</ErrorCode>
    <Error>Unknown Command: </Error>
</Results>
```

### Access Denied

If a specific page is disabled within the portal by your School.

```xml
 <?xml version="1.0" encoding="UTF-8"?>
<StudentAwardsResults apiversion="4.02.002" portalversion="4.02.019">
    <AccessLevel>1</AccessLevel>
    <ErrorCode>-7</ErrorCode>
    <Error>Access Denied</Error>
    <ErrorType>454</ErrorType>
</StudentAwardsResults>
```

## Get Settings

This returns the settings for a school, for example minimum KAMAR app version, API version, name of the school, path to a logo and user access to pages

### Breakdown of Response

| Token                  | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AccessLevel            | States the type of account accessing the page, 0 unauthenticated (with the API key), 1 means student, 2 is primary caregivers, 3 is all caregivers and 10 is teacher.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ErrorCode              | Whether there is an error with the request. Generic errors can be found above.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| SettingsVersion        | It's not entirely clear what this does, but appears to be the schema version of this response                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| MiniOSVersion          | Specifies the minimum version of the official KAMAR app on iOS supported                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| MinAndroidVerion       | Specifies the minimum version of the official KAMAR app on Android supported                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| StudentsAllowed        | Specifies whether students (and by extension caregivers) can use the app. 1 for yes, 0 for no.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| StaffAllowed           | Specifies whether staff can use the app. 1 for yes, 0 for no.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| StudentsSavedPasswords | Whether students are allowed to save their passwords (security feature). 1 for yes, 0 for no.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| StaffSavedPasswords    | Whether staff are allowed to save their passwords. 1 for yes, 0 for no.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| SchoolName             | The name of the school, pretty self-explanatory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| LogoPath               | URL for a KAMAR hosted version of the school logo. This is rather low resolution but can still be useful.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| AssessmentTypesShown   | This doesn't appear to be filled out, both on the demo portal and with other portals I have tested. This could potentially tell the app what assessment types are shown (NCEA, Cambridge, School Based, etc.)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ShowEnrolledEntries    | Again, it's not clear if this is used as it seems to be 0 on every portal I have tried. This potentially tells the app whether entries that the student is enrolled for, but have not been completed, are to be shown.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| UserAccess             | Specifies the permissions for each group of users.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| USER                   | Contains an index and the individual pages. The index refers to what group it is, 0 for unauthenticated, 1 for students, 2 for primary caregivers, 3 for secondary caregivers and 10 for teachers.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Individual Pages       | Each page can either be 1 (allowed), 0 (denied) or blank (denied). <ul><li> Notices - Access to the 'Get Notices' endpoint<li> Events - Access to the 'Get Calendar Events' endpoint<li> Details - Access to the 'Details' endpoint <li> Timetable - Access to the 'Timetable' endpoint.<li> Attendance - Access to the 'Get Attendance per Period' and 'Get Absence Statistics' endpoints<li> NCEA - Access to the 'Get NCEA Results' (and potentially 'Get NZQA Qualifications') endpoint(s).<li> Results - Access to 'Get Results of Individual Standards' endpoint.<li> Groups - Access to the 'Get Groups' endpoint.<li> Awards - Access to the 'Awards' endpoint (currently undocumented).<li> Pastoral - Access to the 'Pastoral' endpoint (currently undocumented).<li> ReportAbsenceSt - Access to the new report absence section, specifically the student area.<li> ReportAbsencePg - Access to the new report absence section, specifically the parent area.<li> ReportAbsence - Access to the new report absence section in general.</ul> |
| CALENDARSETTINGS       | It's not entirely clear why this is under the UserAccess section, but it appears to define 'pretty names' for the different calendar event types.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

### HEADERS

| Token            | Value                               | Explanation                                                                   |
| ---------------- | ----------------------------------- | ----------------------------------------------------------------------------- |
| Content-Type     | `application/x-www-form-urlencoded` | Isn't required, but good practice to have                                     |
| User-Agent       | `Kamar.js Documentation`            | Isn't required, but good practice to have                                     |
| Origin           | `file://`                           | Header (and this content) is required or else KAMAR will return an empty page |
| X-Requested-With | `nz.co.KAMAR`                       | Header (and this content) is required or else KAMAR will return an empty page |

### BODY

| Token   | Value       | Explanation                                                                          |
| ------- | ----------- | ------------------------------------------------------------------------------------ |
| Command | GetSettings | The page to load                                                                     |
| Key     | vtku        | Generally this is an authentication key, but in this case it is some sort of API key |

## Get Authentication Key

Obtain an authentication key for other requests. This method returns the user type (1 is student), the ID of the current student and of course the key.

### Breakdown of Response

| Token          | Value                                                                                                                                                                 |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AccessLevel    | States the type of account accessing the page, 0 unauthenticated (with the API key), 1 means student, 2 is primary caregivers, 3 is all caregivers and 10 is teacher. |
| ErrorCode      | Whether there is an error with the request. Generic errors can be found above.                                                                                        |
| Success        | Appears to be either 'YES' or 'NO'. Doesn't really make sense, considering the error code basically replicates this functionality.                                    |
| LogonLevel     | The current account type, e.g. 1 for student. This is further documented in the AccessLevel section.                                                                  |
| CurrentStudent | The internal ID that KAMAR uses for each student. This is sometimes the same as the username, sometimes not.                                                          |
| Key            | The actual authentication key, which is used in all requests that require a 'Key' field.                                                                              |

### HEADERS

| Token            | Value                               | Explanation                                                                   |
| ---------------- | ----------------------------------- | ----------------------------------------------------------------------------- |
| Content-Type     | `application/x-www-form-urlencoded` | Isn't required, but good practice to have                                     |
| User-Agent       | `Kamar.js Documentation`            | Isn't required, but good practice to have                                     |
| Origin           | `file://`                           | Header (and this content) is required or else KAMAR will return an empty page |
| X-Requested-With | `nz.co.KAMAR`                       | Header (and this content) is required or else KAMAR will return an empty page |

### BODY

| Token    | Value       | Explanation                                                                          |
| -------- | ----------- | ------------------------------------------------------------------------------------ |
| Command  | Logon       | The page to load                                                                     |
| Key      | vtku        | Generally this is an authentication key, but in this case it is some sort of API key |
| Username | web.student | Username to use                                                                      |
| Password | student     | Password to use                                                                      |
