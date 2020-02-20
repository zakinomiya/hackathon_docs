# IOSTスマートコントラクトTips

## プライベートな関数を作りたい

コントラクト内だけのプライベート関数を定義したい場合があります。

その場合は_を関数の名前の先頭につけてコンパイルすると簡単です。
以下のようにすると

- hello　→　外部から呼び出せる
- _hello2　→　コントラクト内部からしか呼び出せない

という感じになります

```javascript

    hello(name){
        return 'hello' + name
    }

    _hello2(name){
        return 'hello' + name
    }
```

関数を呼び出し可能にするためにはABIファイルにインターフェースとして関数名などを記述する必要があります。
ABIファイルはコンパイルによって作成されますが、_をつけている関数は無視されるのでプライベート関数にすることができるという仕組みです。
なのでABIファイルから手動で関数を削除してもプライベート関数を作成できます。

## ストレージ操作のラッパー関数を作る

IOSTのスマートコントラクト内で値を使用したい場合、

1. 変数をハードコードする
2. 引数として渡す
3. ストレージから取得する

のいずれかをする必要があります

ブロックチェーンにデータを書き込んだり、それを読んで何かしたりする場合は、3を使うことが多いです
しかし、IOSTでは文字列しかストレージに格納することができないので、文字列⇄任意の型の変換が必然的に多くなります。

そこでプライベートのラッパー関数を定義するのが（おそらく）定石です。
以下はそのままコピペしてもいいと思います。

```javascript
    _put(k,v){
        const value = JSON.stringify(v)
        storage.put(k, value)
    }

    _get(k){
        const v = storage.get(k)
        return JSON.parse(v)
    }

    _mapGet(k, f){
        const v = storage.mapGet(k, f)
        return JSON.parse(v)
    }

    _mapPut(k, f, v){
        const value = JSON.stringify(v)
        storage.mapPut(k, f, value)
    }
```

