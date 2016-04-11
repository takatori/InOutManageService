Labin
==================
![top](https://github.com/takatori/InOutManageService/blob/master/images/top.jpg)

## Description
シンプルな入退室管理システムです  
研究室メンバーの在室状況を管理します  
UserManageServiceに登録されているユーザのみ利用可能です  
UserManageServiceの設定情報に応じて入退室時にアクションを実行可能です

## Requirement
* node.js == v0.12.7
* npm == 2.11.3
* [UserManageService](https://github.com/takatori/UserManageService)

## Usage
### 設定


### 入退室


## Install
### Download
```bash
    git clone https://github.com/takatori/InOutManageService
```

### nvmインストール
nodejsのバージョンん管理ツールをインストール

```bash
$ git clone git://github.com/creationix/nvm.git ~/.nvm
$ source ~/.nvm/nvm.sh
```

### nvmを使ってnode.jsをインストール
- バージョンを指定してnodeをインストール
  - npmも自動で入る

```bash
$ nvm install v0.12.7
```

- デフォルトのnodeバージョンを設定

```bash
$ nvm alias default v0.10.26
```

- 参考
  -http://qiita.com/akippiko/items/3708016fc43da088021c

### packageインストール
```bash
$ npm install
```

### Run(dev-mode)
- 環境変数の設定
```bash
$ export NODE_ENV=development
$ export PORT=3000
```

- gulp実行
  - watchにより変更を検知するとgulpが自動で走るようになる

```bash
$ gulp watch
```

-  実行
```bash
$ nodemon app.js
```

### Run(product-mode)
Supervisorで管理すること

- 環境変数の設定
```bash
$ export NODE_ENV=production
$ export PORT=3000
```

- gulp実行
```bash
$ gulp 
```

- 実行
```bash
$ node app.js
```


## Troubles
### node.js起動時エラー : Error: listen EADDRINUSE
- 原因: すでにプロセスが立ち上がっていてportが使用されている
- 対策: portを使用しているプロセスをkillする

### 起動しない2
- 原因: mongoに接続できない
- 対策: mongoが立ち上がっているか、接続できるかを確認する

