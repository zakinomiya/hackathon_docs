# スマートコントラクトでよく使うAPI

IOSTのスマートコントラクトでは専用のAPIを使用できます。

よく使うAPIをとりあえず並べてみました。

全APIの一覧はここにあります
[IOSTスマートコントラクトAPI一覧](https://developers.iost.io/docs/en/3-smart-contract/IOST-Blockchain-API.html)

## コントラクト内のデータを操作したい

```javascript
// ストレージに保存する
    storage.put('name', 'tanaka')
// ストレージから取得する
    const data = storage.get('name')
    // data = 'tanaka'

// ストレージに保存する2
    storage.mapPut('class1', 'no1', 'asakura')
// ストレージから取得する2
    const data2 = storage.mapGet('class1', 'no1')
    // data = 'asakura'
```

#### 似ているAPI

del、mapDel　→　削除

has、mapHas　→　キーが存在するか確認

## トークンを送信したい

| 引数 | 型 | 説明 |
| :----: | :------ |:------ |
| from | string | 送信元 |
| to | string | 送信先 |
| amount | string | 量 |
| memo | string | メモ |

```javascript

// account1 -> account2 に100IOSTを送る
    blockchain.transfer('account1', "account2", "100", "this is memo")

```

#### 似ているAPI

deposit　→　コントラクトにトークンを預ける

withdraw　→　コントラクトからトークンを引き出す

## 誰がトランザクションを呼び出したか確認したい

データに対して所有者をもたせたいときなど便利です

```javascript

    const publisher = tx.publisher()
    // publisher = 'account1'
```

## 誰がコントラクトのオーナーか確認したい

```javascript
    const owner = blockchain.contractOwner()
    // owner = 'account1'
```

## 別のコントラクトを呼び出したい

| 引数 | 型 | 説明 |
| :----: | :------ |:------ |
| contract | string | コントラクトID |
| abi | string | |
| args | array/string | 引数の配列、もしくはJSON文字列|

```javascript

    const result = blockchain.call
        (
            "Contract4DNFSzRJFvgdau4CW8AM2x7X2AA1q8iX33YNKrBMYAAc",
            'hello',
            ["taro", "japan"]
        )
```

## コントラクトの実行に認証をかけたい

IOSTにはアカウントに権限をつけることができます
トランザクション実行者が権限を持っているか確認できます

| 引数 | 型 | 説明 |
| :----: | :------ |:------ |
| account | string |  |
| permission | string | |

```javascript
const isAuthorized = blockchain.requireAuth('account1', 'active');
if (isAuthorized !== true) {
    throw new Error(" unauthoirzed! ");
}
```

## 現在のブロック情報を確認したい

スマートコントラクトではグローバルでblock変数を参照できます
内容は以下です

```javascript
{
    time: 1541541540000000000, // nano second
    hash: "4mBbjkCYJQZz7hGSdnRKCLgGEkuhen1FCb6YDD7oLmtP",
    expiration: 1541541540010000000, // nano second
    gas_limit: 100000,
    gas_ratio: 100,
    auth_list: {"IOST4wQ6HPkSrtDRYi2TGkyMJZAB3em26fx79qR3UJC7fcxpL87wTn":2},
    publisher: "user0"
}
```

## 現在のトランザクション情報を確認したい

```javascript
{
    number: 132,
    parent_hash: "4mBbjkCYJQZz7hGSdnRKCLgGEkuhen1FCb6YDD7oLmtP",
    witness: "IOST4wQ6HPkSrtDRYi2TGkyMJZAB3em26fx79qR3UJC7fcxpL87wTn",
    time: 1541541540000000000 // nano second
}
```

## 使えないJavaScriptの文法

```javascript
    const [a, b, c] = [1, 2, 3]
    const {d, e, f} = {d: 'd', e: 'e', f: 'f'}
```

JavaScriptでよく使われる上記のような配列や連想配列の分割代入、
正規表現はIOSTでは使用できません
アロー関数も使用できません
