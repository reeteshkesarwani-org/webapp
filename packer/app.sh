#!/bin/bash
sleep 30
sudo yum update -y
sudo yum upgrade -y
sudo amazon-linux-extras install nginx1.12 -y


sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs



sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
wget http://dev.mysql.com/get/mysql57-community-release-el7-8.noarch.rpm
sudo yum localinstall -y mysql57-community-release-el7-8.noarch.rpm
sudo yum install -y mysql-community-server
sudo systemctl start mysqld
sudo systemctl enable mysqld
sudo grep 'temporary password' /var/log/mysqld.log | awk '{print $NF}' > /tmp/mysql.password
MYSQL_ROOT_PASSWORD=$(cat /tmp/mysql.password)
mysql -u root --password=$MYSQL_ROOT_PASSWORD --connect-expired-password -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'Root@123';"


sudo yum install unzip -y
cd ~/ && unzip webapp.zip
cd ~/webapp && npm i 

 cd ~/webapp
 set environment variables
 sudo touch .env
 sudo chmod 777 .env
 echo "DATABASE_HOST=$DATABASE_HOST" >> .env
 echo "PORT=$PORT" >> .env
 echo "DATABASE_USER=$DATABASE_USER" >> .env
 echo "DATABASE_PASSWORD=$DATABASE_PASSWORD" >> .env
 echo "DATABASE_NAME=$DATABASE_NAME" >> .env   



sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service
sudo systemctl enable webapp.service
sudo systemctl start webapp.service