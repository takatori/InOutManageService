I/O Manage Service
==================
![top](https://github.com/takatori/InOutManageService/blob/master/images/top.jpg)
## Description
シンプルな入退室管理システムです  
研究室メンバーの在室状況を管理します  
UserManageServiceに登録されているユーザのみ利用可能です  
UserManageServiceの設定情報に応じて入退室時にアクションを実行可能です

## Requirement
* node.js >= v0.12.0
* UserManageService

## Usage
### 設定


### 入退室

## Install
* Download
```
    git clone https://github.com/takatori/InOutManageService
```
* Run(dev-mode)
```
    ./run.sh
```
* Run(product-mode)
```
    ./run.sh -m prod
```
    
## APIs
### /apis/accounts
* 入退室管理システムを利用しているユーザアカウント一覧を表示
* @return {[Account]}

### /apis/accounts/:id/status
* 入退室状態を取得する
* @param {String} id
* @return {String} status: "in" or "out"

### /apis/accounts/:id/inout
* 入退室状態を変更し、設定されているアクションを実行する
* @param {String} id
* @return {String} status: "in" or "out"

### /apis/accounts/update
* アカウントを更新する
* UserManageServiceから現在研究室に所属しているユーザ一覧を取得
* アカウントがないユーザの新規アカウントを追加
* 現在のアカウントのアイコン画像を更新
* 卒業したユーザのアカウントを削除

### /apis/accounts/in/count
* 現在、研究室にいるユーザの人数を返す
* @return {int} count

### /apis/accounts/in/list
* 現在、研究室にいるユーザ一覧を返す
* @return {[Account]} 



