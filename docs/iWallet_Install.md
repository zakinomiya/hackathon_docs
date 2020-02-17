# iWalletのインストール

## Go バージョン1.11以上が必要

無い場合はまずGo言語をインストールする

以下記事を参考にインストールしてみてください

Mac
https://rightcode.co.jp/blog/information-technology/golang-introduction-environment-1

Windows
https://qiita.com/yoskeoka/items/0dcc62a07bf5eb48dc4b

## Goがインストールできたら

```command
$ go get github.com/iost-official/go-iost/cmd/iwallet
```

でiwalletコマンドラインツールをインストール

```command
$ iwallet 
```

コマンドを打ってみてインストールできているか確認する

もしコマンドが見つからない場合は

```command

$ export GOPATH=$(go env GOPATH)
$ export PATH=$PATH:$GOPATH/bin
```

とコマンドを打って再度試してみてください
