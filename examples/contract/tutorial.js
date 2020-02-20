
class Tutorial {
    init(){
    }

    /**
     * 
     * @param {string} userId 
     */
    getUserName(userId){
        // ユーザーを取ってくる
        // 文字列からパース
        const userInfo = this._mapGet('user', userId)

        // ユーザーがいなければリターン
        if(!userInfo) {
            return
        }
        // 名前だけリターン
        return userInfo.name
    }

    /**
     * 
     * @param {string} userId 
     */
    getUserAge(userId){
        // ユーザーを取ってくる
        // 文字列からパース
        const userInfo = this._mapGet('user', userId)

        // ユーザーがいなければリターン
        if(!userInfo) {
            return
        }
        // 名前だけリターン
        return userInfo.age
    }

    /**
     * 
     * @param {string} userId 
     * @param {string} userName 
     * @param {number} userAge 
     */
    setUser(userId, userName, userAge){
        if(storage.mapHas('user', userId)){
            throw new Error("user already exists")
        }

        // ユーザー情報
        const userInfo = {
            name: userName,
            age: userAge
        }
        // 文字列化する
        // ストレージにしまう
        this._mapPut('user', userId, userInfo)
    }

    //文字列化して保存
    _put(k,v){
        const value = JSON.stringify(v)
        storage.put(k, value)
    }

    //取得して文字列化からパース
    _get(k){
        const v = storage.get(k)
        if(!v) return

        return JSON.parse(v)
    }

    //文字列化して保存
    _mapPut(k,f,v){
        const value = JSON.stringify(v)
        storage.mapPut(k, f, value)
    }

    //取得して文字列化からパース
    _mapGet(k, f){
        const v = storage.mapGet(k, f)
        if(!v) return
        return JSON.parse(v)
    }
}

module.exports = Tutorial