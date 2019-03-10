# Ping Pi AWS edition
This project is a version of PingPi which reads data from a remote location and sends the ping data to an AWS instance which then writes it to a Mongo Database.

The Angular front end then reads the data from the database and displays it in the D3 graph.

The project is split into 2 code bases the Sender and the Receiver.

## Data Sender
This is running on the remote Raspberry Pi and sends the result of the ping probe to the AWS instance.

## Data Receiver
This receives data from the RPi and puts it in a Mongo DB. This part also runs the public html/js 
