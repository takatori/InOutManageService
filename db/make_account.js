var account = {
    "name": "takatori",
    "passowrd": "hoge",
    "icon_image_url": "https://placeimg.com/640/480/any"
}


db.accounts.save(account)

/*
 *  使い方
 *  ``mongo --quiet localhost/Labin db/make_account.js``
 */
