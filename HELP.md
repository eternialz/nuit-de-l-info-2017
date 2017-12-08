# RTFD CORDON BLEU

Api main roots :

Users :
- [/Users](#users)
- [/Users/register](#register)
- [/User/auth](#authentificate)

Reports:
- [/Reports](#reports)
- [/Reports/create](#create)
- [/Reports/nearby](#nearby)
- [/Reports/createbyname](#create-by-name)

Help:
- [/Help](#help)

## Users
### Register

Register user:
- Name
- Mail
- Password

```shell
curl -H "Content-Type: application/json" -X POST -d '{"name":"Totoba", "password":"gratz", "email":"toto@cordonbleu.fr"}' http://cordonbleu.erfani.fr/users/register
```

### Authentificate

Authentificate user:
- Email
- Password

```shell
curl -H "Content-Type: application/json" -X POST -d '{"email":"toto@cordonbleu.fr", "password":"gratz"}' http://cordonbleu.erfani.fr/users/auth
```

## Reports
### Create

Report user incident:
- Position latitude
- Position longitude
- Incident type (id)

```shell
curl -H "Content-Type: application/json" -X POST -d '{"report_type" : 1, "latitude": 11.93829, "longitude": 19.9382938}' http://cordonbleu.erfani.fr/reports/create
```

### Nearby

Get nearby incident reports:
- Position latitude
- Position longitude

```shell
curl -H "Content-Type: application/json" -X GET -d '{"report_type" : 1, "latitude": 11.93829, "longitude": 19.9382938}' http://cordonbleu.erfani.fr/reports/nearby
```

### Create by name

Create user incident:
- Position latitude
- Position longitude
- Incident type

```
curl -H "Content-Type: application/json" -X POST -d '{"report_name" : "incendie", "latitude": 11.93829, "longitude": 19.9382938}' http://cordonbleu.erfani.fr/reports/createbyname
```

## Help

Get root informations

```
curl -H "Content-Type: application/json" -X GET -d '{}' http://cordonbleu.erfani.fr/help
```
