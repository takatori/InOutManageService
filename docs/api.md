# APIs
## /apis/accounts
* 入退室管理システムを利用しているユーザアカウント一覧を表示
* @return {[Account]}

## /apis/accounts/:id/status
* 入退室状態を取得する
* @param {String} id
* @return {String} status: "in" or "out"

## /apis/accounts/:id/inout
* 入退室状態を変更し、設定されているアクションを実行する
* @param {String} id
* @return {String} status: "in" or "out"

## /apis/accounts/update
* アカウントを更新する
* UserManageServiceから現在研究室に所属しているユーザ一覧を取得
* アカウントがないユーザの新規アカウントを追加
* 現在のアカウントのアイコン画像を更新
* 卒業したユーザのアカウントを削除

## /apis/accounts/in/count
* 現在、研究室にいるユーザの人数を返す
* @return {int} count

## /apis/accounts/in/list
* 現在、研究室にいるユーザ一覧を返す
* @return {[Account]} 


