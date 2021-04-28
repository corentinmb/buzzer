<p align="center">
  <img width="400px" src="https://upload.wikimedia.org/wikipedia/fr/7/72/Burger_Quiz.png" alt="Buzzer"/>
</p>

A little buzzer app for running your own quizzes or game shows! Uses websockets to sent messages.

Forked from: https://github.com/bufferapp/buzzer

## Install

Create an .env file (or override `Config Vars` in Heroku) with a key ADMIN_BUZZER_PASSWORD and set the password.

`docker build --tag node-docker .`

`docker run -p 3000:3000 burgerquizz`

Or deploy it on a PaaS like Heroku etc...
