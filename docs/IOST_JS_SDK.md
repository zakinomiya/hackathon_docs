# IOST JavaScript SDKの使い方

IOST JavaScript SDKでよく使うのは

- IOST（トランザクションを送ったりする）
- RPC （ブロックチェーンの情報を取得する）

という2つのクラスです

アカウント情報はChrome拡張機能のiWalletから読み取るという前提で書いています。

詳細は以下を参照してください
[SDKクラス](https://developers.iost.io/docs/ja/7-iost-js/IOST-class.html)

## iWallet拡張機能からアカウント情報を読み取る

```javascript
    // iost.jsの読み込み
    const IOST = require("iost")

    // RPCインスタンスの初期化（テストネット用）
    // これでテストネットのIOSTネットワークから
    // 情報を読み取ったりできるように設定しています。
    const rpc = new IOST.RPC(new IOST.HTTPProvider("http://13.52.105.102:30001"))

    // 拡張機能の読み込み
    const iwallet = window.IWalletJS

    // 拡張機能からアカウントを読み込んで
    // IOSTクラスのインスタンスを返す
    const loadAccount = async () => {
        const account = await iwallet.enable()
        const iost = iwallet.newIOST(IOST)
        iost.setRPC(rpc)
        return iost.setAccount(account)
    }

    const getAccountName = () => {
        return iwallet.account.name
    }

```

## トランザクションを送る

アカウント情報を読み取った後にトランザクションを送ることができます。

使用するAPIは主に2つです

1. iost.callABI()
2. iost.signAndSend()

## iost.callABI

### 引数
名前 |　型　|　説明
----                |--         |--
contract |String         | コントラクトID
abi　　|String　| 関数名
args　|Array　| 引数の配列

## iost.signAndSend

### 引数
名前 |　型　|　説明
----                |--         |--
tx   |　IOST.Tx | トランザクションオブジェクト

### 例

```javascript

    const sendTransaction = async () => {
        const iost = await loadAccount()
        // トランザクションを作成
        // 引数は適宜変更する
        const tx = iost.callABI(
            "Contract4DNFSzRJFvgdau4CW8AM2x7X2AA1q8iX33YNKrBMYAAc",
            "hello",
            ["taro", "japan"]
        )

        // チェーンIDを設定
        // 今回はテストネットなので1023です
        tx.setChainID(1023)

        // トランザクションに署名して送信
        // 署名する必要があるため、アカウントを読み込んでからでないとエラーになります
        // アカウント読み込みについては上述です
        // 以下のように3つのイベントを出力します
        iost.signAndSend(tx)
            .on("pending", (res) => { // トランザクションの送信に成功すると呼び出されます
                console.log(res)
                // トランザクションID
            })
            .on("success", (res) => {// トランザクションの処理が成功すると呼び出されます
                console.log(res)
                // トランザクションの結果
            })
            .on("failed", (err) => {// トランザクションが失敗すると呼び出されます（送信に失敗 or スマートコントラクト実行中にランタイムエラー）
                console.log(err)
                // エラー
            })
    }
```

## ブロックチェーンのストレージを読む

## rpc.getContractStorage

### 引数

名前 |　型　|　説明
----                |--       |--
id                  | String  | コントラクトID
key                 | String  | StateDBのキー
field               | String  | StateDBのフィールド
by_longest_chain    | Boolean | コントラクトID

```javascript

    const getPeople = async () => {
        const result = await rpc.getContractStorage(
            "Contract4DNFSzRJFvgdau4CW8AM2x7X2AA1q8iX33YNKrBMYAAc",
            "country",
            "japan",
            true
        )
        console.log(result)
    }

```
