# IOSTスマートコントラクトチュートリアル

サンプルコードは

examples/contract/tutorial.js

にあります

## IOSTのスマートコントラクトについて

スマートコントラクトとは・・・

- ブロックチェーン上で動くプログラムのこと

IOSTでは、JavaScriptでスマートコントラクトを記述できる

あんまり普通のプログラムと違いはないが、制約が多い

</br>

### 制約1

#### プログラムを実行するのに手数料がかかる
  
- 手数料は計算量で決まる
- 手数料には上限がある

なので計算させまくるプログラムは書けない

</br>

### 制約2

言語機能が一部制限される

#### 使えないJavaScriptの文法

```javascript
    const [a, b, c] = [1, 2, 3]
    const {d, e, f} = {d: 'd', e: 'e', f: 'f'}
```

JavaScriptでよく使われる上記のような配列や連想配列の分割代入、

正規表現はIOSTでは使用できない

```javascript
    const someFunc = () => {
        // 処理
    }
```

アロー関数も使用できない

</br>

## IOSTスマートコントラクトの書き方

</br>

### まずはじめに

ChainIDEで新しいファイルを作成して以下を記述

```javascript

class Tutorial {

}

module.exports = Tutorial

```

普通のJavaScriptであれば

```javascript

class Tutorial {
    constructor(){
        // 初期化の処理
    }
}

module.exports = Tutorial
```

と書きたいところだけど、コンストラクターは使えません。

</br>

### init関数

その代わりに専用の関数が使えます

```javascript

class Tutorial {
    init(){
        // 初期化の処理
        // ストレージの初期化などの処理を行える
    }
}

module.exports = Tutorial
```

init関数は、スマートコントラクトをブロックチェーンに乗せたときに一度だけ呼ばれます
実際の処理はあとで見ていきます。

<!-- </br>

### アップデート可能にする

スマートコントラクトはデフォルトではアップデートできません。

一度ブロックチェーンに乗せたら、バグがあっても更新できないです

さすがに開発するときは不便なのでアップデートできるように関数を書きます

```javascript
    can_update(data) {
        return blockchain.requireAuth(blockchain.contractOwner(), "active")
    }
}

module.exports = Tutorial
``` -->

</br>

### 関数の定義

名前を入れたら挨拶してくれる関数を用意します

```javascript

class Tutorial {
    init(){
    }

    hello(name){
        return 'こんにちは' + name + 'さん'
    }
}

module.exports = Tutorial
```

</br>

### スマートコントラクトをコンパイルする

ChainIDEでコンパイルしてみましょう
コンパイルするとabiファイルが作成されます

```json
[
    {
        // 関数の名前
        "name": "hello",
        // 引数
        "args": [
            "string"
        ],
        "amountLimit": [],
        "description": ""
    }
]
```

## ストレージを使ってみる

IOSTではstorageというグローバルのオブジェクトが使用できます

詳細のAPIについてはサンプル参照

### init関数を使う

init関数内で初期化時にストレージにユーザー情報をしまってみる

```javascript
    init(){
        storage.put('user', 'たろう')
    }
```

### ユーザー情報を操作する関数を作る

```javascript
    setUser(user){
        storage.put('user', user)
    }

    getUser(){
        return storage.get('user')
    }

```

またコンパイルしてみましょう

### ユーザー情報をもう少し追加してみましょう

```javascript
    init(){
    }

    setUser(userName, userAge){
        // ユーザー情報
        const userInfo = {
            name: userName,
            age: userAge
        }
        // 文字列化する
        const strUserInfo = JSON.stringify(userInfo)
        // ストレージにしまう
        storage.put('user', strUserInfo)
    }

    getUserName(){
        // ユーザーを取ってくる
        const strUserInfo = storage.get('user')
        // ユーザーがいなければリターン
        if(!strUserInfo) {
            return
        }
        // 文字列からパース
        const userInfo = JSON.parse(strUserInfo)
        // 名前だけリターン
        return userInfo.name
    }
```

</br>

### ストレージ操作をするプライベート関数を作成する

get -> JSON.parse

put -> JSON.stringify

しないといけないのはめんどくさいので、汎用関数を作ります

_をつけるとコンパイル時に無視されるので、外部からは呼べなくなります

こんな感じの関数を作るのが割と一般的です

```javascript

    _put(k,v){
        const value = JSON.stringify(v)
        storage.put(k, value)
    }

    _get(k){
        const v = storage.get(k)
        if(!v) return

        return JSON.parse(v)
    }
```

</br>

### さっきの関数を更新してみましょう

```javascript
    getUserName(){
        // ユーザーを取ってくる
        // 文字列からパース
        const userInfo = this._get('user')

        // ユーザーがいなければリターン
        if(!userInfo) {
            return
        }
        // 名前だけリターン
        return userInfo.name
    }

    getUserAge(){
        // ユーザーを取ってくる
        // 文字列からパース
        const userInfo = this._get('user')

        // ユーザーがいなければリターン
        if(!userInfo) {
            return
        }
        // 名前だけリターン
        return userInfo.age
    }


    setUser(userName, userAge){
        // ユーザー情報
        const userInfo = {
            name: userName,
            age: userAge
        }
        // 文字列化する
        // ストレージにしまう
        this._put('user', userInfo)
    }
```

</br>

### ただこれだとユーザーが1人しか登録できないので

また新しい関数を使います

storage.mapPut(key, field, value)

storage.mapGet(key, field)

使い方はこんな感じ

```javascript

storage.mapPut('user', 'user1', 'たろう')
storage.mapPut('user', 'user2', 'はなこ')

const user1 = storage.mapGet('user', 'user1')
const user2 = storage.mapGet('user', 'user2')
```

</br>

### mapPut, mapGetの汎用関数も作る

```javascript

    _mapPut(k,f,v){
        const value = JSON.stringify(v)
        storage.mapPut(k, f, value)
    }

    _mapGet(k, f){
        const v = storage.mapGet(k, f)
        if(!v) return
        return JSON.parse(v)
    }
```

### ユーザー操作を更新する

```javascript
    getUserName(accountName){
        // ユーザーを取ってくる
        // 文字列からパース
        const userInfo = this._mapGet('user', accountName)

        // ユーザーがいなければリターン
        if(!userInfo) {
            return
        }
        // 名前だけリターン
        return userInfo.name
    }

    getUserAge(){
        // ユーザーを取ってくる
        // 文字列からパース
        const userInfo = this._mapGet('user', accountName)

        // ユーザーがいなければリターン
        if(!userInfo) {
            return
        }
        // 名前だけリターン
        return userInfo.age
    }


    setUser(userName, userAge){
        const accountName = tx.publisher

        if(storage.mapHas('user', accountName)){
            throw new Error("user already exists")
        }

        // ユーザー情報
        const userInfo = {
            name: userName,
            age: userAge
        }
        // 文字列化する
        // ストレージにしまう
        this._mapPut('user', accountName, userInfo)
    }
```

## 関数に認証をつける

関数を呼ぶのに認証が必要なようにできます

使うAPIは

blockchain.requireAuth(account, permission)

```javascript

    // account1のactiveという名前のパーミッションが必要
    const isAuthorized = blockchain.requireAuth('account1', 'active');
    if (isAuthorized !== true) {
        throw new Error("permissino denied!");
    }
```

## ユーザー情報を変更する関数に認証をかける

```javascript
    changeUserName(accountName, newName){
        // 認証チェック
        const isAuthorized = blockchain.requireAuth(accountName, 'active');
        if (isAuthorized !== true) {
            throw new Error("permission denied!");
        }

        // ユーザー情報を取得
        const userInfo = this._mapGet('user', accountName)

        // いなければエラー
        if(!userInfo){
            throw new Error("user not found")
        }

        // 新しい名前をセット
        userInfo.name = newName

        // 更新後のユーザーをストレージに保存
        this._mapPut('user', accountName, userInfo)
    }
```

あとは適当にいじってみてください

## 追加情報

[スマートコントラクトAPI一覧](https://developers.iost.io/docs/en/3-smart-contract/IOST-Blockchain-API.html)

