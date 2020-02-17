# iWalletよく使うコマンド集

以下のオプションがよく出てきますが、
IOSTのネットワークを指定するためのものです。
今回はテストネットを使用するので以下で固定です。

-s 13.52.105.102:30002
--chain_id 1023

## アカウントをインポートする

まずはアカウントをインポートする必要があります
インポートすることでiWalletを使ってトランザクションに署名をすることができるようになります。

```command
例）iwallet account <ACCOUNT NAME> <SECRET KEY>

$ iwallet account import tutorial1 4uGCTQZVTg8ghZsgDdJV48YgVsfgc2gKRyJX2MXWd4N9r8sxFVFxeqjvNvJ59oGJKrh7kjTJ99xQppqZniFNbkgJ

import account tutorial1 done
```

## コントラクトをコンパイルする

IOSTではコントラクトをデプロイする際にabiファイルも一緒にデプロイする必要があります。
このコマンドでコードからabiファイルを生成します。

```command
例）iwallet compile <FILE NAME>

$ iwallet compile hello.js
Successfully generated abi file as: hello.js.abi
```

## コントラクトをブロックチェーンにデプロイする

ブロックチェーンにコードをデプロイします。
IOSTではパブリッシュと言っています。

```command
例）iwallet publish -a tutorial1 -s 13.52.105.102:30002 --chain_id 1023 <JS FILE> <ABI FILE>

$ iwallet publish -a tutorial1 -s 13.52.105.102:30002 --chain_id 1023 hello.js hello.js.abi

...（略）
SUCCESS! Transaction has been irreversible
The contract id is: Contract4DNFSzRJFvgdau4CW8AM2x7X2AA1q8iX33YNKrBMYAAc

```

## デプロイ済みのコントラクトをアップデートする

上のコマンドにオプションを付け加えるとコントラクトのアップデートが可能です。
ただしアップデートできるのはコントラクト内にアップデート用のコードを明記している場合のみです。
アップデート用コードは。。。を参照してください


```command
例）iwallet publish -a tutorial1 -s 13.52.105.102:30002 --chain_id 1023 -u <JS FILE> <ABI FILE> <CONTRACT ID>

$ iwallet publish -a tutorial1 -s 13.52.105.102:30002 --chain_id 1023 -u hello.js hello.js.abi Contract4DNFSzRJFvgdau4CW8AM2x7X2AA1q8iX33YNKrBMYAAc

```

## コントラクト内の関数を呼び出す

デプロイ済みコントラクトの関数を呼び出すコマンドです。
ABIファイルに記載されている関数のみ呼び出すことが出来ます。
引数は配列の形で渡します。

```command
例）iwallet call -a tutorial1 -s 13.52.105.102:30002 --chain_id 1023 <CONTRACT ID> '<FUNC NAME>' '[<PARAMETER>]'

$ iwallet call -a tutorial1 -s 13.52.105.102:30002 --chain_id 1023 Contract4DNFSzRJFvgdau4CW8AM2x7X2AA1q8iX33YNKrBMYAAc "hello" '["たけし"]'
```

## トランザクションの結果を確認する

トランザクションIDを使って結果を確認できます。
上のcallコマンドで帰ってくる結果とほとんど同じものです
結果は誰でも確認できるので、アカウントの指定は無くて大丈夫です。

```command
例）iwallet receipt -s 13.52.105.102:30002 --chain_id 1023 <TRANSACTION ID>

$ iwallet receipt -s 13.52.105.102:30002 --chain_id 1023 AyFmF2E1RQ3RC8m8UnrpSkenocq1zogeofQ39Uyj3HmW
{
    "txHash": "AyFmF2E1RQ3RC8m8UnrpSkenocq1zogeofQ39Uyj3HmW",
    "gasUsage": 33737,
    "ramUsage": {
    },
    "statusCode": "SUCCESS",
    "message": "",
    "returns": [
        "[\"こんにちは0さん\"]"
    ],
    "receipts": [
    ]
}
```

## コントラクト内のストレージを確認する

コントラクト内のキーを指定して値を取得するコマンドです
\<FIELD>はmapPutで保存した場合のフィールドの名前を指定するときに使います。

```command
例1）iwallet table -s 13.52.105.102:30002 --chain_id 1023 <CONTRACT ID> <KEY> 
例2）iwallet table -s 13.52.105.102:30002 --chain_id 1023 <CONTRACT ID> <KEY> <FIELD>

$ iwallet table -s 13.52.105.102:30002 --chain_id 1023 Contract4DNFSzRJFvgdau4CW8AM2x7X2AA1q8iX33YNKrBMYAAc 'lastPerson'
{
    "data": "\"ひろし\"",
    "blockHash": "5MuDwB3UYXWvzWWF5zNTgCRpuzHbsvRFE8yLehFenGrG",
    "blockNumber": "56798385"
}

$ iwallet table -s 13.52.105.102:30002 --chain_id 1023 Contract4DNFSzRJFvgdau4CW8AM2x7X2AA1q8iX33YNKrBMYAAc 'country' 'japan'
{
    "data": "[\"ひろし\",\"ひろし\"]",
    "blockHash": "BEvMCuDvdLHY8wsyDcroH2UN6nGWcpQm2ws2f2rrD3b2",
    "blockNumber": "56798469"
}
```
