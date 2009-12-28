@echo off
rem Looking for TopStyle 4
if not exist "%APPDATA%\Bradsoft.com\TopStyle\4.0" goto notinstalled

rem Generate name for backing up autorepl.dat
set AUTOREPL="%APPDATA%\Bradsoft.com\TopStyle\4.0\autorepl.dat"
:generatename
if not exist %AUTOREPL% goto backup
set AUTOREPL=%AUTOREPL%.bak
goto generatename

rem Back up autorepl.dat
:backup
copy /Y "%APPDATA%\Bradsoft.com\TopStyle\4.0\autorepl.dat" %AUTOREPL% > nul

rem Copy files
xcopy /Y /E templates "%APPDATA%\Bradsoft.com\TopStyle\4.0" > nul
echo TopStyle 4.0 Zen Coding is successfully installed.
echo.
echo Old autoreplacement rules are stored in file 
echo %AUTOREPL%
pause
goto end

:notinstalled
echo Unable to continue because TopStyle 4.0 is not installed.

:end