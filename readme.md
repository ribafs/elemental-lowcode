# Elemental

[![Build Status](https://travis-ci.com/PhilipSkinner/elemental-lowcode.svg?branch=master)](https://travis-ci.com/github/PhilipSkinner/elemental-lowcode)
[![Coverage Status](https://coveralls.io/repos/github/PhilipSkinner/elemental-lowcode/badge.svg?branch=master)](https://coveralls.io/github/PhilipSkinner/elemental-lowcode?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c2fa09bdad924a0d9b290b282a4427cc)](https://www.codacy.com/manual/PhilipSkinner/elemental-lowcode?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=PhilipSkinner/elemental-lowcode&amp;utm_campaign=Badge_Grade)
[![GitHub issues](https://img.shields.io/github/issues/PhilipSkinner/elemental-lowcode.svg)](https://github.com/PhilipSkinner/elemental-lowcode/issues)
[![GitHub forks](https://img.shields.io/github/forks/PhilipSkinner/elemental-lowcode.svg)](https://github.com/PhilipSkinner/elemental-lowcode/network)
[![GitHub stars](https://img.shields.io/github/stars/PhilipSkinner/elemental-lowcode.svg)](https://github.com/PhilipSkinner/elemental-lowcode/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/PhilipSkinner/elemental-lowcode/pulls)

A simple low(ish) code development platform.

**This is very much a work in progress at this point!**

## Running

To run use the public docker image:

```
$> sudo docker run -d -p 80:80 --name elemental philipskinner/elemental:latest
```

; then open a browser and point it at (http://admin.elementalsystem.org).

The default administration login details are:

* Username: admin
* Password: admin

## Documentation

Get started by reading the [system documentation](/documentation).

## Examples

Examples can be found in the [elemental-examples repository](https://github.com/PhilipSkinner/elemental-examples).

## Developing

1. Clone the repo
2. Run setup.sh
3. Run start.sh
4. If this is the first time the system has run, you will be prompted to enter your first admin users credentials
5. Open a browser and point it at http://localhost:8002


## What does it do

Elemental currently allows you to:

* Construct simple document storage APIs using JSON schema
* Integrate with other simple APIs
* Construct your own more complex APIs
* Handle async processes using queues & messaging
* Build simple rulesets for business logic/validation logic
* Construct server side first websites/interfaces
* Create re-usable services & inject them into controllers
* Include node modules from npmjs.com to extend services

## Environmental variables

Set the following variables to control the resolved hostnames for the services:

* ELEMENTAL_KERNEL_HOST
* ELEMENTAL_ADMIN_HOST
* ELEMENTAL_API_HOST
* ELEMENTAL_INTEGRATION_HOST
* ELEMENTAL_INTERFACE_HOST
* ELEMENTAL_STORAGE_HOST
* ELEMENTAL_RULES_HOST
* ELEMENTAL_IDENTITY_HOST
* ELEMENTAL_QUEUE_HOST

## What does it not do

Alot of things, services that have not been fully completed:

* Identity provision & management
* Process modelling
* Unit tests!