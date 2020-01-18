#!/bin/bash
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout refresh_key.pem -out refresh_cert.pem
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout jwt_key.pem -out jwt_cert.pem
