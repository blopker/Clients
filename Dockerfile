# Clients
#
# VERSION               0.1

FROM centos:6.4
MAINTAINER bo@kbl.io

# make sure the package repository is up to date
RUN rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

RUN yum install -y npm

# Bundle app source
ADD . /clients

# Install app dependencies
RUN cd /clients; npm install

EXPOSE 3000

CMD ["node", "/clients/app.js"]
