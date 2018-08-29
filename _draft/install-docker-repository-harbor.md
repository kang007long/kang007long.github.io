---
layout: post
title: 安装 Docker 私有镜像仓库 Harbor
category: "docker"
tags: [docker,harbor]
---

## 目的
在 centos 安装 Docker 私有镜像仓库过程备忘

## 安装 docker

``` shell
yum install docker
systemctl start docker
```

## 安装 docker-compose

``` shell
wget https://bootstrap.pypa.io/get-pip.py
python get-pip.py
pip install docker-compose
```

## 下载 harbor

``` shell
wget https://storage.googleapis.com/harbor-releases/harbor-online-installer-v1.5.2.tgz
tar zxf harbor-online-installer-v1.5.2.tgz
```

## 配置 harbor

``` shell
cd harbor
vi harbor.cfg
# 修改 hostname 为本机ip
  hostname = 10.120.xx.xx
  customize_crt = off
# 配置共享存储 provider
  registry_storage_provider_name = swift
  registry_storage_provider_config = username: xxxx:swift, password: xxxxxxxx, authurl: http://xx.xx.xx.xx:8080/auth/v1.0, container: xxxx
```

## 安装 harbor

``` shell
./install.sh
```

出现问题：ERROR: for harbor-log  Cannot create container for service log: error creating overlay mount to /var/lib/docker/overlay2/c6434fdf7016e2cb630c79fbf898c7c5a572f96818ccc73ea0f04b321b326e9d-init/merged: invalid argument
解决:
``` shell
# fix wrong driver
echo '{ "storage-driver": "devicemapper" }' | sudo tee /etc/docker/daemon.json
sudo systemctl restart docker.service
```

## 启停 harbor

``` shell
docker-compose start
docker-compose stop
docker-compose restart
```