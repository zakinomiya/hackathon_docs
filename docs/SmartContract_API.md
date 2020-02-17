# スマートコントラクトでよく使うAPI

IOSTのスマートコントラクトでは専用のAPIを使用できます。

よく使うAPIをとりあえず並べてみました。

全APIの一覧はここにあります
https://developers.iost.io/docs/en/3-smart-contract/IOST-Blockchain-API.html

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


| 引数	| 型 | 説明 |
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

| 引数	| 型 | 説明 |
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

認証（requireAuth）

## 現在のブロック情報を確認したい

ブロック(block)

## 現在のトランザクション情報を確認したい

トランザクション(tx)

## 暗号を使用したい

## Crypto
